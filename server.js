

// init project
var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io')(http);

var port = 3001;
var viewDir = __dirname+'/view/';
var publicDir = __dirname+'/public/';


// http://expressjs.com/en/starter/static-files.html
app.use(express.static(publicDir));

// listen for requests :)
var listener = http.listen(port, function () {
    console.log('TacTacToe-App is listening on port ' + listener.address().port);
});

app.get("/", function (request, response){
    response.sendFile(viewDir+'index.html');
});

//Socket Connections
io.on('connection', function(socket){
  console.log('socket connection established');
  socket.on('disconnect', function(){
    console.log('socket connection lost');
  });
});
