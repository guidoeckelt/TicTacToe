
function User(socket, name){
  this.socket = socket;
  this.id = socket.id;
  this.name = name;
  this.mouseX = -1;
  this.mouseY = -1;

  this.toDto = function(){
    return {id:this.id,
          name:this.name,
          mouseX:this.mouseX,
          mouseY:this.mouseY};
  }
}

module.exports = {
  User : User
};
