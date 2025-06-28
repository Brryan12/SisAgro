/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Response = require("users/BAM/SisAgroV1:core/Response.js");

function data() {
  var image = ee.Image("OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02")
    .select("b0", "b10", "b30", "b60", "b100", "b200");
  var resp = ee.Algorithms.If(
    image.bandNames().size().eq(0),
    Response.error("No se encontraron datos"),
    Response.success(image)
  );
  return ee.Dictionary(resp);
}

function getDepth(depth, data) {
  return ee.Dictionary({ depth: depth, avg: data.getNumber("b" + depth).toInt(), isFooter: 0 });
}

var Component = {
  layer: function (filter, image_) {
    var image = image_.clip(filter.geometry);
    var expression = "clay030=(b0*(1/30)+b10*(9/30)+b30*(20/30))";
    var arguments = { b0: image.select("b0"), b10: image.select("b10"), b30: image.select("b30") };
    var data = image.expression(expression, arguments).select("clay030");
    return Response.success(data);
  },
  number: function (filter, image_) {
    var image = image_.clip(filter.geometry)
      .reduceRegion(ee.Reducer.mean(), filter.geometry, filter.indicator.scale);
    var data = ee.List([
      getDepth(0, image),
      getDepth(10, image),
      getDepth(30, image),
      getDepth(60, image),
      getDepth(100, image),
      getDepth(200, image)
    ]);
    return Response.success(data);
  },
  chart: function (filter, image) {
    var data = {
      dataset: image.select("b0", "b10", "b30"),
      reducer: "mean"
    };
    return Response.success(data);
  }

};

function get(name, filter) {
  var resp = data();
  return Response.then(resp, Component[name](filter, ee.Image(resp.get("data"))));
}

exports.get = get;