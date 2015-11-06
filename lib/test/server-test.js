'use strict';

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

function hasDup(array) {
  var obj = {};
  for (var i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      return true;
    } else {
      obj[array[i]] = true;
    }
  }
  return false;
}

function promiseReadDir(path) {
  return new Promise(function (res, rej) {
    _fs2.default.readdir(path, function (err, data) {
      res(data);
      rej(err);
    });
  });
}

describe('Simple TCP Server', function () {

  describe('receive tcp requests and log to file.', function () {
    var initFiles = undefined;
    var error = undefined;

    before(function (done) {
      promiseReadDir('./log').then(function (files) {
        initFiles = files;
      }).then(function () {
        var client = _net2.default.connect({ port: 5678 }, function () {
          client.write('in your face');
          client.end();
        });
        client.on('close', function () {
          client.destroy();
          done();
        });
      }).catch(function (err) {
        error = err;
        done();
      });
    });

    it('should save each request to a new file', function (done) {
      ;
      var readDir = promiseReadDir('./log').then(function (files) {
        expect(files.length).to.eql(initFiles.length + 1);
        done();
      }).catch(function (err) {
        if (err) throw err;
      });
    });

    it('should give each log file a unique name', function (done) {
      var readDir = promiseReadDir('./log').then(function (files) {
        expect(hasDup(files)).to.be.false;
        done();
      }).catch(function (err) {
        if (err) throw err;
      });
    });

    after(function (done) {
      _fs2.default.readdir('./log', function (err, files) {
        if (files.length === initFiles.length + 1) {
          _fs2.default.unlink('./log/' + files[files.length - 1], function (err) {
            if (err) throw err;
            done();
          });
        }
      });
    });
  });
});