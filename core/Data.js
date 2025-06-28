/**
 * @module Core
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var ASSETS_ROOT = "projects/ee-jo13bc-hello-world/assets/";
var ASSETS_ZONES = ASSETS_ROOT + "zones/";
var ASSETS_ICONS = ASSETS_ROOT + "icons/";
var NOW = new Date();
var FIRST_YEAR = 2015;
var NULL = -99999999;

function getZoneGeometry(zoneName) {
  var name = ASSETS_ZONES + zoneName.replace(" ", "_").toLowerCase();
  return ee.FeatureCollection(name).geometry();
}

function getCostaRica() {
  return getZoneGeometry("costa_rica");
}

function loadImage(name) {
  return ee.Image(ASSETS_ICONS + name).visualize();
}

var ICONS = {
  arrow: {
    left: { value: loadImage("left_arrow"), height: "35px", width: "35px" },
    right: {
      value: loadImage("right_arrow"),
      height: "35px",
      width: "35px",
      opacity: 1
    },
    up: { value: loadImage("up_arrow"), height: "35px", width: "35px" },
    down: { value: loadImage("down_arrow"), height: "35px", width: "35px" }
  },
  close: { value: loadImage("close"), height: "35px", width: "35px" },
  help: { value: loadImage("help"), height: "35px", width: "35px" },
  info: { value: loadImage("logo_info"), height: "98px", width: "120px" },
  agrarias: { value: loadImage("logo_inisefor"), height: "98px", width: "120px" },
  inisefor: { value: loadImage("logo_agrarias"), height: "98px", width: "120px" },
  una: { value: loadImage("logo_una"), height: "98px", width: "120px" }
};

var MONTHS = [
  { v: 1, f: "Ene", d: "Enero" },
  { v: 2, f: "Feb", d: "Febrero" },
  { v: 3, f: "Mar", d: "Marzo" },
  { v: 4, f: "Abr", d: "Abril" },
  { v: 5, f: "May", d: "Mayo" },
  { v: 6, f: "Jun", d: "Junio" },
  { v: 7, f: "Jul", d: "Julio" },
  { v: 8, f: "Ago", d: "Agosto" },
  { v: 9, f: "Sep", d: "Septiembre" },
  { v: 10, f: "Oct", d: "Octubre" },
  { v: 11, f: "Nov", d: "Noviembre" },
  { v: 12, f: "Dic", d: "Diciembre" }
];

var COLORS = [
  "#c0bbde",
  "#9990ba",
  "#86d0c6",
  "#74cdd1",
  "#00dcad",
  "#1294a7",
  "#11686b"
];

var MAP_TYPE = [
  {
    value: "ROADMAP",
    label: "Simple",
    description: ""
  },
  {
    value: "TERRAIN",
    label: "Simple con relieve",
    description: ""
  },
  {
    value: "SATELLITE",
    label: "Satelital",
    description: ""
  },
  {
    value: "HYBRID",
    label: "Satelital con etiquetas",
    description: ""
  }
];

var CHART_TYPE = {
  Scatter: "ScatterChart",
  Line: "LineChart",
  Column: "ColumnChart",
  Bar: "BarChart",
  Pie: "PieChart",
  Area: "AreaChart",
  Histogram: "histogram",
  Combo: "ComboChart"
};

var REPORT_TYPE = [
  {
    value: 0,
    label: "Variables",
    description:
      "Este tipo de reporte muestra las variables en su estado original según son brindadas por el proveedor de los datos."
  },
  {
    value: 1,
    label: "Índices",
    description:
      "Este tipo de reporte muestra indicadores basados en cálculos según sea el caso específico utilizando de forma conjunta diferentes variables."
  }
];

var ZONES = [
  {
    value: 0,
    codProvincia: "5",
    codCanton: "3",
    label: "Santa Cruz",
    fieldCapacity: 100,
    description:
      "Es el cantón el número 3 de la provincia de Guanacaste ubicado en la zona Norte del país, esta región se caracteriza por poseer un clima templado y tropical con estación seca."
  },
  {
    value: 1,
    codProvincia: "5",
    codCanton: "2",
    label: "Nicoya",
    fieldCapacity: 100,
    description:
      "Es el cantón número 2 de la provincia de Guanacaste ubicado en el Pacifico Norte del país, presenta dos tipos de clima; uno lluvioso y otro de sequía"
  },
  {
    value: 2,
    codProvincia: "1",
    codCanton: "4",
    label: "Puriscal",
    fieldCapacity: 100,
    description:
      "El cantón de Puriscal es el número 4 de la provincia de San José ubicado en la parte Sur del país, se encuentra específicamente en la región Montañosa del Sur, la cual posee 2370 mm de lluvia promedio anual, 20 grados de temperatura media aproximada y un bosque húmedo subtropical, semideciduo y poco denso. "
  },
  {
    value: 3,
    codProvincia: "1",
    codCanton: "16",
    label: "Turrubares",
    fieldCapacity: 100,
    description:
      "El cantón de Turrubares es el número 16 de la provincia de San José, según su posición en la región Pacifico Central del país, presenta el tipo de clima lluvioso y seco. La formación forestal que se desarrolla es el bosque húmedo tropical, la temperatura y varía entre 17 y 24 grados centígrados, el promedio de días con lluvia es de 140 y una duración del periodo seco de 3 meses. "
  },
  {
    value: 4,
    codProvincia: "1",
    codCanton: "12",
    label: "Acosta",
    fieldCapacity: 100,
    description:
      "El cantón de Acosta es el número 12 de la provincia de San José ubicado en la zona Sur del país, presenta un tipo de bosque muy húmedo montano bajo y bosque no alterado, con un promedio de días con lluvia de 149 y una duración del periodo seco de 4 meses aproximadamente."
  },
  {
    value: 5,
    codProvincia: "1",
    codCanton: "7",
    label: "Mora",
    fieldCapacity: 100,
    description:
      "El cantón de Mora es el número 7 de la provincia de San José, según su posición entre la región del Valle Central y Pacifico Central del país, cuyo tipo de clima es intermedio entre las lluvias moderadas del Valle Central y las lluvias torrenciales del Pacifico Central, presenta bosque húmedo subtropical, la temperatura varía entre 17 y 24 grados, el promedio de días con lluvia es de 149 y una duración del periodo seco de 4 meses. "
  },
  {
    value: 6,
    codProvincia: "2",
    codCanton: "9",
    label: "Orotina",
    fieldCapacity: 100,
    description:
      "El cantón de Orotina es el número 9 de la provincia de Alajuela ubicado en la zona Norte del país. Además, predomina el tipo de suelo latosol, presenta lluvia anual de 2637 mm, su temperatura media anual es de 25 a 28 grados, alrededor de 111 de días con lluvias y el periodo de sequía dura aproximadamente 4 meses y predomina el bosque seco tropical"
  }
];

var LANDUSE_DESCRIPTIONS = [
  {
    x: 0,
    y: 19,
    description:
      "Desconocido. No hay suficientes datos satelitales disponibles o no disponibles."
  },
  {
    x: 20,
    y: 29,
    description:
      "Arbustos. Plantas perennes leñosas con tallos persistentes y leñosos y sin ningún tallo principal definido siendo menos de 5 m de altura. El follaje del arbusto puede ser tanto perenne como caducifolio."
  },
  {
    x: 30,
    y: 39,
    description:
      "Vegetación herbácea. Plantas sin tallo persistente o brotes sobre el suelo y sin una estructura firme definida. La cobertura de árboles y arbustos es inferior al 10 %."
  },
  {
    x: 40,
    y: 49,
    description:
      "Vegetación cultivada y gestionada / agricultura. Tierras cubiertas con cultivos temporales seguidos de la cosecha y un período de suelo desnudo (por ejemplo, sistemas de cultivo único y múltiple). Tenga en cuenta que los cultivos leñosos perennes se clasificarán como el tipo de cobertura forestal o de arbustos apropiado."
  },
  {
    x: 50,
    y: 59,
    description:
      "Urbano / construido. Tierra cubierta por edificios y otras estructuras hechas por el hombre."
  },
  {
    x: 60,
    y: 69,
    description:
      "Vegetación desnuda / escasa. Tierras con suelo expuesto, arena o rocas y nunca tiene más del 10 % de cobertura vegetal durante cualquier momento del año."
  },
  {
    x: 70,
    y: 79,
    description:
      "Nieve y hielo. Tierras bajo cobertura de nieve o hielo durante todo el año."
  },
  {
    x: 80,
    y: 89,
    description:
      "Cuerpos de agua permanentes. Lagos, embalses y ríos. Pueden ser cuerpos de agua dulce o salada."
  },
  {
    x: 90,
    y: 99,
    description:
      "Humedales herbáceos. Tierras con una mezcla permanente de agua y vegetación herbácea o leñosa. La vegetación puede estar presente en agua salada, salobre o dulce."
  },
  { x: 100, y: 110, description: "Musgo y líquenes." },
  {
    x: 111,
    y: 111,
    description:
      "Bosque cerrado, hoja acicular perenne. Dosel del árbol >70 %, casi todos los árboles de hoja acicular permanecen verdes todo el año. El dosel nunca está sin follaje verde."
  },
  {
    x: 112,
    y: 112,
    description:
      "Bosque cerrado, hoja ancha perenne. Dosel del árbol >70 %, casi todos los árboles de hoja ancha permanecen verdes durante todo el año. El dosel nunca está sin follaje verde."
  },
  {
    x: 113,
    y: 113,
    description:
      "Bosque cerrado, hoja acicular caducifolio. Dosel del árbol >70 %, consiste en comunidades de árboles de hoja acicular estacionales con un ciclo anual de períodos con hojas y períodos sin hojas."
  },
  {
    x: 114,
    y: 114,
    description:
      "Bosque cerrado, hoja ancha caducifolio. Dosel del árbol >70 %, consiste en comunidades de árboles de hoja ancha estacionales con un ciclo anual de períodos con hojas y períodos sin hojas."
  },
  { x: 115, y: 115, description: "Bosque cerrado, mixto." },
  {
    x: 116,
    y: 120,
    description:
      "Bosque cerrado, que no coincide con ninguna de las otras definiciones."
  },
  {
    x: 121,
    y: 121,
    description:
      "Bosque abierto, hoja acicular perenne. Capa superior- árboles 15-70 % y segunda capa- mezcla de arbustos y pastizales, casi todos los árboles de hoja acicular permanecen verdes todo el año. El dosel nunca está sin follaje verde."
  },
  {
    x: 122,
    y: 122,
    description:
      "Bosque abierto, hoja ancha perenne. Capa superior- árboles 15-70 % y segunda capa- mezcla de arbustos y pastizales, casi todos los árboles de hoja ancha permanecen verdes durante todo el año. El dosel nunca está sin follaje verde."
  },
  {
    x: 123,
    y: 123,
    description:
      "Bosque abierto, hoja acicular caducifolio. Capa superior- árboles 15-70 % y segunda capa- mezcla de arbustos y pastizales, consiste en comunidades de árboles de hoja acicular estacionales con un ciclo anual de períodos con hojas y períodos sin hojas."
  },
  {
    x: 124,
    y: 124,
    description:
      "Bosque abierto, hoja ancha caducifolio. Capa superior- árboles 15-70 % y segunda capa- mezcla de arbustos y pastizales, consiste en comunidades de árboles de hoja ancha estacionales con un ciclo anual de períodos con hojas y períodos sin hojas."
  },
  { x: 125, y: 125, description: "Bosque abierto, mixto." },
  {
    x: 126,
    y: 199,
    description:
      "Bosque abierto, que no coincide con ninguna de las otras definiciones."
  },
  {
    x: 200,
    y: 1000,
    description: "Océanos, mares. Pueden ser cuerpos de agua dulce o salada."
  }
];

var FOREST_TYPE_DESCRIPTIONS = [
  { number: 0, description: "Desconocido" },
  { number: 1, description: "Hoja perenne acicular" },
  { number: 2, description: "Hoja perenne ancha" },
  { number: 3, description: "Hoja caduca acicular" },
  { number: 4, description: "Hoja caduca ancha" },
  { number: 5, description: "Mezcla de tipos de bosques" }
];

var TEMPERATURE_PALETTE = [
  "1a3678",
  "2955bc",
  "5699ff",
  "8dbae9",
  "acd1ff",
  "caebff",
  "e5f9ff",
  "fdffb4",
  "ffe6a2",
  "ffc969",
  "ffa12d",
  "ff7c1f",
  "ca531a",
  "ff0000",
  "ab0000"
];

var PRECIPITATION_PALETTE = [
  "FFE6A2",
  "FDFFB4",
  "E5F9FF",
  "CAEBFF",
  "ACD1FF",
  "8DBAE9",
  "5699FF",
  "2955BC",
  "1A3678"
];

var ELEVATION_PALETTE = ["0000ff", "00ffff", "ffff00", "ff0000", "ffffff"];

var LAND_PALLETTE = [
  "FFFF00",
  "F8F806",
  "F1F10C",
  "EBEB13",
  "E4E419",
  "DDDD20",
  "D7D726",
  "D0D02D",
  "CACA33",
  "C3C33A",
  "BCBC41",
  "B6B647",
  "B0B04E",
  "A9A954",
  "A3A35A",
  "9C9C61",
  "959568",
  "8F8F6E",
  "898975",
  "82827B",
  "7B7B82",
  "757589",
  "6E6E8F",
  "686895",
  "61619C",
  "5A5AA3",
  "5454A9",
  "4D4DB0",
  "4747B6",
  "4141BC",
  "3A3AC3",
  "3333CA",
  "2D2DD0",
  "2626D7",
  "2020DD",
  "1919E4",
  "1212EB",
  "0C0CF1",
  "0606F8",
  "0000FF"
];

var LANDUSE_PALLETTE = [
  "#282828",
  "#FFBB22",
  "#FFFF4C",
  "#F096FF",
  "#FA0000",
  "#B4B4B4",
  "#F0F0F0",
  "#0032C8",
  "#0096A0",
  "#FAE6A0",
  "#58481F",
  "#009900",
  "#70663E",
  "#00CC00",
  "#4E751F",
  "#007800",
  "#666000",
  "#8DB400",
  "#8D7400",
  "#A0DC00",
  "#929900",
  "#648C00",
  "#000080"
];

var WATER_RECOVERY_PALETTE = [
  "FFC969",
  "FFE6A2",
  "FDFFB4",
  "E5F9FF",
  "CAEBFF",
  "ACD1FF",
  "8DBAE9",
  "5699FF",
  "2955BC",
  "1A3678"
];

var HIDRIC_BALANCE_PALETTE = [
  "00008b",
  "242477",
  "484863",
  "6d6d4f",
  "91913b",
  "b6b627",
  "dada13",
  "ffff00"
];

var INDICATORS = [
  {
    value: 0,
    label: "Temperatura",
    description:
      "Magnitud física que caracteriza el movimiento aleatorio de las moléculas, en un cuerpo, esta se puede usar como medida comparativa para determinar cuan caliente es un material, los cambios de esta variable atmosférica se clasifican en; temperatura ambiente, temperaturas extremas, temperatura máxima y mínima.",
    chartType: CHART_TYPE.Line,
    palette: TEMPERATURE_PALETTE,
    paletteDescription: "Los colores representan la temperatura promedio anual, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.",
    scale: 0.1,
    range: { min: "tempAvg", max: "tempAvg" },
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 1,
    label: "Suelo",
    description:
      "Es una capa superficial de la corteza terrestre que proporciona soporte para la vida vegetal y animal. Es igualmente fundamental para la tierra, el territorio y las culturas; da soporte a la vida y a las actividades humanas permitiendo garantizar los derechos ambientales de las generaciones presentes y futuras, para efectos de este proyecto se utilizará el contenido de arcilla en 0, 10 y 30 metros de profundidad medido por % (kg / kg) cuyos valores van de 2 hasta 100",
    chartType: CHART_TYPE.Histogram,
    palette: LAND_PALLETTE,
    paletteDescription: "Los colores representan la cantidad de arcilla presente en el suelo, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.",
    scale: 1,
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 2,
    label: "Elevación",
    description:
      "Es la distancia que existe desde un punto de la superficie hasta otro punto de referencia, para efectos del proyecto se utiliza la altura sobre el nivel del mar en metros a una resolución de 30 metros, sus valores varían desde -433 hasta 8768 según el  dataset utilizado. ",
    chartType: CHART_TYPE.Line,
    palette: ELEVATION_PALETTE,
    paletteDescription: "Los colores representan la elevación sobre el nivel del mar, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.",
    scale: 1,
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 3,
    label: "Cobertura de suelo",
    description:
      "Hace referencia a la composición y distribución de diferentes tipos de superficies o materiales que cubren la tierra en una zona específica. Esta se puede segmentar según el tipo de suelo que posea, de la misma forma, su clasificación va de 0 a 200 y según su estado puede afectar las actividades humanas y el crecimiento urbano",
    chartType: CHART_TYPE.Line,
    palette: LANDUSE_PALLETTE,
    paletteDescription: "Los colores representan la clasificación de la cobertura de suelo.",
    scale: 1,
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 4,
    label: "Recurrencia de aguas",
    description:
      "Este indicador está basado en el índice de diferencia normalizada de agua (NDWI), este permite cuantificar y calcular el agua presente en la cobertura vegetal y de esta manera conocer el estrés o grado de saturación que posee la cobertura vegetal.",
    chartType: CHART_TYPE.Line,
    palette: WATER_RECOVERY_PALETTE,
    paletteDescription: "Los colores representan el índice de diferencia normalizada de agua (NDWI) promedio anual, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.",
    scale: 1,
    reportType: REPORT_TYPE[1].value
  },
  {
    value: 5,
    label: "Evapotranspiración",
    description:
      "Es la combinación de procesos de evaporación del agua y transpiración de las plantas y animales por medio de la cual es agua es transferida a la atmosfera desde la superficie terrestre",
    chartType: CHART_TYPE.Line,
    palette: TEMPERATURE_PALETTE,
    paletteDescription: "Los colores representan la evapotranspiración promedio anual, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.",
    scale: 0.1,
    range: { min: "pet", max: "pet" },
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 6,
    label: "Precipitación",
    description:
      "Es el hidrometeoro formado por partículas de agua, en estado líquido o sólido, que cristalizas caen desde una formación nubosa y alcanzan el suelo. Las formas de precipitación son: lluvia, llovizna, nieve, cinarra, nieve granulada, polvo diamante, granizo y gránulos de hielo. ",
    chartType: CHART_TYPE.Column,
    palette: PRECIPITATION_PALETTE,
    paletteDescription: "Los colores representan las precipitaciones promedio anuales, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores",
    scale: 1,
    range: { min: "pr", max: "pr" },
    reportType: REPORT_TYPE[0].value
  },
  {
    value: 7,
    label: "Balance Hídrico",
    description: "Permite conocer el régimen hídrico de una región, para su aplicación se utiliza la capacidad de almacenamiento de agua (CA), el promedio mensual de precipitación (P) y la temperatura (T).",
    chartType: CHART_TYPE.Combo,
    palette: HIDRIC_BALANCE_PALETTE,
    paletteDescription: "Los colores representan las clasificaciones según el índice hídrico, la variación estacional y la eficiencia térmica, denotadas como rgb respectivamente, tomando como minimos 0 y como máximo 255",
    scale: 1,
    range: { min: "pr", max: "pr" },
    reportType: REPORT_TYPE[1].value
  }
];

var COUNT_YEARS = [
  {
    value: 0,
    label: "Un año",
    description: "Agrupa los resultados del indicador según el año seleccionado"
  },
  {
    value: 1,
    label: "Últimos 5 años",
    description:
      "Agrupa los resultados del indicador por los últimos 5 años tomando como valor actual el año seleccionado"
  },
  {
    value: 2,
    label: "Últimos 30 años",
    description:
      "Agrupa los resultados del indicador por los últimos 30 años tomando como valor actual el año seleccionado"
  },
  {
    value: 3,
    label: "Todos los años",
    description:
      "Agrupa los resultados del indicador por todos los años disponibles"
  }
];

var RANGE_NDWI = [
  { x: 0.2, y: 1, description: "Superficie del agua" },
  { x: 0.0, y: 0.2, description: "Inundación, humedad" },
  { x: -0.3, y: 0.0, description: "Sequía moderada, superficies sin agua" },
  { x: -1, y: -0.3, description: "Sequía, superficies sin agua" }
];

function generateYears() {
  var years = [];
  for (var y = FIRST_YEAR, i = 0; y <= NOW.getFullYear(); y++, i++) {
    years.push({
      value: i,
      label: "" + y,
      description: "Año " + y
    });
  }
  return years;
}

var YEARS = generateYears();

var OUTPUTS = [
  {
    value: 0,
    name: "number",
    label: "Númerico",
    description: "Muestra los resultados numéricos del indicador"
  },
  {
    value: 1,
    name: "chart",
    label: "Gráfico",
    description:
      "Muestra los resultados  del indicador en forma de serie de tiempo"
  }
];

function getZones() {
  var zones = [];
  for (var i = 0; i < ZONES.length; i++) {
    var zone = ZONES[i];
    zone.data = getZoneGeometry(zone.label);
    zone.color = COLORS[i];
    zones.push(zone);
  }
  return zones;
}

function getLUDescription(v_) {
  var v = ee.Number(v_);
  var result = ee
    .List(LANDUSE_DESCRIPTIONS)
    .map(function (r_) {
      var r = ee.Dictionary(r_);
      return ee.Algorithms.If(
        v.gte(r.getNumber("x")).and(v.lte(r.getNumber("y"))),
        r.getString("description"),
        null
      );
    })
    .filter(ee.Filter.neq("item", null));
  return ee.Algorithms.If(result.length().eq(0), "desconocido", result.get(0));
}

function getFTDescription(v_) {
  var v = ee.Number(v_);
  var result = ee
    .List(FOREST_TYPE_DESCRIPTIONS)
    .map(function (r_) {
      var r = ee.Dictionary(r_);
      return ee.Algorithms.If(
        v.eq(r.getNumber("number")),
        r.getString("description"),
        null
      );
    })
    .filter(ee.Filter.neq("item", null));
  return ee.Algorithms.If(result.length().eq(0), "desconocido", result.get(0));
}

function getNDWIDescription(v_) {
  var v = ee.Number(v_);
  var result = ee
    .List(RANGE_NDWI)
    .map(function (r_) {
      var r = ee.Dictionary(r_);
      return ee.Algorithms.If(
        v.gte(r.getNumber("x")).and(v.lte(r.getNumber("y"))),
        r.getString("description"),
        null
      );
    })
    .filter(ee.Filter.neq("item", null));
  return ee.Algorithms.If(result.length().eq(0), "desconocido", result.get(0));
}

function getAbout() {
  ICONS.info.margin = "0px 0px 0px 14px";
  ICONS.agrarias.margin = "0px 0px 0px 14px";
  ICONS.inisefor.margin = "0px 0px 0px 14px";
  ICONS.una.margin = "0px 0px 0px 35%";
  var data = {
    company: [
      // { id: "name", key: "", value: "Universidad Nacional" },
      {
        id: "title1", key: "", value: "Proyectos relacionados",
        valueStyle: {
          width: "90%",
          textAlign: "center",
          fontWeight: "bold"
        }
      },
      {
        id: "project1", key: "", value: "SIA0432-20",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "project2", key: "", value: "SIA0169-23",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "title2", key: "", value: "Escuelas relacionadas",
        valueStyle: {
          width: "90%",
          textAlign: "center",
          fontWeight: "bold"
        }
      },
      {
        id: "company1", key: "", value: "Escuela de Ciencias Agrarias",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "company2", key: "", value: "Escuela de Informática",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "yearTitle",
        key: "",
        value: "Año",
        valueStyle: {
          width: "90%",
          textAlign: "center",
          fontWeight: "bold"
        }
      },
      {
        id: "yearValue",
        key: "",
        value: 2024,
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      }
    ],
    developers: [
      {
        id: "student",
        key: "",
        value: "Estudiantes",
        valueStyle: {
          width: "90%",
          textAlign: "center",
          fontWeight: "bold"
        }
      },
      {
        id: "student1",
        key: "",
        value: "Ing. Joseline Quiros Mendez",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "student2",
        key: "",
        value: "Ing. José Beita Cascante",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "student3",
        key: "",
        value: "Ing. Agro. Valeri L. Cubero Arias",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      }
    ],
    images: [
      {
        id: "image1",
        key: "",
        value: ICONS.info,
        type: "image",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "image2",
        key: "",
        value: ICONS.agrarias,
        type: "image",
        valueStyle: {
          width: "90%",
          textAlign: "center"
        }
      },
      {
        id: "image3",
        key: "",
        value: ICONS.inisefor,
        type: "image",
        valueStyle: {
          width: "100%",
          textAlign: "right"
        }
      },
      {
        id: "image4",
        key: "",
        value: ICONS.una,
        type: "image",
        valueStyle: {
          width: "90%",
          textAlign: "right"
        }
      }
    ]
  };
  return { images: data.images, data: flat([data.developers, data.company]) };
}

function flat(list) {
  return list.reduce(function (a, e) {
    if (Array.isArray(e)) {
      e.forEach(function (i) {
        a.push(i);
      });
    } else {
      a.push(e);
    }
    return a;
  }, []);
}

function join(list, prop, char) {
  return list.iterate(function (current_, previous_) {
    var previous = ee.String(previous_);
    var current = ee.Dictionary(current_);
    var p = ee.String(
      ee.Algorithms.If(
        previous.equals(""),
        previous,
        previous.cat(char).cat(char === "" ? "" : " ")
      )
    );
    return p.cat(current.getString(prop ? prop : "label"));
  }, ee.String(""));
}

var CLIMATE_CLASSIFICATION = [
  {
    value: 0,
    symbol: "A",
    label: "Perhúmedo",
    color: "51",
    x: 100,
    y: NULL
  },
  {
    value: 1,
    symbol: "B₄",
    label: "Húmedo",
    color: "72",
    x: 80,
    y: 100
  },
  {
    value: 2,
    symbol: "B₃",
    label: "Húmedo",
    color: "94",
    x: 60,
    y: 80
  },
  {
    value: 3,
    symbol: "B₂",
    label: "Húmedo",
    color: "116",
    x: 40,
    y: 60
  },
  {
    value: 4,
    symbol: "B₁",
    label: "Húmedo",
    color: "138",
    x: 20,
    y: 40
  },
  {
    value: 5,
    symbol: "C₂",
    label: "Subhúmedo-Húmedo",
    color: "160",
    x: 0,
    y: 20
  },
  {
    value: 6,
    symbol: "C₁",
    label: "Subhúmedo-Seco",
    color: "182",
    x: -20,
    y: 0
  },
  {
    value: 7,
    symbol: "D",
    label: "Semiárido",
    color: "204",
    x: -40,
    y: -20
  },
  {
    value: 8,
    symbol: "E",
    label: "Árido",
    color: "226",
    x: -60,
    y: -40
  }
];

var SEASONAL_VARIATION = [
  {
    value: 0,
    climateClassification: [0, 1, 2, 3, 4, 5],
    symbol: "r",
    label: "Poca o ninguna deficiencia de agua",
    color: "79",
    x: 0,
    y: 16.7
  },
  {
    value: 1,
    climateClassification: [0, 1, 2, 3, 4, 5],
    symbol: "s",
    label: "Moderada deficiencia de agua en verano",
    color: "97",
    x: 16.7,
    y: 33.3
  },
  {
    value: 2,
    climateClassification: [0, 1, 2, 3, 4, 5],
    symbol: "w",
    label: "Moderada deficiencia de agua en invierno",
    color: "115",
    x: 16.7,
    y: 33.3
  },
  {
    value: 3,
    climateClassification: [0, 1, 2, 3, 4, 5],
    symbol: "s₂",
    label: "Deficiencia grande de agua en verano",
    color: "134",
    x: 33.3,
    y: NULL
  },
  {
    value: 4,
    climateClassification: [0, 1, 2, 3, 4, 5],
    symbol: "w₁",
    label: "Deficiencia grande de agua en invierno",
    color: "134",
    x: 33.3,
    y: NULL
  },
  {
    value: 5,
    climateClassification: [6, 7, 8],
    symbol: "d",
    label: "Poca o ninguna deficiencia de agua",
    color: "171",
    x: 0,
    y: 10
  },
  {
    value: 6,
    climateClassification: [6, 7, 8],
    symbol: "s",
    label: "Moderada deficiencia de agua en verano",
    color: "189",
    x: 10,
    y: 20
  },
  {
    value: 7,
    climateClassification: [6, 7, 8],
    symbol: "w",
    label: "Moderada deficiencia de agua en invierno",
    color: "208",
    x: 10,
    y: 20
  },
  {
    value: 8,
    climateClassification: [6, 7, 8],
    symbol: "s₂",
    label: "Deficiencia grande de agua en verano",
    color: "226",
    x: 20,
    y: NULL
  },
  {
    value: 9,
    climateClassification: [6, 7, 8],
    symbol: "w₁",
    label: "Deficiencia grande de agua en invierno",
    color: "226",
    x: 20,
    y: NULL
  }
];

var EFFICIENCY_CLASSIFICATION = [
  {
    value: 0,
    symbol: "A´",
    label: "Megatermal o cálida",
    color: "182",
    x: 1140,
    y: NULL
  },
  {
    value: 1,
    symbol: "B´4",
    label: "Mesotérmica semicálida",
    color: "191",
    x: 997,
    y: 1140
  },
  {
    value: 2,
    symbol: "B´3",
    label: "Mesotérmica templada cálida",
    color: "200",
    x: 855,
    y: 997
  },
  {
    value: 3,
    symbol: "B´2",
    label: "Mesotérmica templada fría",
    color: "209",
    x: 712,
    y: 855
  },
  {
    value: 4,
    symbol: "B´1",
    label: "Mesotérmica semifría",
    color: "218",
    x: 570,
    y: 712
  },
  {
    value: 5,
    symbol: "C´2",
    label: "Mesotérmica fría moderada",
    color: "227",
    x: 427,
    y: 570
  },
  {
    value: 6,
    symbol: "C´1",
    label: "Mesotérmica fría acentuada",
    color: "236",
    x: 285,
    y: 427
  },
  {
    value: 7,
    symbol: "D´",
    label: "Tundra",
    color: "245",
    x: 142,
    y: 285
  },
  {
    value: 8,
    symbol: "E´",
    label: "Helado o Glacial",
    color: "255",
    x: NULL,
    y: 142
  }
];

var CONCENTRATION_CLASSIFICATION = [
  {
    value: 0,
    symbol: "a´",
    label: "Megatermal o cálida",
    x: NULL,
    y: 48
  },
  {
    value: 1,
    symbol: "b´4",
    label: "Mesotérmica semicálida",
    x: 48,
    y: 51.9
  },
  {
    value: 2,
    symbol: "b´3",
    label: "Mesotérmica templada cálida",
    x: 51.9,
    y: 56.3
  },
  {
    value: 3,
    symbol: "b´2",
    label: "Mesotérmica templada fría",
    x: 56.3,
    y: 61.6
  },
  {
    value: 4,
    symbol: "b´1",
    label: "Mesotérmica semifría",
    x: 61.6,
    y: 68
  },
  {
    value: 5,
    symbol: "c´2",
    label: "Mesotérmica fría moderada",
    x: 68,
    y: 76.3
  },
  {
    value: 6,
    symbol: "c´1",
    label: "Mesotérmica fría acentuada",
    x: 76.3,
    y: 88
  },
  {
    value: 7,
    symbol: "d´",
    label: "Tundra",
    x: 88,
    y: NULL
  }
];

function convertToCondition(i) {
  return (
    "(" +
    i.x +
    " == " +
    NULL +
    " ? (" +
    i.y +
    " == " +
    NULL +
    " ? 0 : v < " +
    i.y +
    " ) : ( " +
    i.y +
    " == " +
    NULL +
    " ? (v >= " +
    i.x +
    ") : (v >= " +
    i.x +
    " && v < " +
    i.y +
    "))) ? " +
    i.color +
    " : "
  );
}

function getClassificationColor(list) {
  return list.map(convertToCondition).join("") + "255";
}

function getColorR() {
  return getClassificationColor(CLIMATE_CLASSIFICATION);
}

function filterByClassification(c) {
  return function (i) {
    var l = i.climateClassification.length;
    return c === 1 ? l === 6 : l === 3;
  };
}

function getColorG() {
  var rC = getClassificationColor(
    SEASONAL_VARIATION.filter(filterByClassification(1))
  );
  var dC = getClassificationColor(
    SEASONAL_VARIATION.filter(filterByClassification(2))
  );
  return "r <= 160 ? " + rC + " : " + dC;
}

function getColorB() {
  return getClassificationColor(EFFICIENCY_CLASSIFICATION);
}

function getClassificationLabel(list, v_) {
  var v = ee.Number(v_);
  var e =
    "(r.x == null ? (r.y == null ? 0 : v < r.y ) : ( r.y == null ? (v >= r.x) : (v >= r.x && v < r.y)))";
  var result = ee
    .List(list)
    .map(function (r_) {
      var r = ee.Dictionary(r_);
      var condition = ee.Number.expression(e, {
        r: r,
        v: v,
        null: NULL
      });
      return ee.Algorithms.If(ee.Number(condition).eq(1), r, null);
    })
    .filter(ee.Filter.neq("item", null));
  return ee.List(
    ee.Algorithms.If(
      result.length().eq(0),
      [
        {
          value: -1,
          symbol: "?",
          label: "Desconocido"
        }
      ],
      result
    )
  );
}

function getClimateClassification(v_) {
  return ee.Dictionary(
    getClassificationLabel(CLIMATE_CLASSIFICATION, v_).get(0)
  );
}

function getSeasonalClassification(v_, wi, prop, char) {
  var seasonalVariation = ee
    .List(SEASONAL_VARIATION)
    .map(function (e_) {
      var e = ee.Dictionary(e_);
      return ee.Algorithms.If(
        ee.List(e.get("climateClassification")).contains(wi),
        e,
        null
      );
    })
    .filter(ee.Filter.neq("item", null));
  return join(getClassificationLabel(seasonalVariation, v_), prop, char);
}

function getEfficiencyClassification(v_) {
  return ee.Dictionary(
    getClassificationLabel(EFFICIENCY_CLASSIFICATION, v_).get(0)
  );
}

function getConcentrationClassification(v_) {
  return ee.Dictionary(
    getClassificationLabel(CONCENTRATION_CLASSIFICATION, v_).get(0)
  );
}

exports.getReportTypes = function () {
  return REPORT_TYPE;
};

exports.getZones = getZones;

exports.getIndicators = function () {
  return INDICATORS;
};

exports.getLandUseDescriptions = getLUDescription;

exports.getFTDescriptions = getFTDescription;

exports.getCountYears = function () {
  return COUNT_YEARS;
};

exports.generateYears = generateYears;

exports.getYears = function () {
  return YEARS;
};

exports.getOutputs = function () {
  return OUTPUTS;
};

exports.getCostaRica = getCostaRica;

exports.getNDWIDescription = getNDWIDescription;

exports.getAbout = getAbout;

exports.ICONS = ICONS;

exports.flat = flat;

exports.getMonths = function () {
  return MONTHS;
};

exports.getNow = function () {
  return NOW;
};

exports.getMapTypes = function () {
  return MAP_TYPE;
};

exports.getClimateClassification = getClimateClassification;

exports.getSeasonalClassification = getSeasonalClassification;

exports.getEfficiencyClassification = getEfficiencyClassification;

exports.getConcentrationClassification = getConcentrationClassification;

exports.getColorR = getColorR;

exports.getColorG = getColorG;

exports.getColorB = getColorB;
