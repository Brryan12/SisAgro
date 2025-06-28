function response(code, data) {
  return ee.Dictionary({ code: code, data: data });
}

function error(ex) {
  return response(0, ex);
}

function success(data) {
  return response(1, data);
}

function thenOrElse(resp_, value, orElse) {
  var resp = ee.Dictionary(resp_);
  var result = ee.Algorithms.If(resp.getNumber("code").eq(1), value, orElse);
  return ee.Dictionary(result);
}

function then(resp, value) {
  return thenOrElse(resp, value, resp);
}

function data(resp, resolve, reject) {
  resp.evaluate(function (r) {
    try {
      if (r.code === 1) {
        resolve(r.data);
      } else {
        reject(r.data);
      }
    }
    catch (ex) { reject(ex); }
  });
}

exports.error = error;
exports.success = success;
exports.thenOrElse = thenOrElse;
exports.then = then;
exports.data = data;