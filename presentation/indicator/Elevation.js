
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
    var dsm = data.getNumber("dsm").toInt();
    var data_ = ee.List([
      {
        id: "dsm",
        key: "Elevación sobre nivel del mar:",
        value: ee.String(dsm).cat(" m")
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