/**
 * @module Presentation
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var Configuration = require("users/Jo13bc/presentation:Configuration.js");
var Style = Configuration.style;
var Label = Configuration.label;

var alertType = {
  succ: { color: Style.color.primary, title: Label.alert.succ },
  warn: { color: Style.color.warn, title: Label.alert.warn },
  err: { color: Style.color.error, title: Label.alert.err }
};
var alertStack;
var DELAY = 8200;

function init() {
  alertStack = ui.Panel([], ui.Panel.Layout.flow("vertical"), Style.alert.stack);
  return alertStack;
}

function remove(alert) {
  alertStack.remove(alert);
}

function add(type, message, callback) {
  var titleStyle = Style.alert.title;
  titleStyle.backgroundColor = type.color;
  var alert = ui.Panel(
    [
      ui.Label(type.title, titleStyle),
      ui.Label(message, Style.alert.message)
    ],
    ui.Panel.Layout.flow("vertical"),
    Style.alert.panel
  );
  alertStack.add(alert);
  ui.util.setTimeout(function (e) {
    remove(alert);
    if (callback) {
      callback();
    }
  }, DELAY);
}

function err(message, callback) {
  add(alertType.err, message, callback);
}

function info(message, callback) {
  add(alertType.succ, message, callback);
}

function warn(message, callback) {
  add(alertType.warn, message, callback);
}

exports.init = init;
exports.err = err;
exports.info = info;
exports.warn = warn;
