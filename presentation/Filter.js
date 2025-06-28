/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Configuration = require("users/BAM/SisAgroV1:presentation/Configuration.js");

function addFilter(context, name, values, filtered) {
  context[name] = {
    type: 'selector',
    filtered: filtered ? filtered : values,
    values: values,
    value: values[0],
    title: Configuration.label.filter[name]
  };
}

function addTextbox(context, name, placeholder, description) {
  context[name] = {
    type: 'inputText',
    placeholder: placeholder,
    value: null,
    title: Configuration.label.filter[name],
    description: description
  };
}

function init(reportTypes, zones, indicators, countYears, years, typesOutput) {
  var filter = {};
  addFilter(filter, "reportType", reportTypes);
  addFilter(filter, "zone", zones);
  addFilter(
    filter,
    "indicator",
    indicators,
    indicators.filter(function (v) {
      return v.reportType === 0;
    })
  );
  var placeholder = "Ingresa un valor o selecciona un punto en el mapa";
  addFilter(filter, "countYears", countYears);
  addFilter(filter, "year", years);
  addFilter(filter, "typeOutput", typesOutput);
  addTextbox(filter, "longitude", placeholder, "Contiene la longitud del punto seleccionado o el dato ingresado es buscado en el mapa");
  addTextbox(filter, "latitude", placeholder, "Contiene la latitud del punto seleccionado o el dato ingresado es buscado en el mapa");
  filter.isPoint = null;
  filter.pixels = Configuration.scales.pixelsZone;
  filter.geometry = filter.zone.data;
  filter.zoneParams = {
    1: {
      max: 100, min: 2, palette: indicators[1].palette,
      description: indicators[1].paletteDescription,
    },
    2: {
      max: 130, min: 0, palette: indicators[2].palette,
      description: indicators[2].paletteDescription,
    },
    3: {
      max: null, min: null, palette: indicators[3].palette,
      description: indicators[3].paletteDescription,
    },
    4: {
      max: 1, min: -1, palette: indicators[4].palette,
      description: indicators[4].paletteDescription,
    },
    7: {
      max: 255,
      min: 0,
      palette: indicators[7].palette,
      description: indicators[7].paletteDescription,
      bands: ["r", "g", "b"]
    }
  };
  return filter;
}

exports.init = init;
