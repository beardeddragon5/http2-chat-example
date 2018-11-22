'use strict';

const helper = require("../src/helper");
const http2 = require("http2");
const path = require("path");

const publicFiles = helper.getFiles(path.join(__dirname, '../public'))

// Push file
function push (stream, path) {
  const file = publicFiles.get(path)
  if (!file) {
    return
  }
  stream.pushStream({":path": path}, (err, pushStream, headers) => {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
  })
}

module.exports = {
  GET: function webapp(req, res, path) {
    push(res.stream, '/namegenerator.js');
    push(res.stream, '/simple.css');
    push(res.stream, '/script.js');
    push(res.stream, '/jquery-1.11.1.min.js');
    push(res.stream, '/bootstrap.min.js');
    push(res.stream, '/bootstrap.min.css');

    const file = publicFiles.get('/index.html');
    res.stream.respondWithFD(file.fileDescriptor, file.headers);

    req.on('finish', () => console.log('webapp connnection closed'));
  }
};
