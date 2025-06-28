/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Configuration = require("users/Jo13bc/presentation:Configuration.js");
var UserGuide = require("users/Jo13bc/presentation:UserGuide.js");
var messageType = { success: "success", error: "error" };
var ICONS = require("users/Jo13bc/core:Data.js").ICONS;
var NUMBER_REGEX = /^[-]?([0-9]+(\.[0-9]+)?)?$/;

function panel(widgets, style, layout) {
  if (style != null) {
    if (style.padding == null) {
      style.padding = Configuration.style.panel.padding;
    }
  } else {
    style = Configuration.style.panel;
  }
  var widgets_ = Object.keys(widgets).map(function (k) {
    var widget = widgets[k];
    return widget.panel ? widget.panel : widget;
  });
  widgets.panel = ui.Panel(widgets_, layout, style);
  return widgets;
}

function panelInput(label, input, style, styleLabel) {
  return panel(
    {
      label: ui.Label(
        label + Configuration.label.filter.separator,
        styleLabel ? styleLabel : Configuration.style.input.label
      ),
      input: input
    },
    style,
    ui.Panel.Layout.flow("horizontal", true)
  );
}

function panelLine(label, open, close) {
  return panel(
    {
      label: ui.Label(label, Configuration.style.line.title),
      open: open,
      close: close
    },
    Configuration.style.line.panel,
    ui.Panel.Layout.flow("horizontal", true)
  );
}

function thumbnail(palette) {
  return ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: "100x10",
      format: "png",
      min: 0,
      max: 1,
      palette: palette
    },
    style: Configuration.style.visualization.palette.colors
  });
}

function image(image_, onClick, shown) {
  return ui.Thumbnail({
    image: image_.value,
    params: {
      opacity: image_.opacity ? image_.opacity : 0.8,
      format: "png"
    },
    style: {
      height: image_.height,
      width: image_.width,
      padding: image_.padding ? image_.padding : "0",
      margin: image_.margin ? image_.margin : "0",
      shown: shown !== undefined ? shown : true
    },
    onClick: onClick
  });
}

function select(filter, callback) {
  return ui.Select(
    filter.filtered,
    null,
    filter.value.value,
    function (v) {
      var value = filter.filtered.filter(function (e) {
        return e.value === v;
      });
      filter.value = value.length > 0 ? value[0] : null;
      if (callback != undefined) {
        callback(filter.value);
      }
    },
    false,
    Configuration.style.input.panel
  );
}

function textbox(filter, callback) {
  return ui.Textbox(
    filter.placeholder,
    filter.value,
    function (v, w) {
      if (!NUMBER_REGEX.test(v)) {
        v = v
          .replace(/[^0-9.-]/g, "")
          .replace(/(\..*)\./g, "$1")
          .replace(/(?!^)-/g, "");
        w.setValue(v, false);
      }
      filter.value = v;
      if (callback != undefined) {
        callback(filter.value);
      }
    },
    false,
    Configuration.style.textbox.panel
  );
}

function header(context) {
  var iconArrowLeft = ICONS.arrow.left;
  iconArrowLeft.margin = "0px 0px 0px 90%";
  context.header = panel(
    {
      button: image(ICONS.arrow.left, function (e) {
        var showMain = context.main.panel.style().get("shown");
        togglePanel(context, showMain);
      }),
      //  ui.Button({
      //   label: "«",
      //   style: { padding: "0px", margin: "7px 0px 0px 85%" },
      //   onClick: function (e) {
      //     var showMain = context.main.panel.style().get("shown");
      //     togglePanel(context, showMain);
      //   }
      // }),
      title: ui.Label(
        Configuration.label.title,
        Configuration.style.header.title
      ),
      description: ui.Label(
        Configuration.label.subtitle,
        Configuration.style.header.subtitle
      )
    },
    Configuration.style.header.panel
  );
  return context.header.panel;
}

function getFilter(context) {
  var isLayer = context.filter.isLayer;
  var lon = Number(context.filter.longitude.value);
  var lat = Number(context.filter.latitude.value);
  var con = lon && lat;
  var cur = con ? ee.Geometry.MultiPoint([[lon, lat]]) : null;
  return {
    reportType: context.filter.reportType.value,
    zone: context.filter.zone.value,
    indicator: context.filter.indicator.value,
    countYears: context.filter.countYears.value,
    year: context.filter.year.value,
    typeOutput: context.filter.typeOutput.value,
    cursor: cur,
    isLayer: isLayer,
    geometry: isLayer ? context.filter.zone.value.data : cur,
    pixels: Configuration.scales[isLayer ? "pixelsZone" : "pixelsCursor"],
    zoneParams: context.filter.zoneParams
  };
}

function input(context, filter, onChangeZone, onChange) {
  context.filter = filter;
  context.getFilter = function () {
    return getFilter(context);
  };
  context.input = panel({
    reportType: panelInput(
      Configuration.label.filter.reportType,
      select(filter.reportType, function (e) {
        context.main.onLoading(true);
        var reportType = context.filter.reportType.value.value;
        //Filtrar las opciones de los indicadores según el tipo de reporte
        context.filter.indicator.filtered =
          context.filter.indicator.values.filter(function (v) {
            return v.reportType === reportType;
          });
        context.input.indicator.input
          .items()
          .reset(context.filter.indicator.filtered);
        var value = context.filter.indicator.filtered[0];
        context.input.indicator.input.setValue(value.value, false);
        context.filter.indicator.value = value;
        //Filtrar las opciones de la cantidad de años según indicador
        context.filter.countYears.filtered =
          context.filter.countYears.values.filter(function (v) {
            return (reportType === 1 && v.value >= 2) || reportType === 0;
          });
        context.input.countYears.input
          .items()
          .reset(context.filter.countYears.filtered);
        var value = context.filter.countYears.filtered[0];
        context.input.countYears.input.setValue(value.value, false);
        context.filter.countYears.value = value;
        context.input.year.panel.style().set("shown", reportType === 0);
        onChange(e, false, function () {
          context.main.onLoading(false);
        });
      })
    ),
    zone: panelInput(
      Configuration.label.filter.zone,
      select(filter.zone, function (zone) {
        context.main.onLoading(true);
        onChangeZone(zone, function () {
          context.main.onLoading(false);
        });
      })
    ),
    indicator: panelInput(
      Configuration.label.filter.indicator,
      select(filter.indicator, function (e) {
        context.main.onLoading(true);
        var indicator = context.filter.indicator.value.value;
        var disabledOutput = indicator >= 2 && indicator <= 3 ? 0 : 1;
        context.filter.typeOutput.filtered =
          context.filter.typeOutput.values.filter(function (v) {
            return v.value <= disabledOutput;
          });
        context.input.typeOutput.input
          .items()
          .reset(context.filter.typeOutput.filtered);
        var value = context.filter.typeOutput.filtered[0];
        context.input.typeOutput.input.setValue(null, false);
        context.input.typeOutput.input.setValue(value.value, false);
        context.filter.typeOutput.value = value;
        onChange(e, false, function () {
          context.main.onLoading(false);
        });
      })
    ),
    countYears: panelInput(
      Configuration.label.filter.countYears,
      select(filter.countYears, function (e) {
        context.main.onLoading(true);
        var showYear = context.filter.countYears.value.value == 0;
        context.input.year.panel.style().set("shown", showYear);
        onChange(e, false, function () {
          context.main.onLoading(false);
        });
      })
    ),
    year: panelInput(
      Configuration.label.filter.year,
      select(filter.year, function (e) {
        context.main.onLoading(true);
        onChange(e, false, function () {
          context.main.onLoading(false);
        });
      })
    ),
    typeOutput: panelInput(
      Configuration.label.filter.typeOutput,
      select(filter.typeOutput, function (e) {
        context.main.onLoading(true);
        onChange(e, false, function () {
          context.main.onLoading(false);
        });
      })
    ),
    longitude: panelInput(
      Configuration.label.filter.longitude,
      textbox(filter.longitude, function (e) {
        context.main.onLoading(true);
        onChange(e, true, function () {
          context.main.onLoading(false);
        });
      })
    ),
    latitude: panelInput(
      Configuration.label.filter.latitude,
      textbox(filter.latitude, function (e) {
        context.main.onLoading(true);
        onChange(e, true, function () {
          context.main.onLoading(false);
        });
      })
    )
  });
  return context.input.panel;
}

function loadCoordenates(context, lon, lat) {
  context.input.longitude.input.setValue(lon, false);
  context.input.latitude.input.setValue(lat, false);
  context.filter.longitude.value = lon;
  context.filter.latitude.value = lat;
}

function output(context, loadingMessage) {
  context.output = panel({
    body: panel({}),
    loading: ui.Label(loadingMessage, { shown: false }),
    message: panel(
      {
        title: ui.Label(null, Configuration.style.message.title),
        text: ui.Label(null)
      },
      { shown: false }
    )
  });
  return context.output.panel;
}

function inputGuide(context, filter) {
  context.inputGuide = panel(
    {
      // help: image(ICONS.close, function (e) {
      //   inputGuideClick(context);
      // }),
      // ui.Button({
      //   label: "X",
      //   style: { padding: "0px", margin: "7px 0px 0px 85%" },
      //   onClick: function (e) {
      //     inputGuideClick(context);
      //   }
      // }),
      body: UserGuide.inputGuide(filter)
    },
    { shown: false, height: "automatic" }
  );
  return context.inputGuide.panel;
}

function inputGuideClick(context) {
  var showMain = context.inputGuide.panel.style().get("shown");
  toggleInputGuide(context, showMain);
}

function informationGuide(context) {
  context.informationGuide = panel(
    {
      // help: image(ICONS.close, function (e) {
      //   informationGuideClick(context);
      // }),
      // ui.Button({
      //   label: "X",
      //   style: { padding: "0px", margin: "7px 0px 0px 85%" },
      //   onClick: function (e) {
      //     informationGuideClick(context);
      //   }
      // }),
      body: UserGuide.informationGuide(getFilter(context))
    },
    { shown: false }
  );
  return context.informationGuide.panel;
}

function informationGuideClick(context) {
  var showMain = context.informationGuide.panel.style().get("shown");
  toggleInformationGuide(context, showMain);
}

function aboutData(data) {
  var images = panel(
    data.images.reduce(function (acc, item) {
      acc[item.id] = image(item.value);
      return acc;
    }, {}),
    {},
    ui.Panel.Layout.flow("horizontal", true)
  );
  var data_ = panel(
    data.data.reduce(function (acc, item) {
      acc[item.id] = panel(
        {
          key: ui.Label(item.key, Configuration.style.data.label),
          value:
            item.type === "image"
              ? image(item.value)
              : ui.Label(item.value, item.valueStyle ? item.valueStyle : {})
        },
        {},
        ui.Panel.Layout.flow("horizontal", true)
      );
      return acc;
    }, {})
  );
  return panel({ data: data_, images: images }).panel;
}

function about(context, data) {
  context.about = panel(
    {
      body: aboutData(data)
    },
    { shown: false }
  );
  return context.about.panel;
}

function aboutClick(context) {
  var showMain = context.about.panel.style().get("shown");
  toggleAbout(context, showMain);
}

function visualization(context, mapTypes, onChange) {
  context.visualization = panel(
    {
      transparency: panelInput(
        Configuration.label.visualization.transparency,
        ui.Slider(
          0,
          1,
          0.8,
          0.1,
          function (v) {
            onChange("transparency", v);
          },
          "horizontal",
          false,
          Configuration.style.visualization.transparency
        )
      ),
      mapType: panelInput(
        Configuration.label.visualization.mapType,
        ui.Select(
          mapTypes,
          null,
          mapTypes[0].value,
          function (v) {
            onChange("mapType", v);
          },
          false,
          Configuration.style.visualization.mapType
        )
      ),
      palette: panelInput(
        Configuration.label.visualization.palette,
        panel(
          {
            min: ui.Label("", Configuration.style.visualization.palette.min),
            colors: thumbnail([]),
            max: ui.Label("", Configuration.style.visualization.palette.max)
          },
          Configuration.style.visualization.palette.panel,
          ui.Panel.Layout.flow("horizontal", true)
        )
      ),
      description: panelInput(
        Configuration.label.visualization.description,
        ui.Label("", Configuration.style.visualization.palette.description)
      ),
      zoom: panelInput(
        Configuration.label.visualization.zoom,
        ui.Slider(
          0,
          24,
          Configuration.style.geometry.zoom,
          1,
          function (v) {
            onChange("zoom", v);
          },
          "horizontal",
          false,
          Configuration.style.visualization.zoom
        )
      )
    },
    { shown: false }
  );
  return context.visualization.panel;
}

function resetZoom(context) {
  var zoom = Configuration.style.geometry.zoom;
  context.visualization.zoom.input.setValue(zoom, false);
  return zoom;
}

function loadVisualization(context, zoneParams) {
  var params = context.visualization.palette.input.colors.getParams();
  var range = { min: "?", max: "?" };
  params.palette = [];
  if (zoneParams) {
    range.min = zoneParams.min;
    range.max = zoneParams.max;
    range.description = zoneParams.description;
    params.palette = zoneParams.palette;
  }
  context.visualization.palette.input.colors = thumbnail(params.palette);
  context.visualization.palette.input.min.setValue(range.min);
  context.visualization.palette.input.max.setValue(range.max);
  context.visualization.description.input.setValue(range.description);
  context.visualization.palette.input.panel
    .widgets()
    .set(1, context.visualization.palette.input.colors);
}

function visualizationClick(context) {
  var showMain = context.visualization.panel.style().get("shown");
  toggleVisualization(context, showMain);
}

function line(context, number, title, onClick, open, close) {
  context["line" + number] = panelLine(
    title,
    image(open ? open : ICONS.help, onClick),
    image(close ? close : ICONS.close, onClick, false)
    // ui.Button({
    //   label: buttonName ? buttonName : "?",
    //   style: Configuration.style.line.button,
    //   onClick: onClick
    // }),
  );
  return context["line" + number].panel;
}

function main(
  context,
  filter,
  onChangeZone,
  onChange,
  aboutData,
  mapTypes,
  onChangeVisualization
) {
  context.main = panel(
    {
      header: header(context),
      line1: line(context, 1, Configuration.label.line.filter, function (e) {
        inputGuideClick(context);
      }),
      inputGuide: inputGuide(context, filter),
      input: input(context, filter, onChangeZone, onChange),
      line4: line(
        context,
        4,
        Configuration.label.line.visualization,
        function (e) {
          visualizationClick(context);
        },
        ICONS.arrow.down,
        ICONS.arrow.up
      ),
      visualization: visualization(context, mapTypes, onChangeVisualization),
      line2: line(
        context,
        2,
        Configuration.label.line.information,
        function (e) {
          informationGuideClick(context);
        }
      ),
      informationGuide: informationGuide(context),
      output: output(context, Configuration.label.loading),
      line3: line(
        context,
        3,
        Configuration.label.line.about,
        function (e) {
          aboutClick(context);
        },
        ICONS.arrow.down,
        ICONS.arrow.up
      ),
      about: about(context, aboutData)
    },
    Configuration.style.root
  );
  context.main.onLoadUserGuide = function () {
    loadUserGuide(context);
  };
  context.main.onLoad = function (result, filter, callback, fail) {
    load(context, result, filter, callback, fail);
  };
  context.main.clearOutput = function () {
    context.output.body.panel.clear();
    clearMessage(context);
  };
  context.main.onLoading = function (enable) {
    loading(context, enable);
  };
  context.main.showError = function (title, text) {
    showMessage(context, messageType.error, title, text);
  };
  context.main.showInformation = function (title, text) {
    showMessage(context, messageType.success, title, text);
  };
  context.main.loadVisualization = function (zoneParams) {
    loadVisualization(context, zoneParams);
  };
  context.main.loadCoordenates = function (lon, lat) {
    loadCoordenates(context, lon, lat);
  };
  context.main.resetZoom = function () {
    return resetZoom(context);
  };
}

function togglePanel(context, enabled) {
  context.main.panel.style().set("shown", !enabled);
  context.navbar.panel.style().set("shown", enabled);
}

function navbar(context) {
  context.navbar = panel(
    {
      button: image(ICONS.arrow.right, function (e) {
        var showMain = context.main.panel.style().get("shown");
        togglePanel(context, showMain);
      }),
      // ui.Button({
      //   label: "»",
      //   style: { padding: "0px", margin: "0px" },
      //   onClick: function (e) {
      //     var showMain = context.main.panel.style().get("shown");
      //     togglePanel(context, showMain);
      //   }
      // }),
      icon: ui.Label({ value: "SA", style: Configuration.style.header.title })
    },
    {
      width: "60px",
      padding: "3px",
      margin: "0px",
      backgroundColor: "#f1f1f1",
      shown: false
    }
  );
}

function init(
  filter,
  onChangeZone,
  onChange,
  aboutData,
  mapTypes,
  onChangeVisualization
) {
  var interface = {};
  try {
    navbar(interface);
    main(
      interface,
      filter,
      onChangeZone,
      onChange,
      aboutData,
      mapTypes,
      onChangeVisualization
    );
  } catch (ex) {
    throw Configuration.message.error.initInterface + ex;
  }
  interface.panel = ui.Panel(
    [interface.navbar.panel, interface.main.panel],
    ui.Panel.Layout.flow("horizontal"),
    {
      position: "top-left",
      backgroundColor: "rgba(1,1,1,0)",
      height: "100%",
      padding: "0px",
      margin: "-10px 0px 0px -10px"
    }
  );
  return interface;
}

function loading(context, enabled) {
  context.output.loading.style().set("shown", enabled);
  context.informationGuide.body.style().set("shown", !enabled);
  var loadDependentWidgets = [
    context.input.reportType.input,
    context.input.zone.input,
    context.input.indicator.input,
    context.input.countYears.input,
    context.input.year.input,
    context.input.typeOutput.input
  ];
  loadDependentWidgets.forEach(function (widget) {
    widget.setDisabled(enabled);
  });
}

function toggleInputGuide(context, enabled) {
  context.line1.open.style().set("shown", enabled);
  context.line1.close.style().set("shown", !enabled);
  context.inputGuide.panel.style().set("shown", !enabled);
}

function toggleInformationGuide(context, enabled) {
  context.line2.open.style().set("shown", enabled);
  context.line2.close.style().set("shown", !enabled);
  context.informationGuide.panel.style().set("shown", !enabled);
  loadUserGuide(context);
}

function loadUserGuide(context) {
  var showed = context.informationGuide.panel.style().get("shown");
  if (showed) {
    context.informationGuide.panel.remove(context.informationGuide.body);
    context.informationGuide.body = UserGuide.informationGuide(
      getFilter(context)
    );
    context.informationGuide.panel.add(context.informationGuide.body);
  }
}

function toggleAbout(context, enabled) {
  context.line3.open.style().set("shown", enabled);
  context.line3.close.style().set("shown", !enabled);
  context.about.panel.style().set("shown", !enabled);
}

function toggleVisualization(context, enabled) {
  context.line4.open.style().set("shown", enabled);
  context.line4.close.style().set("shown", !enabled);
  context.visualization.panel.style().set("shown", !enabled);
}

function message(context, type, title, text, enabled) {
  context.output.message.panel.style().set("shown", enabled);
  context.output.message.title.setValue(title);
  context.output.message.text.setValue(text);
  context.output.message.text
    .style()
    .set(
      "color",
      type === messageType.success
        ? Configuration.style.color.text
        : Configuration.style.color.error
    );
}

function clearMessage(context) {
  message(context, messageType.success, null, null, false);
}

function showMessage(context, type, title, text) {
  message(context, type, title, text, true);
}

function loadChart(context, filter, data) {
  var chart = ui.Chart.image;
  var imageCollection = ee.ImageCollection(ee.Deserializer.decode(data.data));
  if (filter.indicator.chartType === "histogram") {
    chart = chart.histogram(imageCollection, filter.zone.data);
  } else {
    chart = chart
      .series({
        imageCollection: imageCollection,
        region: filter.cursor,
        reducer: ee.Reducer[data.reducer](),
        xProperty: data.xSeriesProperties
      })
      .setChartType(filter.indicator.chartType);
  }
  var options = {
    title: data.options.title,
    hAxis: {
      title: data.options.xTitle,
      titleTextStyle: { italic: false, bold: true },
      ticks: data.ticks
    },
    vAxis: {
      title: data.options.yTitle,
      titleTextStyle: { italic: false, bold: true },
      format: "short"
    },
    lineWidth: 5,
    colors: data.options.colors
  };
  if (filter.indicator.chartType === "ComboChart") {
    options.series = data.options.series;
    options.seriesType = data.options.seriesType;
  }
  chart = chart.setSeriesNames(data.seriesNames).setOptions(options);
  context.output.body.panel.add(panel({ chart: chart }).panel);
}

function loadTable(context, data) {
  var table = ui.Chart(data.datatable, "Table", {
    pageSize: 13,
    allowHtml: true
  });
  var title = ui.Label(data.title, Configuration.style.data.title);
  context.output.body.panel.add(panel({ title: title, table: table }).panel);
}

function loadValue(isHeader, item) {
  if (item.type === "table") {
    return panel(
      {
        key: ui.Label(
          item.key,
          isHeader
            ? Configuration.style.data.title
            : Configuration.style.data.label
        ),
        value: ui.Chart(item.value.datatable, "Table", {
          pageSize: 13,
          allowHtml: true
        })
      },
      isHeader ? Configuration.style.data.panel : {},
      ui.Panel.Layout.flow("vertical", false)
    );
  }
  return panel(
    {
      key: ui.Label(
        item.key,
        isHeader
          ? Configuration.style.data.title
          : Configuration.style.data.label
      ),
      value: ui.Label(
        item.value,
        isHeader ? Configuration.style.data.title : { maxWidth: "95%" }
      )
    },
    isHeader ? Configuration.style.data.panel : {},
    ui.Panel.Layout.flow("horizontal", true)
  );
}

function loadList(context, data) {
  var list = data.reduce(function (acc, item) {
    var isHeader = item.type === "HEADER";
    acc[item.id] = loadValue(isHeader, item);
    return acc;
  }, {});
  context.output.body.panel.add(panel(list).panel);
}

function load(context, data, filter) {
  context.output.body.panel.clear();
  if (filter.typeOutput.value === 1) {
    loadChart(context, filter, data);
  } else if (Array.isArray(data)) {
    loadList(context, data);
  } else {
    loadTable(context, data);
  }
}

exports.init = init;
