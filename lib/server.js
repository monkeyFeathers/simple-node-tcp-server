'use strict';

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = 5678;

var server = _net2.default.createServer(function (connection) {
  var data = '';

  connection.on('data', function (chunk) {
    data += chunk;
    console.log(chunk.toString());
  });

  connection.on('end', function () {
    console.log('client disconnected');
    var date = new Date();

    // log results
    var logname = date.getTime().toString() + '.txt';
    _fs2.default.writeFile(_path2.default.join(__dirname, '.././log', logname), data, function (err) {
      if (err) throw err;
    });
  });

  connection.write('response text recieved\n');
  connection.pipe(connection);
});

server.listen(port, function () {
  console.log('server bound on port', port);
});