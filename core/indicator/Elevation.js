/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Response = require("users/Jo13bc/core:Response.js");

function data() {
  var dataset = ee.ImageCollection("JAXA/ALOS/AW3D30/V3_2").select(["DSM"], ["dsm"]);
  var resp = ee.Algorithms.If(
    dataset.size().eq(0),
    Response.error("No se encontraron datos"),
    Response.success(dataset)
  );
  return ee.Dictionary(resp);
}

var Component = {
  layer: function (filter, dataset) {
    var projection = dataset.first().select(0).projection();
    var slope = dataset.mosaic().setDefaultProjection(projection);
    var data = ee.Terrain.slope(slope).clip(filter.geometry);
    return Response.success(data);
  },
  number: function (filter, dataset) {
    var data = dataset.mean()
      .clip(filter.geometry)
      .reduceRegion(ee.Reducer.mean(), filter.geometry, filter.indicator.scale);
    return Response.success(data);
  },
  chart: function (filter, dataset) {
    return Response.error("Función no desarrollada");
  }

};

function get(name, filter) {
  var resp = data();
  return Response.then(resp, Component[name](filter, ee.ImageCollection(resp.get("data"))));
}

exports.get = get;
