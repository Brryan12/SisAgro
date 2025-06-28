/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/Jo13bc/core:Utils.js");
var Response = require("users/Jo13bc/core:Response.js");

function process(dataset_, filter) {
  var countYears = ee.Number(filter.countYears.value);
  var dataset = dataset_
    .map(function (img) {
      var auxImg = Utils.toRescale(
        img,
        ["tmmn", "tmmx"],
        filter.indicator.scale
      );
      return auxImg.addBands(
        auxImg.expression("tempAvg=(max+min)/2", {
          max: auxImg.select("tmmx"),
          min: auxImg.select("tmmn")
        })
      );
    })
    .select(["tmmn", "tmmx", "tempAvg"], ["tempMin", "tempMax", "tempAvg"]);
  dataset = ee.Algorithms.If(
    countYears.eq(0),
    Utils.monthData(dataset, filter.yearRange.get("end"), Utils.datasetMean),
    Utils.annualData(dataset, filter.yearRange, Utils.datasetMean)
  );
  return ee.ImageCollection(dataset);
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

var Component = {
  layer: function (filter, dataset) {
    var data = dataset.mean().clip(filter.geometry).select("tempAvg");
    return Response.success(data);
  },
  number: function (filter, dataset) {
    var dataMean = Utils.monthData(
      dataset,
      filter.yearRange.get("end"),
      Utils.datasetMean
    )
      .toBands()
      .reduceRegion(ee.Reducer.mean(), filter.geometry, filter.indicator.scale);
    var data = Utils.processMonthData(
      dataMean,
      { tempMin: 0, tempMax: 0, tempAvg: 0 },
      Utils.mean
    );
    return Response.success(data);
  },
  chart: function (filter, dataset) {
    var data = {
      dataset: dataset.select("tempAvg", "tempMin", "tempMax"),
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
