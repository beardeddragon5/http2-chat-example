'use strict'

const http2 = require("http2");
const fs = require("fs");
const path = require("path");
const router = require("./routes");

const PORT = process.env.PORT || 4000

const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, './ssl/cert3.pem')),
  key: fs.readFileSync(path.join(__dirname, './ssl/key3.pem'))
}, router);

server.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(`Server listening on ${PORT}`)
})
