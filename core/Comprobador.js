/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */
 
var Response = require("users/BAM/SisAgroV1:core/Response.js");
var indicators = {
  0: require("users/BAM/SisAgroV1:core/indicator/Temperature.js"),
  1: require("users/BAM/SisAgroV1:core/indicator/Land.js"),
  2: require("users/BAM/SisAgroV1:core/indicator/Elevation.js"),
  3: require("users/BAM/SisAgroV1:core/indicator/LandUse.js"),
  4: require("users/BAM/SisAgroV1:core/indicator/WaterRecovery.js"),
  5: require("users/BAM/SisAgroV1:core/indicator/Evapotranspiration.js"),
  6: require("users/BAM/SisAgroV1:core/indicator/Precipitation.js"),
  7: require("users/BAM/SisAgroV1:core/indicator/HidricBalance.js")
};

function fetch(id) {
  return indicators[id];
}

function search(filter, resolve, reject) {
  var output = filter.isLayer ? "layer" : filter.typeOutput.name;
  var resp = fetch(filter.indicator.value).get(output, filter);
  print(resp)
  if(output === "layer"){
    resp = resp.set("data", ee.Serializer.encode(resp.get("data")));
  }
  Response.data(resp, resolve, reject);
}

var Data = require("users/BAM/SisAgroV1:core/Data.js");
var Configuration = require("users/BAM/SisAgroV1:presentation/Configuration.js");
var Style = Configuration.style;

var longitude = -85.56207;
var latitude = 10.0621341666667;

var filter = {
  zone: Data.getZones()[7],
  indicator: Data.getIndicators()[7],
  countYears: Data.getCountYears()[2],
  year: Data.getYears()[0],
  typeOutput: Data.getOutputs()[0],
  cursor: ee.Geometry.Point(longitude, latitude),
  isLayer: false,
  ranges: [],
  zoneParams : {
    1: { max: 100, min: 2, palette: Data.getIndicators()[1].palette },
    2: { max: 130, min: 0, palette: Data.getIndicators()[2].palette },
    3: { max: null, min: null, palette: Data.getIndicators()[3].palette },
    4: { max: 1, min: -1, palette: Data.getIndicators()[4].palette },
    7: { max: 1, min: 0, palette: Data.getIndicators()[7].palette }
  }
};

filter.geometry = filter.isLayer ?  filter.zone.data : filter.cursor,
filter.pixels = filter.isLayer ? Configuration.scales.pixelsZone : Configuration.scales.pixelsCursor;

function procesarDatos(result) {
  if (!result) throw "Hubo un problema al procesar los datos";
  print(result);
  // result = ee.Image(ee.Deserializer.decode(result));
  // var visParams = {
  //   min: 0,
  //   max: 255,
  //   bands: ['r', 'g', 'b']
  // };
  // var zp = filter.zoneParams[filter.indicator.value];
  // var t = ui.Thumbnail({
  //   image: ee.Image.pixelLonLat().select(0),
  //   params: {
  //     bbox: [0, 0, 1, 0.1],
  //     dimensions: "100x10",
  //     format: "png",
  //     palette: zp.palette
  //   }
  // });
  // print(t, result);
  // Map.addLayer(result, visParams);
}

function procesarGrafico(resultado) {
  print(chart);
}

search(
  filter,
  filter.typeOutput === Data.getOutputs()[0] ? procesarDatos : procesarGrafico,
  function(err){ print("err", err); }
);