/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Response = require("users/Jo13bc/core:Response.js");

function data(filter) {
  var name = "COPERNICUS/Landcover/100m/Proba-V-C3/Global/" + filter.year.label;
  var image = ee.Image(name).select(["discrete_classification", "forest_type"], ["classification", "forest"]);
  var resp = ee.Algorithms.If(
    image.bandNames().size().eq(0),
    Response.error("No se encontraron datos"),
    Response.success(image)
  );
  return ee.Dictionary(resp);
}

var Component = {
  layer: function (filter, image) {
    var data = image.clip(filter.geometry)
      .select("classification");
    return Response.success(data);
  },
  number: function (filter, image_) {
    var data = image_.clip(filter.geometry)
      .reduceRegion(ee.Reducer.mean(), filter.geometry, filter.indicator.scale);
    return Response.success(data);
  },
  chart: function (filter, image) {
    return Response.error("Función no desarrollada");
  }

};

function get(name, filter) {
  var resp = data(filter);
  return Response.then(resp, Component[name](filter, ee.Image(resp.get("data"))));
}

exports.get = get;