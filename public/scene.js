var Mouse = {Left:0,Middle:1,Right:2,Move:5};
var Event = {
  Click:{Released:'released',Pressed:'pressed'}
};
var Scene = function(containerP,widthP=400,heightP=400){
  var self = this;
  var container;
  if (typeof containerP === 'string' || containerP instanceof String){
    container = document.getElementById(containerP);
  }else if(containerP instanceof Element){
    container = containerP;
  }else{
    container = document.getELementByTagname("body")[0];
  }
  var canvas;
  var context;
  var width = widthP;
  var height = heightP;
  var mouseX = 0;
  var mouseY = 0;
  var nodes = new Array();

  var backgroundColor = Scene.Color.Gray;

  self.mouseMoved = function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  self.mouseReleased = function(event){
    self.mouse(Event.Click.Released,event);
  }
  self.mousePressed = function(event){
    self.mouse(Event.Click.Pressed,event);
  }
  self.mouse = function(type,event){
    for(var i=nodes.length-1;i>=0;i--){
      var node = nodes[i];
      if(node.isMouseOver(mouseX,mouseY)){
        if(node.button==event.button){
          if(node.clickEvent==type){
            node.clicked();
            event.preventDefault();
          }
        }
      }
    }
  };


  self.init = function(){
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener('mousemove',self.mouseMoved);
    canvas.addEventListener('mouseup',self.mouseReleased);
    canvas.addEventListener('mousedown',self.mousePressed);
    context = canvas.getContext("2d");
    container.appendChild(canvas);

    var button = new Scene.Control.Button(TicTacToe.Mode.Local1vs1);
    button.onClicked(function(){
      console.log("Local1vs1 starts now");
    });
    nodes.push(button);
    self.draw();
  };
  self.draw = function(){
    //Background
    context.fillStyle = 'rgba('+backgroundColor.r+','+backgroundColor.g+','+backgroundColor.b+','+backgroundColor.a+')';
    context.fillRect(0,0,width,height);

    for(var i=nodes.length-1;i>=0;i--){
      var node = nodes[i];
      //Button
      //Background First
      context.fillStyle = 'rgba('+node.back.color.r+','+node.back.color.g+','+node.back.color.b+','+node.back.color.a+')';

      context.fillRect(node.x,node.y,node.width,node.height);
      //Border After
      context.lineWidth = node.border.width;
      context.strokeStyle = 'rgba('+node.border.color.r+','+node.border.color.g+','+node.border.color.b+','+node.border.color.a+')';
      if(node.isMouseOver(mouseX,mouseY)){
        context.strokeStyle = 'rgba('+node.borderHover.color.r+','+node.borderHover.color.g+','+node.borderHover.color.b+','+node.borderHover.color.a+')';
      }
      context.strokeRect(node.x,node.y,node.width,node.height);
      //childs
      for(var j=node.childs.length-1;j>=0;j--){
        var child = node.childs[j];
        //Text
        context.lineWidth = child.font.weight;
        context.font = child.font.size+'px '+child.font.family;
        context.fillStyle = 'rgba('+child.font.color.r+','+child.font.color.g+','+child.font.color.b+','+child.font.color.a+')';
        context.strokeStyle = 'rgba('+child.font.color.r+','+child.font.color.g+','+child.font.color.b+','+child.font.color.a+')';
        var x = child.x+(child.width/2)-(child.textWidth(false)/2);
        var y = child.y+(child.height/2);//-(node.textHeight()/2);
        if(node.isMouseOver(mouseX,mouseY)){
          context.lineWidth = child.fontHover.weight;
          context.font = child.fontHover.size+'px '+child.fontHover.family;
          context.fillStyle = 'rgba('+child.fontHover.color.r+','+child.fontHover.color.g+','+child.fontHover.color.b+','+child.fontHover.color.a+')';
          context.strokeStyle = 'rgba('+child.fontHover.color.r+','+child.fontHover.color.g+','+child.fontHover.color.b+','+child.fontHover.color.a+')';
          x = child.x+(child.width/2)-(child.textWidth(true)/2);
          y = child.y+(child.height/2);//-(node.textHeight()/2);
        }
        context.fillText(child.text,x,y,node.width);
        context.strokeText(child.text,x,y,node.width);
      }
    }
    window.setTimeout(function(){self.draw();},10);
  };

  self.getCanvas = function(){ return canvas; };
  self.getCanvasContext = function(){ return context; };
}
Scene.Control = {
  Button : function(text="Button",x=100,y=100,width=200,height=50){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.childs = new Array();
    var textBlock = new Scene.Control.TextBlock(text,this.x,this.y);
    textBlock.width = width;
    textBlock.height = height;
    this.childs.push(textBlock);

    this.border={color:Scene.Color.Black, width : 5};
    this.borderHover={color:Scene.Color.Yellow, width : 5};
    this.back={color:Scene.Color.None};

    var clickCallback;
    this.clickEvent = Event.Click.Released;
    this.button = Mouse.Left;
    this.isMouseOver = function(mouseX,mouseY){
      if(mouseX >= this.x && mouseX <= this.x+this.width){
        if(mouseY >= this.y && mouseY <= this.y+this.height){
          return true;
        }
      }
      return false;
    };
    this.clicked = function(){
      clickCallback();
    };
    this.onClicked = function(callback){
      if(callback instanceof Function||typeof callback === "function"){
        clickCallback = callback;
      }
    };
  },
  TextBlock : function(value='Text',x,y){
    this.x = x;
    this.y = y;
    this.width;
    this.height;

    this.text = value;
    this.font = {size : 20, color: Scene.Color.Black,family:'Arial', weight : 1};
    this.fontHover = {size : 20, color: Scene.Color.Green,family:'Arial',weight : 2};
    this.textWidth = function(hover){
      var font = hover?this.fontHover:this.font;
      return $.fn.textWidth(this.text,font.size+'px '+font.family);
    }
    // this.height = function(){
    //   var font = hover?this.fontHover:this.font;
    //   return $.fn.textHeight(this.text,font.size+'px '+font.family);
    // }

    this.isMouseOver = function(mouseX,mouseY){
      if(mouseX >= this.x && mouseX <= this.x+this.width){
        if(mouseY >= this.y && mouseY <= this.y+this.height){
          return true;
        }
      }
      return false;
    };
  }
};
Scene.Color = {
    White : {r:255,g:255,b:255,a:1},
    Red : {r:255,g:0,b:0,a:1},
    Green : {r:0,g:255,b:0,a:1},
    Yellow : {r:255,g:255,b:0,a:1},
    Blue : {r:0,g:0,b:255,a:1},
    Gray : {r:100,g:100,b:100,a:1},
    Black : {r:0,g:0,b:0,a:1},
    None : {r:0,g:0,b:0,a:0}
};
// Calculate width of text from DOM element or string. By Phil Freo <http://philfreo.com>
$.fn.textWidth = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.width();
};
// Calculate height of text from DOM element or string. By Phil Freo <http://philfreo.com>
$.fn.textHeight = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.height();
};
