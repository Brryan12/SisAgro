/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/Jo13bc/core:Utils.js");
var Response = require("users/Jo13bc/core:Response.js");

function process(dataset_, filter) {
  var dataset = dataset_.select(
    ["pr", "pet", "aet", "def", "soil"],
    ["p", "etp", "etr", "def", "exc"]
  );
  dataset = Utils.annualData(dataset, filter.yearRange, Utils.datasetMean);
  dataset = Utils.monthData(
    dataset,
    filter.yearRange.get("end"),
    Utils.datasetMean
  );
  dataset = dataset
    .map(function (img) {
      img = Utils.toRescale(img, ["etp", "etr", "def", "exc"], 0.1);
      img = img.addBands(img.expression("dpr=i.p-i.etp", { i: img }));
      img = img.addBands(img.expression("typ=i.dpr<0?-1:1", { i: img }));
      return img;
    })
    .select("p", "etp", "dpr", "etr", "def", "exc", "typ");
  return dataset;
}

function data(filter) {
  var dataset = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE");
  Utils.yearRange(filter, dataset);
  dataset = dataset.filter(filter.yearRange.get("filter"));
  var resp = ee.Algorithms.If(
    dataset.size().eq(0),
    Response.error("No se encontraron datos para el año seleccionado"),
    Response.success(process(dataset, filter))
  );
  return ee.Dictionary(resp);
}

function calAlm(a, c, f) {
  var e =
    "(a.typ == -1 && c.typ == 1) ? (a.alm + c.dpr) : (a.alm * pow(Math.E, (c.dpr/f)))";
  return Utils.cal(c, "alm", e, { a: a, c: c, f: f }).set("level", 1);
}

function calCamAlm(a, c) {
  var e = "c.alm - a.alm";
  return Utils.cal(c, "camAlm", e, { a: a, c: c });
}

function calEtr(c) {
  var e = "c.typ == 1 ? c.etp : (c.p + abs(c.camAlm))";
  return Utils.cal(c, "etr", e, { c: c });
}

function calDef(c) {
  var e = "c.etp - c.etr";
  return Utils.cal(c, "def", e, { c: c });
}

function calExc(c) {
  var e = "c.typ == -1 ? 0 : (c.dpr - c.camAlm)";
  return Utils.cal(c, "exc", e, { c: c });
}

function calAnt(c, v) {
  var e = "(i==0?l:i)-1";
  return Utils.cal(c, "ant", e, {
    i: c.getNumber("month").add(-1),
    l: v.length()
  });
}

function toAlm(values, fc) {
  values = values.map(function (e_) {
    var e = calAnt(ee.Dictionary(e_), values);
    var ant = ee.Dictionary(values.get(e.getNumber("ant")));
    var camRtR = ant.getNumber("typ").eq(1).and(e.getNumber("typ").eq(1));
    return e
      .set("alm", ee.Algorithms.If(camRtR, fc, 0))
      .set("level", ee.Algorithms.If(camRtR, 1, 2));
  });
  var values_ = ee.List(
    values.iterate(function (_, a_) {
      var a = ee.List(a_);
      return a.map(function (c_) {
        var c = ee.Dictionary(c_);
        var ant = ee.Dictionary(a.get(c.getNumber("ant")));
        var condition = ant
          .getNumber("level")
          .eq(1)
          .and(c.getNumber("level").eq(2));
        c = ee.Dictionary(ee.Algorithms.If(condition, calAlm(ant, c, fc), c));
        return c;
      });
    }, values)
  );
  return values_;
}

function toCamAlmEtrDEfExc(values) {
  return values.map(function (c_) {
    var c = ee.Dictionary(c_);
    var ant = ee.Dictionary(values.get(c.getNumber("ant")));
    c = calCamAlm(ant, c);
    c = calEtr(c);
    c = calDef(c);
    c = calExc(c);
    return c.remove(["level", "ant", "typ"]);
  });
}

function calculateData(filter, dataset) {
  var dataMean = dataset
    .select("p", "etp", "dpr", "typ")
    .toBands()
    .reduceRegion({ reducer: ee.Reducer.mean(), geometry: filter.geometry, scale: 1 });
  var values = Utils.processMonthData(dataMean, { p: 0, etp: 0, dpr: 0, typ: 0 });
  values = toAlm(values, filter.zone.fieldCapacity);
  values = toCamAlmEtrDEfExc(values);
  return values;
}

function toImage(filter, d) {
  var date = ee.Date.fromYMD(
    filter.yearRange.get("end"),
    ee.Number(d.get("month")),
    1
  ).millis();
  var bands = ["p", "etp", "etr"];
  return d.toImage(bands).set("system:time_start", date);
}

var Component = {
  layer: function (filter, dataset) {
    var annual = dataset.sum();
    annual = annual.addBands(
      annual.expression("wi=(100*a.exc-60*a.def)/a.etp", { a: annual })
    );
    annual = annual.addBands(
      annual.expression("sv=((a.wi>0?a.def:a.exc)*100)/a.etp", { a: annual })
    );
    annual = Utils.clasificationColors(annual);
    annual = annual.select("r", "g", "b");
    var data = annual.clip(filter.geometry).select("r", "g", "b");
    return Response.success(data);
  },
  number: function (filter, dataset) {
    var data = calculateData(filter, dataset);
    data = data.add(
      Utils.toFooter(
        data,
        { alm: 0, camAlm: 0, def: 0, dpr: 0, etr: 0, exc: 0, etp: 0, p: 0 },
        Utils.sum
      )
    );
    var annual = ee.Dictionary(
      data.get(ee.Number.expression("l-1", { l: data.length() }))
    );
    var waterIndex = ee.Number.expression(
      "((100*a.exc)-(60*a.def)) / a.etp",
      { a: annual }
    );
    var seasonalVariation = ee.Number.expression(
      "((wi > 0 ? a.def : a.exc) * 100) / a.etp",
      { a: annual, wi: waterIndex }
    );
    var dryMonths = data.iterate(function (e_, a_) {
      var e = ee.Dictionary(e_);
      var a = ee.Number(a_);
      var re = ee.Algorithms.If(
        e.getNumber("dpr").lt(0),
        e.getNumber("etp"),
        ee.Number(0)
      );
      return a.add(re);
    }, ee.Number(0));
    var thermalEfficiencyIndex = ee.Number.expression("(dm / a.etp) * 100", {
      a: annual,
      dm: dryMonths
    });
    var data = ee.Dictionary({
      waterIndex: waterIndex,
      seasonalVariation: seasonalVariation,
      thermalEfficiencyIndex: annual.getNumber("etp"),
      efficiencyConcentrationIndex: thermalEfficiencyIndex,
      table: data
    });
    return Response.success(data);
  },
  chart: function (filter, dataset) {
    var collection = calculateData(filter, dataset).map(function (e_) {
      var e = ee.Dictionary(e_);
      return toImage(filter, e);
    });
    var data = {
      dataset: ee.ImageCollection(collection),
      reducer: "mean"
    };
    return Response.success(data);
  }
};

function get(name, filter) {
  var resp = data(filter);
  return Response.then(
    resp,
    Component[name](filter, ee.ImageCollection(resp.get("data")))
  );
}

exports.get = get;
