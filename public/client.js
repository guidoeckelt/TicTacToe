var client = angular.module("SocketService",[]);

function io_client(){

    var socket;
    var connected = false;
    var connectionListener = new Array();

    this.connect = function(url){
      socket = io(url);
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
    this.isConnected = function(){ return connected};
}
client.factory("io-client",function(){
  return new io_client();
});
