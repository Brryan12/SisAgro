/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Data = require("users/BAM/SisAgroV1:core/Data.js");

function bold(string) {
  return "<b>" + string + "</b>";
}

function text(string, style) {
  return "<p" + (style ? " style='" + style + "'" : "") + ">" + string + "</p>";
}

function itemList(e, mapper, style) {
  return (
    "<li" + (style ? " style='" + style + "'" : "") + ">" + mapper(e) + "</li>"
  );
}

function list(list_, mapper, style, itemStyle) {
  return (
    "<ul" +
    (style ? " style='" + style + "'" : "") +
    ">" +
    list_
      .map(function (e) {
        return itemList(e, mapper, itemStyle);
      })
      .join("") +
    "</ul>"
  );
}

function listFromInput(inputList, style, itemStyle) {
  return list(
    inputList,
    function (i) {
      return text(bold(i.label + ": ") + i.description, "text-align: left;");
    },
    style,
    itemStyle
  );
}

function col(header) {
  return { id: header.id, label: header.label, type: "string" };
}

function row(element) {
  return {
    c: element.map(function (e) {
      return { v: e };
    })
  };
}

function table(headers, rows, params) {
  var dataTable = {
    cols: headers.map(col),
    rows: rows.map(row)
  };
  return ui.Chart(dataTable, "Table", params ? params : { allowHtml: true });
}

function textTerraClimate(label, articulo, params) {
  return [
    label,
    "Este valor correponde a " + articulo + " " + label.toLowerCase() + ", promediada " + params.output + "  " + params.type + "."
  ];
}

function textClasiHB(label, articulo, isClasificacion) {
  return [
    label,
    "Este valor correponde a " + articulo + " " + label.toLowerCase() + (isClasificacion ? "" : " y la clasificación según el valor obtenido.")
  ];
}

function getParams(filter) {
  var type = "";
  var typeOutput = "";
  var cy = filter.countYears.value;
  if (cy !== Data.getCountYears()[0].value) {
    var art = cy !== Data.getCountYears()[3].value ? "los " : "";
    type = "en " + art + " " + filter.countYears.label.toLowerCase();
  } else {
    type = "en el año " + filter.year.label;
  }
  if (filter.typeOutput.value === Data.getOutputs()[0].value
    && filter.indicator.value === Data.getIndicators()[4].value) {
    typeOutput = "anualmente";
  } else {
    typeOutput = "mensualmente";
  }
  return { type: type, output: typeOutput };
}

function inputGuide(filter) {
  var headers = [
    { id: "filter", label: "Filtro" },
    { id: "description", label: "Descripción" }
  ];
  var inputs = [
    filter.reportType,
    filter.zone,
    filter.indicator,
    filter.countYears,
    filter.year,
    filter.typeOutput,
    filter.longitude,
    filter.latitude
  ];
  var rows = inputs.map(function (i) {
    return [i.title, i.type == 'selector' ? listFromInput(i.values) : i.description];
  });
  return table(headers, rows, { pageSize: 1, allowHtml: true, height: "automatic" });
}

function informationGuide(filter) {
  var headers = [
    { id: "var", label: "Variable" },
    { id: "value", label: "Valor" }
  ];
  var rows = [];
  var indicator = filter.indicator.value;
  var params = getParams(filter);
  switch (indicator) {
    case Data.getIndicators()[0].value:
      rows = informationTemperature(params);
      break;
    case Data.getIndicators()[1].value:
      rows = informationLand(filter)
      break;
    case Data.getIndicators()[2].value:
      rows = informationElevation(filter)
      break;
    case Data.getIndicators()[3].value:
      rows = informationLandUse(filter)
      break;
    case Data.getIndicators()[4].value:
      rows = informationWaterRecovery(filter)
      break;
    case Data.getIndicators()[5].value:
      rows = informationEvapotranpiration(params);
      break;
    case Data.getIndicators()[6].value:
      rows = informationPrecipitation(params);
      break;
    case Data.getIndicators()[7].value:
      rows = informationHidricBalance(params);
      break;
  }
  return table(headers, rows);
}

function informationTemperature(params) {
  var rows = [];
  var generate = function (name) { return textTerraClimate("Temperatura " + name, "la", params) };
  rows.push(generate("promedio"));
  rows.push(generate("máxima"));
  rows.push(generate("mínima"));
  return rows;
}

function informationLand(filter) {
  var rows = [];
  rows.push([
    "Profundidad",
    "Los valores corresponden a la profundidad de la Fracción de arcilla."
  ]);
  rows.push([
    "Porcentaje",
    "Los valores corresponden al porcentaje de concentración de la Fracción de arcilla dada su profundidad."
  ]);
  return rows;
}

function informationElevation(filter) {
  var rows = [];
  rows.push([
    "Elevación",
    "Valor de la elevación en metros sobre el nivel de mar."
  ]);
  return rows;
}

function informationLandUse(filter) {
  var rows = [];
  rows.push([
    "Tipo de Bosque",
    "Descripción y valor del tipo de bosque del punto seleccionado"
  ]);
  rows.push([
    "Clasificación Cobertura terrestre",
    "Descripción y valor de la Clasificación de Cobertura terrestre."
  ]);
  return rows;
}

function informationWaterRecovery(filter) {
  var rows = [];
  var typeOutput = filter.typeOutput.value;
  var type = "anual";
  if (typeOutput !== Data.getOutputs()[0].value) {
    type = "anual p";
  }
  rows.push([
    "Recurrencia de aguas",
    "Valor índice de agua de diferencia normalizada (NDWI) " + type + "."
  ]);
  return rows;
}

function informationEvapotranpiration(params) {
  var rows = [];
  rows.push(textTerraClimate("Evapotranspiración", "la", params));
  return rows;
}

function informationPrecipitation(params) {
  var rows = [];
  rows.push(textTerraClimate("Precipitación", "la", params));
  return rows;
}

function informationHidricBalance(params) {
  var rows = [];
  var generate = function (name, arti) { return textTerraClimate("" + name, arti, params) };
  rows.push(generate("Precipitación", "la"));
  rows.push(generate("EvapotransThornw ETP", "la"));
  rows.push(generate("Deficit presión", "el"));
  rows.push(generate("Almacenamiento", "el"));
  rows.push(generate("Cambio almacenamiento", "la"));
  rows.push(generate("Evap Real", "la"));
  rows.push(generate("Deficit Humedad", "el"));
  rows.push(generate("Exceso Humedad", "el"));
  rows.push(textClasiHB("Índice hídrico", "el"));
  rows.push(textClasiHB("Variación estacional", "la"));
  rows.push(textClasiHB("Eficiencia térmica", "la"));
  rows.push(textClasiHB("Índice de concentración de eficiencia", "el"));
  rows.push(textClasiHB("Clasificación climatológica", "la", true));
  return rows;
}

exports.inputGuide = inputGuide;
exports.informationGuide = informationGuide;