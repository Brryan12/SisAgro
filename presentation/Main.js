/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */
var MinMax = require("users/Jo13bc/core:indicator/MinMax.js");
var Response = require("users/Jo13bc/core:Response.js");
var indicators = {
  core: {
    0: require("users/Jo13bc/core:indicator/Temperature.js"),
    1: require("users/Jo13bc/core:indicator/Land.js"),
    2: require("users/Jo13bc/core:indicator/Elevation.js"),
    3: require("users/Jo13bc/core:indicator/LandUse.js"),
    4: require("users/Jo13bc/core:indicator/WaterRecovery.js"),
    5: require("users/Jo13bc/core:indicator/Evapotranspiration.js"),
    6: require("users/Jo13bc/core:indicator/Precipitation.js"),
    7: require("users/Jo13bc/core:indicator/HidricBalance.js")
  },
  presentation: {
    0: require("users/Jo13bc/presentation:indicator/Temperature.js"),
    1: require("users/Jo13bc/presentation:indicator/Land.js"),
    2: require("users/Jo13bc/presentation:indicator/Elevation.js"),
    3: require("users/Jo13bc/presentation:indicator/LandUse.js"),
    4: require("users/Jo13bc/presentation:indicator/WaterRecovery.js"),
    5: require("users/Jo13bc/presentation:indicator/Evapotranspiration.js"),
    6: require("users/Jo13bc/presentation:indicator/Precipitation.js"),
    7: require("users/Jo13bc/presentation:indicator/HidricBalance.js")
  }
}

function fetch(module, id) {
  return indicators[module][id];
}

function search(filter, resolve, reject) {
  try {
    var output = filter.isLayer ? "layer" : filter.typeOutput.name;
    var resp = fetch("core", filter.indicator.value).get(output, filter);
    var respFormatted = fetch("presentation", filter.indicator.value).format(output, filter, resp);
    Response.data(respFormatted, resolve, reject);
  } catch (ex) {
    reject(ex);
  }
}

function viewParams(resolve, reject) {
  try {
    var resp = MinMax.get();
    Response.data(resp, resolve, reject);
  } catch (ex) {
    reject(ex);
  }
}

exports.search = search;
exports.viewParams = viewParams;