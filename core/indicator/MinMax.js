/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Data = require("users/BAM/SisAgroV1:core/Data.js");
var Utils = require("users/BAM/SisAgroV1:core/Utils.js");
var Response = require("users/BAM/SisAgroV1:core/Response.js");

function process(dataset_) {
  var dataset = dataset_.map(function (img) {
    return img.addBands(
      img.expression("t=(max+min)/2", {
        max: img.select("tmmx"),
        min: img.select("tmmn")
      })
    );
  }).select(["pr", "pet", "t"], ["p", "etp", "t"]);
  var range = Utils.getMinMaxYear(dataset);
  dataset = ee.ImageCollection(
    ee.List.sequence(range.get("min"), range.get("max"))
      .map(function (year) {
        return dataset.filter(ee.Filter.calendarRange(year, year, "year"))
          .mean();
      })
  );
  return dataset;
}

function data(geometry) {
  var dataset = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")
    .filterBounds(geometry);
  dataset = ee.Algorithms.If(
    dataset.size().eq(0),
    Response.error("No se encontraron datos para la colección consultada"),
    Response.success(process(dataset))
  );
  return ee.Dictionary(dataset);
}

function getPalette(indicators, pos) {
  var indicator = ee.Dictionary(indicators.get(pos));
  return ee.List(indicator.get("palette"));
}

function getDescription(indicators, pos) {
  var indicator = ee.Dictionary(indicators.get(pos));
  return ee.List(indicator.get("paletteDescription"));
}

var MinMax = {
  values: function (dataset, geometry, indicators) {
    var minMax = dataset.mean()
      .reduceRegion(ee.Reducer.minMax(), geometry)
      .map(function (k_, v_) {
        var k = ee.String(k_);
        var v = ee.Number(v_);
        var scale = ee.Algorithms.If(k.equals("ept_max") || k.equals("etp_min"), 1, 0.1);
        return v.multiply(scale).round();
      });
    var result = ee.Dictionary({
      0: { max: minMax.getNumber("t_max"), min: minMax.getNumber("t_min"), palette: getPalette(indicators, 0), description: getDescription(indicators, 0) },
      5: { max: minMax.getNumber("etp_max"), min: minMax.getNumber("etp_min"), palette: getPalette(indicators, 5), description: getDescription(indicators, 5) },
      6: { max: minMax.getNumber("p_max"), min: minMax.getNumber("p_min"), palette: getPalette(indicators, 6), description: getDescription(indicators, 6) }
    });
    return Response.success(result);
  }
};

function get() {
  var geometry = Data.getCostaRica();
  var indicators = ee.List(Data.getIndicators());
  var resp = data(geometry);
  return Response.then(resp, MinMax.values(ee.ImageCollection(resp.get("data")), geometry, indicators));
}

exports.get = get;