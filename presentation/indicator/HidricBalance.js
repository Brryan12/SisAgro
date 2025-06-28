/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/BAM/SisAgroV1:core/Utils.js");
var Response = require("users/BAM/SisAgroV1:core/Response.js");
var Data = require("users/BAM/SisAgroV1:core/Data.js");

var SERIES_NAME = [
  "Precipitación",
  "EvapotransThornw ETP",
  "Deficit presión",
  "Almacenamiento",
  "Cambio almacenamiento",
  "Evap Real ETR",
  "Deficit Humedad",
  "Exceso Humedad"
];

var temperature = {
  layer: function (title, data) {
    return Response.success(ee.Serializer.encode(data));
  },
  number: function (title, data_) {
    var data = ee.Dictionary(data_);
    var headers = ee.List([
      { id: "month", label: "Mes", type: "string", unit: "" },
      { id: "p", label: SERIES_NAME[0], type: "number", unit: "" }, //l/m²
      { id: "etp", label: SERIES_NAME[1], type: "number", unit: "" }, //mm
      { id: "dpr", label: SERIES_NAME[2], type: "number", unit: "" },
      { id: "alm", label: SERIES_NAME[3], type: "number", unit: "" },
      { id: "camAlm", label: SERIES_NAME[4], type: "number", unit: "" },
      { id: "etr", label: SERIES_NAME[5], type: "number", unit: "" },
      { id: "def", label: SERIES_NAME[6], type: "number", unit: "" },
      { id: "exc", label: SERIES_NAME[7], type: "number", unit: "" }
    ]);
    var table = Utils.toTable(
      title.getString("text"),
      ee.List(data.get("table")),
      headers,
      "Anual"
    );
    var waterIndex = data.getNumber("waterIndex").toFloat();
    var wi = Data.getClimateClassification(waterIndex);
    var seasonalVariation = data.getNumber("seasonalVariation").toFloat();
    var thermalEfficiencyIndex = data
      .getNumber("thermalEfficiencyIndex")
      .toFloat();
    var efficiencyConcentrationIndex = data
    .getNumber("efficiencyConcentrationIndex")
    .toFloat();
    var tei = Data.getEfficiencyClassification(thermalEfficiencyIndex);
    var eci = Data.getConcentrationClassification(efficiencyConcentrationIndex);
    var data_ = ee.List([
      {
        id: "table",
        key: table.get("title"),
        type: "table",
        value: table
      },
      {
        id: "waterIndex",
        key: "Índice hídrico:",
        value: ee
          .String(waterIndex.format("%.1f"))
          .cat(" - ")
          .cat(wi.getString("label"))
      },
      {
        id: "seasonalVariation",
        key: "Variación estacional:",
        value: ee
          .String(seasonalVariation.format("%.1f"))
          .cat(" - ")
          .cat(
            Data.getSeasonalClassification(
              seasonalVariation,
              wi.getNumber("value"),
              undefined,
              ","
            )
          )
      },
      {
        id: "thermalEfficiencyIndex",
        key: "Eficiencia térmica:",
        value: ee
          .String(thermalEfficiencyIndex.format("%.1f"))
          .cat(" - ")
          .cat(tei.getString("label"))
      },
      {
        id: "efficiencyConcentrationIndex",
        key: "Índice de concentración de eficiencia:",
        value: ee
          .String(efficiencyConcentrationIndex.format("%.1f"))
          // .cat(" - ")
          // .cat(eci.getString("label"))
      },
      {
        id: "climateClassification",
        key: "Clasificación climatológica:",
        value: ee
          .String(wi.getString("symbol"))
          .cat("(")
          .cat(
            Data.getSeasonalClassification(
              seasonalVariation,
              wi.getNumber("value"),
              "symbol",
              ""
            )
          )
          .cat(")")
          .cat(tei.getString("symbol"))
          .cat(eci.getString("symbol"))
      }
    ]);
    return Response.success(data_);
  },
  chart: function (title, d) {
    var data = ee.Dictionary(d);
    var dataset = ee
      .ImageCollection(data.get("dataset"))
      .select(
        ["p", "etp", "etr"],
        [SERIES_NAME[0], SERIES_NAME[1], SERIES_NAME[5]]
      );
    var data_ = {
      xSeriesProperties: "system:time_start",
      seriesNames: [],
      ticks: title.get("ticks"),
      options: {
        title: title.getString("text"),
        xTitle: "Mes",
        yTitle: "mm",
        colors: ["39a8a7", "e37d05", "1d6b99"],
        seriesType: "line",
        series: { 2: { type: "bars" } }
      },
      data: ee.Serializer.encode(dataset),
      reducer: data.get("reducer")
    };
    return Response.success(data_);
  }
};

function format(name, filter, resp) {
  var title = Utils.graphicTitle(
    "Balance Hídrico ",
    filter.yearRange,
    filter.reportType.value
  );
  return Response.then(resp, temperature[name](title, resp.get("data")));
}

exports.format = format;
