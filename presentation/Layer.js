/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Utils = require("users/Jo13bc/core:Utils.js");
var Configuration = require("users/Jo13bc/presentation:Configuration.js");
var Label = Configuration.label;
var Style = Configuration.style;
var zone = Label.filter.zone,
  point = Label.filter.point;

function clean(i) {
  Utils.updateLayer(i, ee.Geometry.MultiPoint([]), null, false, 0);
}

function update(i, data, params, transparency) {
  Utils.updateLayer(i, data, params, true, transparency);
}

function init(pointStyle, zoneTransparency, pointTransparency) {
  var layer = {};
  var zoneIndex = Utils.addLayer(zone, undefined);
  var pointIndex = Utils.addLayer(point, pointStyle);
  layer.zoom = Style.geometry.zoom;
  layer.zone = {
    transparency: zoneTransparency,
    clean: function () {
      clean(zoneIndex);
    },
    update: function (data, params) {
      update(zoneIndex, data, params, layer.zone.transparency);
    }
  };
  layer.point = {
    transparency: pointTransparency,
    clean: function () {
      clean(pointIndex);
    },
    update: function (data) {
      update(pointIndex, data, null, layer.point.transparency);
    }
  };
  return layer;
}

exports.init = init;
