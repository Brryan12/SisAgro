/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/Jo13bc/core:Utils.js");
var Response = require("users/Jo13bc/core:Response.js");
var scalePixel = require("users/Jo13bc/presentation:Configuration.js").scales.cloudyPixelPercentage;

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
    qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000)
    .select("B.*")
    .copyProperties(image, ["system:time_start"]);
}

function process(dataset_, filter) {
  var countYears = ee.Number(filter.countYears.value);
  var dataset = dataset_.map(maskS2clouds)
    .select("B3", "B8")
    .map(function (auxImg) {
      return auxImg.addBands(auxImg.expression(
        'ndwi=(b3-b8)/(b3+ b8)', {
        'b3': auxImg.select('B3'),
        'b8': auxImg.select('B8')
      }));
    })
    .select("ndwi");
  dataset = ee.Algorithms.If(
    countYears.eq(0),
    Utils.monthData(dataset, filter.yearRange.get("end"), Utils.datasetMean),
    Utils.annualData(dataset, filter.yearRange, Utils.datasetMean)
  );
  return ee.ImageCollection(dataset);
}

function data(filter) {
  var dataset = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
    .filterBounds(filter.geometry)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', scalePixel));
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
    var data = dataset.mean().clip(filter.geometry).select("ndwi");
    return Response.success(data);
  },
  number: function (filter, dataset) {
    var dataMean = dataset.mean()
      .clip(filter.geometry)
      .reduceRegion(ee.Reducer.mean(), filter.geometry, filter.indicator.scale);
    return Response.success(dataMean);
  },
  chart: function (filter, dataset) {
    var data = {
      dataset: dataset.select("ndwi"),
      reducer: "mean"
    };
    return Response.success(data);
  }

};

function get(name, filter) {
  var resp = data(filter);
  return Response.then(resp, Component[name](filter, ee.ImageCollection(resp.get("data"))));
}

exports.get = get;