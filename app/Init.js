/**
 * @module App
 * @author: Joseline Quiros Mendez.
 * @author: Jose Beita Cascante.
 * @version V0.1
 */

var ASSETS_ROOT = "projects/bryan01/assets/cantones_costa_rica";
var MAX_ERROR = 1;
//
var Data = require("users/BAM/SisAgroV1:core/Data.js");

function exportAsset(geometry, name, dir) {
  Export.table.toAsset({
    collection: geometry,
    description: name,
    assetId: dir + "/" + name,
  });
}

function getAsset() {
  return ee.FeatureCollection(ASSETS_ROOT);
}

function all() {
  var geometry = getAsset()
    .union(MAX_ERROR)
    .geometry()
    .simplify(MAX_ERROR);
  return ee.FeatureCollection(geometry);
}

function find(codProvincia, codCanton) {
  var geometry = getAsset()
    .filter(
      ee.Filter.and(
        ee.Filter.eq('COD_PROV', codProvincia),
        ee.Filter.eq('COD_CANT', codCanton)
      )
    )
    .geometry()
    .simplify(MAX_ERROR);
  return ee.FeatureCollection(geometry);
}

exportAsset(all(), 'costa_rica', "zones");

Data.getZones().forEach(function (z) {
  var name = z.label.replace(" ", "_").toLowerCase();
  exportAsset(find(z.codProvincia, z.codCanton), name, "zones");
});
