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
      { id: "depth", label: "Profundidad", type: "string", unit: "cm" },
      { id: "avg", label: "Porcentaje", type: "number", unit: "%" }
    ]);
    var data_ = Utils.toTable(title, ee.List(data), headers, "Promedio", { id: "depth", toDsc: function (v) { return v; } });
    return Response.success(data_);
  },
  chart: function (title, d) {
    var data = ee.Dictionary(d);
    var data_ = {
      seriesNames: ["Fracción de Arcilla", "Fracción de Arcilla 10", "Fracción de Arcilla 30"],
      options: {
        title: ee.String("Histograma de la ").cat(title),
        xTitle: "Fracción de Arcilla (%)",
        yTitle: "Frecuencia",
        colors: ["39a8a7", "1d6b99", "e37d05"]
      },
      data: ee.Serializer.encode(data.get("dataset")),
      reducer: data.get("reducer")
    };
    return Response.success(data_);
  }
};

function format(name, filter, resp) {
  var title = "Fracción de Arcilla (kg/kg)";
  return Response.then(resp, temperature[name](title, resp.get("data")));
}

exports.format = format;