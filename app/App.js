/**
 * @module App
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Filter = require("users/BAM/SisAgroV1:presentation/Filter.js");
var Layer = require("users/BAM/SisAgroV1:presentation/Layer.js");
var Interface = require("users/BAM/SisAgroV1:presentation/Interface.js");
var Configuration = require("users/BAM/SisAgroV1:presentation/Configuration.js");
var Alert = require("users/BAM/SisAgroV1:presentation/Alert.js");
var Style = Configuration.style;
var Message = Configuration.message;
var Data = require("users/BAM/SisAgroV1:core/Data.js");
var Main = require("users/BAM/SisAgroV1:presentation/Main.js");

var app = {};

app.init = function () {
  Map.setControlVisibility({ all: false });
  app.alert = Alert.init();
};

app.createPanels = function () {
  app.filter = Filter.init(
    Data.getReportTypes(),
    Data.getZones(),
    Data.getIndicators(),
    Data.getCountYears(),
    Data.getYears(),
    Data.getOutputs()
  );
  app.layer = Layer.init(
    Style.point,
    Style.geometry.transparency,
    Style.point.transparency
  );
  app.interface = Interface.init(
    app.filter,
    app.onChangeZone,
    app.onChange,
    Data.getAbout(),
    Data.getMapTypes(),
    app.onChangeVisualization
  );
};

app.createHelpers = function () {
  app.onFail = function (message, ex, callback) {
    Alert.err(message + ex);
    callback();
  };

  app.onFailLayer = function (ex, callback) {
    app.interface.main.onLoadUserGuide();
    app.interface.main.loadVisualization();
    app.layer.zone.clean();
    app.onFail(Message.error.loadLayer, ex, callback);
  };

  app.onFailPoint = function (ex, callback) {
    app.interface.filter.cursor = null;
    app.interface.main.clearOutput();
    app.layer.point.clean();
    app.onFail(Message.error.loadPoint, ex, callback);
  };

  app.onLoadLayer = function (zone, callback) {
    app.interface.filter.isLayer = true;
    // app.layer.zoom = app.interface.main.resetZoom();
    var filter = app.interface.getFilter();
    if (zone.data) {
      Map.centerObject(filter.cursor ? filter.cursor : filter.zone.data, app.layer.zoom, function () {
        Main.search(
          filter,
          function (data_) {
            var data = ee.Image(ee.Deserializer.decode(data_));
            var zoneParams = filter.zoneParams[filter.indicator.value];
            app.layer.zone.update(data, zoneParams);
            app.interface.main.onLoadUserGuide();
            app.interface.main.loadVisualization(zoneParams);
            ui.util.setTimeout(callback, 1500);
          },
          function (ex) {
            app.onFailLayer(ex, callback);
          }
        );
      });
    }
  };

  app.onChangeZone = function (zone, callback) {
    var filter = app.interface.getFilter();
    if (filter.cursor) {
      app.interface.main.loadCoordenates(null, null);
      app.interface.main.clearOutput();
      app.layer.point.clean();
    }
    app.onLoadLayer(zone, callback);
  };

  app.onClick = function (coords) {
    app.interface.main.onLoading(true);
    app.interface.main.loadCoordenates(coords.lon, coords.lat);
    app.onChange(null, true, function () {
      app.interface.main.onLoading(false);
    });
  };

  app.onChange = function (event, isClick, callback) {
    app.interface.filter.isLayer = false;
    var filter = app.interface.getFilter();
    app.interface.main.clearOutput();
    if (filter.cursor) {
      filter.zone.data.contains(filter.cursor).evaluate(function (isContained) {
        if (isContained) {
          Main.search(
            filter,
            function (data) {
              app.interface.main.onLoad(data, filter);
              if (!isClick) {
                app.onLoadLayer(filter.zone, callback);
              } else {
                app.layer.point.update(filter.cursor);
                callback();
              }
            },
            function (ex) {
              app.onFailPoint(ex, function () {
                if (!isClick) {
                  app.onLoadLayer(filter.zone, callback);
                } else {
                  callback();
                }
              });
            }
          );
        } else {
          Alert.warn(Message.information.outsideZone);
          app.interface.main.loadCoordenates(null, null);
          app.layer.point.clean();
          callback();
        }
      });
    } else {
      if (!isClick) {
        app.onLoadLayer(filter.zone, callback);
      } else {
        app.interface.main.clearOutput();
        app.layer.point.clean();
        callback();
      }
    }
  };

  app.onChangeVisualization = function (type, value) {
    if (type === "transparency") {
      app.layer.zone.transparency = value;
      app.layer.zone.update();
    } else if (type === "zoom") {
      var filter = app.interface.getFilter();
      app.layer.zoom = value;
      Map.centerObject(filter.cursor ? filter.cursor : filter.zone.data, value);
    } else {
      Map.setOptions(value);
    }
  };

  app.onLoadMinMax = function () {
    app.interface.panel.style().set("shown", false);
    Main.viewParams(function (data) {
      app.interface.filter.zoneParams[0] = data[0];
      app.interface.filter.zoneParams[5] = data[5];
      app.interface.filter.zoneParams[6] = data[6];
      app.onChangeZone(app.interface.filter.zone.value, function () {
        app.interface.panel.style().set("shown", true);
      });
    }, app.onFail);
  };
};

app.boot = function () {
  try {
    app.init();
    ui.root.setLayout(ui.Panel.Layout.absolute());
    ui.root.insert(0, app.alert);
    Alert.info(Configuration.label.loadingInterface);
    //
    app.createHelpers();
    app.createPanels();
    ui.root.insert(1, app.interface.panel);
    Map.onClick(app.onClick);
    app.onLoadMinMax();
  } catch (ex) {
    Alert.err(Message.error.initApplication + ex);
  }
};

app.boot();
