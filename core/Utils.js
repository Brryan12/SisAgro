/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Data = require("users/BAM/SisAgroV1:core/Data.js");

var FIRST_MONTH = "-01-01";
var LAST_MONTH = "-12-31";

function getOrElse(value_, default_) {
  return value_ ? value_ : default_;
}

function toRescale(image_, column_, value_) {
  var rescaled = image_.select(column_).multiply(value_);
  return image_.addBands(rescaled, column_, true);
}

function getValue(value, fix) {
  var fixValid = fix !== null && fix !== undefined;
  return value !== null && value !== undefined
    ? Number(value.toFixed(fixValid ? fix : 2))
    : 0;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate())
  ].join("-");
}

function createDate(year, month, day) {
  return ee.Date.fromYMD(year, month, day);
}

function lastDay(date) {
  return date.advance(1, "month").advance(-1, "day");
}

function datasetMean(dataset) {
  return dataset.mean();
}

function datasetSum(dataset) {
  return dataset.sum();
}

function dataByMonth(dataset, range, functionByProperty) {
  var year = range.getNumber("year");
  return ee.List.sequence(range.getNumber("start"), range.getNumber("end")).map(
    function (i_) {
      var i = ee.Number(i_);
      var start = createDate(year, i, 1);
      var datasetByProperty = dataset.filter(
        ee.Filter.calendarRange(i, i, "month")
      );
      var result = functionByProperty(datasetByProperty);
      return result
        .set("system:time_start", start.millis())
        .set("system:time_end", lastDay(start).millis())
        .set("empty", result.bandNames().size().eq(0));
    }
  );
}

function dataByYear(dataset, range, functionByProperty) {
  return ee.List.sequence(range.getNumber("start"), range.getNumber("end"))
    .map(function (i_) {
      var i = ee.Number(i_);
      var datasetByProperty = dataset.filter(
        ee.Filter.calendarRange(i, i, "year")
      );
      return dataByMonth(
        datasetByProperty,
        ee.Dictionary({ start: 1, end: 12, year: i }),
        functionByProperty
      );
    })
    .flatten();
}

function dataByDate(dataBy, dataset, range, functionByProperty) {
  return ee.ImageCollection.fromImages(
    dataBy(dataset, range, functionByProperty)
  )
    .filter(ee.Filter.eq("empty", 0))
    .map(function (img) {
      return ee
        .Image([])
        .addBands(img)
        .copyProperties(img, [
          "system:index",
          "system:time_start",
          "system:time_end"
        ]);
    });
}

function annualData(dataset, yearRange, functionByProperty) {
  return dataByDate(dataByYear, dataset, yearRange, functionByProperty);
}

function monthData(dataset, year, functionByProperty) {
  var range = ee.Dictionary({ start: 1, end: 12, year: year });
  return dataByDate(dataByMonth, dataset, range, functionByProperty);
}

function removeLayer(name) {
  var layers = Map.layers();
  var names = [];
  layers.forEach(function (lay) {
    var lay_name = lay.getName();
    names.push(lay_name);
  });
  var index = names.indexOf(name);
  if (index > -1) {
    var layer = layers.get(index);
    Map.remove(layer);
  } else {
    throw "Layer " + name + " not found";
  }
}

function updateLayer(i, data, params_, shown, opacity) {
  var lay = Map.layers().get(i);
  var params = null;
  if (params_) {
    params = JSON.parse(JSON.stringify(params_));
    if (params.bands) {
      delete params.palette;
    }
  }
  var nlay = ui.Map.Layer(
    data ? data : lay.getEeObject(),
    params ? params : lay.getVisParams(),
    lay.getName(),
    (shown !== undefined && shown !== null) ? shown : lay.getShown(),
    (opacity !== undefined && opacity !== null) ? opacity : lay.getOpacity()
  );
  Map.layers().set(i, nlay);
}

function addLayer(name, params) {
  Map.addLayer(
    ee.Geometry.MultiPoint([]),
    params ? params : {},
    name,
    false,
    0
  );
  return Map.layers().length() - 1;
}

function removeLayers(LAYERS, label) {
  for (var i = 0; i < LAYERS.length; i++) {
    removeLayer(label);
  }
}

function getFromTime(time, unit) {
  return ee.Date(time).get(unit);
}

function getYear(time) {
  return getFromTime(time, "year");
}

function getMinMaxYear(dataset) {
  var minMax = dataset.reduceColumns(ee.Reducer.minMax(), [
    "system:time_start"
  ]);
  var min = getYear(minMax.getNumber("min"));
  var max = getYear(minMax.getNumber("max"));
  return ee.Dictionary({ min: min, max: max });
}

function getMinMaxYearImage(dataset) {
  var start = dataset.get("system:time_start");
  var end = dataset.get("system:time_end");
  return ee.Dictionary({ min: getYear(start), max: getYear(end) });
}

function yearRange(filter, dataset) {
  var year = ee.Number.parse(filter.year.label),
    countYears = filter.countYears.value;
  var now = ee.Date(new Date());
  var startYear = year;
  var endYear = year;
  if (countYears == 1) {
    endYear = getYear(now);
    startYear = endYear.subtract(5);
  } else if (countYears == 2) {
    endYear = getYear(now);
    startYear = endYear.subtract(30);
  } else if (countYears == 3) {
    if (dataset) {
      var calStart = getMinMaxYearImage;
      if (dataset instanceof ee.ImageCollection) {
        calStart = getMinMaxYear;
      }
      endYear = getYear(now);
      startYear = calStart(dataset).getNumber("min");
    } else {
      endYear = getYear(now);
      startYear = endYear.subtract(50);
    }
  }
  var filter_ = ee.Filter.date(
    ee.String(startYear).cat(FIRST_MONTH),
    ee.String(endYear).cat(LAST_MONTH)
  );
  filter.yearRange = ee.Dictionary({
    start: startYear,
    end: endYear,
    filter: filter_
  });
}

function toTrick(year, month, isIndex) {
  var value = createDate(year, month.getNumber("v"), 1);
  var f = ee.Algorithms.If(
    isIndex,
    month.getString("d"),
    ee.String(year).cat("-").cat(month.getString("f"))
  );
  return ee.Dictionary({ v: value.millis(), f: f });
}

function graphicTitleTicks(start, end, isIndex) {
  var months = ee.List(Data.getMonths());
  var start = ee.Algorithms.If(isIndex, end, start);
  return ee.List.sequence(start, end)
    .map(function (i_) {
      var i = ee.Number(i_).toInt();
      return months.map(function (m_) {
        var m = ee.Dictionary(m_);
        return toTrick(i, m, isIndex);
      });
    })
    .flatten();
}

function graphicTitleAnnual(title_, start, end, isIndex) {
  var title = title_.cat("entre el ").cat(start).cat(" y el ").cat(end);
  var ticks = graphicTitleTicks(start, end, isIndex);
  return ee.Dictionary({ text: title, isAnnual: true, ticks: ticks });
}

function graphicTitleMonth(title_, start, isIndex) {
  var title = title_.cat("para el ").cat(start);
  var ticks = graphicTitleTicks(start, start, isIndex);
  return ee.Dictionary({ text: title, isAnnual: false, ticks: ticks });
}

function graphicTitle(title_, range, reportType) {
  var title = ee.String(title_);
  var start = ee.Number(range.get("start"));
  var end = ee.Number(range.get("end"));
  var isIndex = ee.Number(reportType).eq(Data.getReportTypes()[1].value);
  var result = ee.Algorithms.If(
    start.neq(end),
    graphicTitleAnnual(title, start, end, isIndex),
    graphicTitleMonth(title, start, isIndex)
  );
  return ee.Dictionary(result);
}

function getMinMaxValue(scale, value, dataset) {
  var geometry = Data.getCostaRica();
  var dataset_ = dataset.filterBounds(geometry);
  var range = getMinMaxYear(dataset_);
  var dataset_means = ee.ImageCollection(
    ee.List.sequence(range.get("min"), range.get("max")).map(function (i) {
      return dataset_.filter(ee.Filter.calendarRange(i, i, "year")).mean();
    })
  );
  var minMax = dataset_means
    .reduceRegion(ee.Reducer.minMax(), geometry)
    .multiply(scale)
    .round();
  return ee.Dictionary({
    value: value,
    min: minMax.get("min"),
    max: minMax.get("max")
  });
}

function getDscMonth(i_) {
  var i = ee.Number(i_);
  var month = ee.Dictionary(ee.List(Data.getMonths()).get(i.subtract(1)));
  return month.get("d");
}

function cal(d, c, e, p) {
  var r = ee.Number.expression(e, p);
  return d.set(c, r);
}

function sum(a, b, c) {
  var e = ee.String("a.").cat(c).cat(" + b.").cat(c);
  return cal(a, c, e, { a: a, b: b });
}

function mean(a, b, c) {
  var e = ee.String("(a.").cat(c).cat(" + b.").cat(c).cat(")/2");
  return cal(a, c, e, { a: a, b: b });
}

function toFooter(values, nil_, convert) {
  var nil = ee.Dictionary(nil_);
  return ee
    .Dictionary(
      values.iterate(function (c_, a_) {
        var a = ee.Dictionary(a_);
        var c = ee.Dictionary(c_);
        return nil.keys().iterate(function (p, an_) {
          var an = ee.Dictionary(an_);
          return convert(an, c, p);
        }, a);
      }, nil)
    )
    .set("month", ee.Number(0).toInt())
    .set("isFooter", ee.Number(1).toInt());
}

function processMonthData(data, nil_, convertFooter) {
  var nil = ee.Dictionary(nil_);
  var countData = data.keys().length();
  var max = ee.Number.expression("(a/b)-1", {
    a: countData,
    b: nil.keys().length()
  });
  var result = ee.List.sequence(0, max).map(function (i_) {
    var i = ee.Number(i_).toInt();
    return ee
      .Dictionary(
        nil.keys().iterate(function (p, a_) {
          var a = ee.Dictionary(a_);
          var value = data.getNumber(ee.String(i).cat("_").cat(p)).round();
          return a.set(p, value);
        }, ee.Dictionary({}))
      )
      .set("month", i.add(1))
      .set("isFooter", ee.Number(0).toInt());
  });
  if (convertFooter) {
    result = result.add(toFooter(result, nil_, convertFooter));
  }
  return result;
}

function toTable(title, values, headers, footer, head_) {
  var head = head_ ? head_ : { id: "month", toDsc: getDscMonth };
  var isGray = true;
  var pH_ = ee.String("text-align: left; font-weight: bold;");
  var pB_ = ee.String("text-align: right;");
  var rows = values.map(function (v_) {
    var v = ee.Dictionary(v_);
    var isFooter = v.getNumber("isFooter").eq(1);
    isGray = ee.Algorithms.If(isGray, false, true);
    var color = ee.Algorithms.If(isGray, " background: rgba(0,0,0,0.04);", "");
    var pH = ee.Dictionary({ style: pH_.cat(color) });
    var pB = ee.Dictionary({
      style: pB_
        .cat(color)
        .cat(ee.Algorithms.If(isFooter, " font-weight: bold;", ""))
    });
    var headName = ee.Algorithms.If(
      isFooter,
      footer,
      head.toDsc(v.get(head.id))
    );
    var c = ee.List(
      headers.iterate(function (h_, a_) {
        var h = ee.Dictionary(h_);
        var a = ee.List(a_);
        var hId = h.getString("id");
        var isHead = hId.equals(head.id);
        var row = ee.Dictionary({
          v: v.getNumber(hId),
          f: ee.Algorithms.If(
            isHead,
            ee.String(headName).cat(" ").cat(h.getString("unit")),
            ee
              .String(v.getNumber(hId).toInt())
              .cat(" ")
              .cat(h.getString("unit"))
          ),
          p: ee.Algorithms.If(isHead, pH, pB)
        });
        return a.add(row);
      }, ee.List([]))
    );
    return ee.Dictionary({ c: c });
  });
  return ee.Dictionary({
    title: title,
    datatable: { cols: headers, rows: rows }
  });
}

function clasificationColors(img) {
  var wiC = Data.getColorR();
  var svC = Data.getColorG();
  var teiC = Data.getColorB();
  img = img.addBands(img.expression("r=" + wiC, { v: img.select("wi") }));
  img = img.addBands(
    img.expression("g=" + svC, { v: img.select("sv"), r: img.select("r") })
  );
  img = img.addBands(img.expression("b=" + teiC, { v: img.select("etp") }));
  return img;
}

exports.getOrElse = getOrElse;

exports.toRescale = toRescale;

exports.getValue = getValue;

exports.formatDate = formatDate;

exports.annualData = annualData;

exports.monthData = monthData;

exports.removeLayer = removeLayer;

exports.removeLayers = removeLayers;

exports.yearRange = yearRange;

exports.graphicTitle = graphicTitle;

exports.getMinMaxValue = getMinMaxValue;

exports.getDscMonth = getDscMonth;

exports.processMonthData = processMonthData;

exports.updateLayer = updateLayer;

exports.getMinMaxYear = getMinMaxYear;

exports.toFooter = toFooter;

exports.cal = cal;

exports.sum = sum;

exports.mean = mean;

exports.datasetMean = datasetMean;

exports.datasetSum = datasetSum;

exports.toTable = toTable;

exports.addLayer = addLayer;

exports.clasificationColors = clasificationColors;
