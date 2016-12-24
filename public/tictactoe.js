function TicTacToe(){
  var self = this;

  this.init = function(){

  }

}
TicTacToe.Mode = {
  SingleVsAI : "Single vs AI",
  Local1vs1: "Local 1vs1",
  Online1vs1 : "Online 1vs1"
};
var canvas;
var ASK_MODE = 0;
var buttons = [];
var INIT_MODE = 1;
var LOOP_MATCH = 2;

var currentStatus = askMode;

var currentMode = null;
var currentMatch = null;

function askMode(){
  background(50);
  for(var button of buttons){
    push();
    fill(0,0,0,0);
    stroke(255);
    strokeWeight(5);
    if(mouseX >= button.x && mouseX <= button.x+button.width){
      if(mouseY >= button.y && mouseY <= button.y+button.height){
        stroke(0,0,255);
      }
    }
    rect(button.x,button.y,button.width,button.height);
    pop();
    push();
    textSize(button.font.size);
    strokeWeight(button.font.weight);
    fill(button.font.color.r,button.font.color.g,button.font.color.b);
    stroke(button.font.color.r,button.font.color.g,button.font.color.b);
    if(mouseX >= button.x && mouseX <= button.x+button.width){
      if(mouseY >= button.y && mouseY <= button.y+button.height){
        textSize(button.fontHover.size);
        strokeWeight(button.fontHover.weight);
        fill(button.fontHover.color.r,button.fontHover.color.g,button.fontHover.color.b);
        stroke(button.fontHover.color.r,button.fontHover.color.g,button.fontHover.color.b);
      }
    }
    var x = button.x+(button.width/2)-(button.textWidth()/2);
    var y = button.y+(button.height/2)-(button.textHeight()/2);
    text(button.text,x,y,x,y);
    pop();
  }
}
function initMode(){
  background(100);

}
function loopMatch(){
  background(150);

}

// function setup(){
//   canvas = createCanvas(displayWidth,displayHeight);
//   canvas.parent('canvas-container');
//
//   var button = new Scene.Control.Button(TicTacToe.Mode.SingleVsAI);
//   buttons.push(button);
//   button = new Scene.Control.Button(TicTacToe.Mode.Local1vs1,350, 100);
//   buttons.push(button);
//   button = new Scene.Control.Button(TicTacToe.Mode.Online1vs1,600, 100);
//   buttons.push(button);
// }
//
// function draw(){
//   switch(currentStatus){
//     case ASK_MODE: askMode(); break;
//     case INIT_MODE: initMode(); break;
//     case LOOP_MATCH: loopMatch(); break;
//     default: askMode();
//   }
// }
