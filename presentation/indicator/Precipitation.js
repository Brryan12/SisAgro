/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/BAM/SisAgroV1:core/Utils.js");
var Response = require("users/BAM/SisAgroV1:core/Response.js");

var temperature = {
  layer: function (title, data) {
    return Response.success(ee.Serializer.encode(data));
  },
  number: function (title, data) {
    var headers = ee.List([
      { id: "month", label: "Mes", type: "string", unit: "" },
      { id: "p", label: "Promedio", type: "number", unit: "l/m²" }
    ]);
    var data_ = Utils.toTable(title.getString("text"), ee.List(data), headers, "Promedio");
    return Response.success(data_);
  },
  chart: function (title, d) {
    var data = ee.Dictionary(d);
    var data_ = {
      xSeriesProperties: "system:time_start",
      seriesNames: ["Promedio"],
      ticks: title.get("ticks"),
      options: {
        title: title.getString("text"),
        xTitle: "Año - Mes",
        yTitle: "l/m²",
        colors: ["39a8a7", "1d6b99", "e37d05"]
      },
      data: ee.Serializer.encode(data.get("dataset")),
      reducer: data.get("reducer")
    };
    return Response.success(data_);
  }
};

function format(name, filter, resp) {
  var title = Utils.graphicTitle("Precipitaciones promedio en l/m² ", filter.yearRange, filter.reportType.value);
  return Response.then(resp, temperature[name](title, resp.get("data")));
}

exports.format = format;