
/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Response = require("users/Jo13bc/core:Response.js");
var Data = require("users/Jo13bc/core:Data.js");

var temperature = {
  layer: function (data) {
    return Response.success(ee.Serializer.encode(data));
  },
  number: function (d) {
    var data = ee.Dictionary(d);
    var classification = data.getNumber("classification").toInt();
    var forest = data.getNumber("forest").toInt();
    var data_ = ee.List([
      {
        id: "forest",
        key: "Tipo de Bosque:",
        value: ee.String(forest).cat(" - ").cat(Data.getFTDescriptions(forest))
      },
      {
        id: "classification",
        key: "Clasificación de Cobertura terrestre:",
        value: ee.String(classification).cat(" - ").cat(Data.getLandUseDescriptions(classification))
      }
    ]);
    return Response.success(data_);
  },
  chart: function (d) {
    return Response.error("Función no desarrollada");
  }
};

function format(name, filter, resp) {
  return Response.then(resp, temperature[name](resp.get("data")));
}

exports.format = format;