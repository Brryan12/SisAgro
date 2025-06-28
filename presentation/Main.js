/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */
var MinMax = require("users/BAM/SisAgroV1:core/indicator/MinMax.js");
var Response = require("users/BAM/SisAgroV1:core/Response.js");
var indicators = {
  core: {
    0: require("users/BAM/SisAgroV1:core/indicator/Temperature.js"),
    1: require("users/BAM/SisAgroV1:core/indicator/Land.js"),
    2: require("users/BAM/SisAgroV1:core/indicator/Elevation.js"),
    3: require("users/BAM/SisAgroV1:core/indicator/LandUse.js"),
    4: require("users/BAM/SisAgroV1:core/indicator/WaterRecovery.js"),
    5: require("users/BAM/SisAgroV1:core/indicator/Evapotranspiration.js"),
    6: require("users/BAM/SisAgroV1:core/indicator/Precipitation.js"),
    7: require("users/BAM/SisAgroV1:core/indicator/HidricBalance.js")
  },
  presentation: {
    0: require("users/BAM/SisAgroV1:presentation/indicator/Temperature.js"),
    1: require("users/BAM/SisAgroV1:presentation/indicator/Land.js"),
    2: require("users/BAM/SisAgroV1:presentation/indicator/Elevation.js"),
    3: require("users/BAM/SisAgroV1:presentation/indicator/LandUse.js"),
    4: require("users/BAM/SisAgroV1:presentation/indicator/WaterRecovery.js"),
    5: require("users/BAM/SisAgroV1:presentation/indicator/Evapotranspiration.js"),
    6: require("users/BAM/SisAgroV1:presentation/indicator/Precipitation.js"),
    7: require("users/BAM/SisAgroV1:presentation/indicator/HidricBalance.js")
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