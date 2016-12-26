// App-Vars
var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io')(http);
//Webserver-Vars
var port = 3001;
var viewDir = __dirname+'/view/';
var publicDir = __dirname+'/public/';
//TicTacToe-Server-Vars
var connectedSockets = {};
var libDir = __dirname+'/lib/';
var user = require(libDir+'server/user.js');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(publicDir));
// listen for requests :)
var listener = http.listen(port, function () {
    console.log('TacTacToe-App is listening on port ' + listener.address().port);
});
app.get("/", function (request, response){
    response.sendFile(viewDir+'index.html');
});
app.post("/check/name", function (request, response){
  var name = request.query.name;
  var result
  if(name==null){
    result = 'NULL'
  }else if(name=='Hitler'){
    result = 'Fick Dich,Nazi!!'
  }else{
    result = 'OK'
  }
  response.sendJson(result);
});


//Socket Connections
io.on('connection', function(socket){
  console.log('socket connection established');
  socket.on('init',function(data){
    data.id = socket.id;
    data.socket = socket;
    connectedSockets[socket.id+""] = new user.User(socket,data.name);
  });
  socket.on('update',function(data){
    connectedSockets[socket.id+""].mouseX = data.mouseX;
    connectedSockets[socket.id+""].mouseY = data.mouseY;
  });
  socket.on('disconnect', function(){
    console.log('socket connection lost');
    if(connectedSockets[socket.id+""]==null){
      console.log('no User-Object made');
    }
    connectedSockets[socket.id+""] = null;
    delete(connectedSockets[socket.id+""]);
  });
});

var period = 2000;
var heartbeat = function(){
  var keys = Object.keys(connectedSockets);
  var list = keys.map(function(key){return connectedSockets[key].toDto();});
  console.log("Connected User:");
  for(var i=keys.length-1;i>=0;i--){
    var key = keys[i];
    var user = connectedSockets[key];
    // if(socket==null){
    //   console.log("null user");
    //   continue;
    // }

    user.socket.emit('update',list);
    // console.log('\tid:'+user.id+' | '
    //  +'name:'+user.name+' | '
    //  +'mouseX:'+user.mouseX+' | '
    //  +'mouseY:'+user.mouseY);
  }
};
setInterval(heartbeat,period);
