'use strict';

import net from 'net';
import fs from 'fs';
import path from 'path';
const port = 5678;

let server = net.createServer(connection => {
  let data = '';

  connection.on('data', chunk => {
    data += chunk;
    console.log(chunk.toString());
  });

  connection.on('end', () => {
    console.log('client disconnected');
    let date = new Date();

    // log results
    let logname = date.getTime().toString() + '.txt';
    fs.writeFile(path.join(__dirname, '.././log', logname), data, (err) => {
      if (err) throw err;
    });
  });

  connection.write('response text recieved\n');
  connection.pipe(connection);

});

server.listen(port, () => {
  console.log('server bound on port', port);
});
