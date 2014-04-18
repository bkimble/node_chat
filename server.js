var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var sys = require('sys');
var cache = {};

function send404(response){
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {"content-type": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if(cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);cx
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        console.log('yes');
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        })
      } else {
        console.log("no find " + absPath);
        send404(response);
      }
    })
  }
}

var server = http.createServer(function(request, response) {
  var filePath = false;
  if(request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath)
})

server.listen(2999, function() {
  console.log("Server listening on port 2999");
})

var chatServer = require('./lib/chat_server');
chatServer.listen(server);

