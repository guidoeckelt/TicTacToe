var client = angular.module("io-client",[]);

function SocketService(){

    var socket = io();
    var connected = false;
    var connectionListener = new Array();

    this.isConnected = function(){ return connected};
    this.on = function(event,callback){
      socket.on(event,callback);
    };
    this.AddConnectionListener = function(callback){
      connectionListener.push(callback);
    };
    var OnConnectionSwitched = function(newValue){
      for(var listener of connectionListener){
        listener(newValue);
      }
    };

    //init
    socket.on("connect",function(){
      connected = true;
      console.log("io-client connection established");
      OnConnectionSwitched(connected);
    });
    socket.on("disconnect",function(){
      connected = false;
      console.log("io-client connection lost");
      OnConnectionSwitched(connected);
    });
}

client.factory("socket",function(){
  return new SocketService();
});
