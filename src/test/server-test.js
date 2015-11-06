'use strict';

import net from 'net';
import chai from 'chai';
import fs from 'fs'
const expect = chai.expect;

function hasDup(array) {
  let obj = {};
  for (var i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      return true
    } else {
      obj[array[i]] = true;
    }
  }
  return false
}

function promiseReadDir(path) {
  return new Promise( (res,rej) => {
    fs.readdir(path, (err, data) => {
      res(data);
      rej(err);
    });
  });
}

describe('Simple TCP Server', () => {

  describe('receive tcp requests and log to file.', () => {
    let initFiles;
    let error;

    before(done => {
      promiseReadDir('./log')
        .then(files => {initFiles = files;})
        .then(() => {
          let client = net.connect({port: 5678}, () =>{
            client.write('in your face');
            client.end();
          });
          client.on('close', () => {
            client.destroy();
            done();
          })
        })
        .catch(err => {
          error = err;
          done();
        });
    });

    it('should save each request to a new file', done => {;
      let readDir = promiseReadDir('./log')
        .then(files => {
          expect(files.length).to.eql(initFiles.length + 1);
          done();
        })
        .catch(err => {if (err) throw err;})
    });

    it('should give each log file a unique name', done => {
      let readDir = promiseReadDir('./log')
        .then(files => {
          expect(hasDup(files)).to.be.false;
          done();
        })
        .catch(err => {if (err) throw err;})
    })

    after(done => {
      fs.readdir('./log', (err, files) => {
        if (files.length === initFiles.length +1 ) {
          fs.unlink('./log/'+files[files.length - 1], err => {
            if (err) throw err;
            done();
          });
        }
      });
    });

  });

});
