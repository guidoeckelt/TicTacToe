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
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
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

  self.add = function(node){
    if(!node instanceof Scene.Control.Button){
      console.log(node+" was not a Button");
      return;
    }
    nodes.push(node);
  }
  var drawPane = function(pane){
    //Background First
    context.fillStyle = 'rgba('+pane.back.color.r+','+pane.back.color.g+','+pane.back.color.b+','+pane.back.color.a+')';
    if(pane.isMouseOver(mouseX,mouseY)){
      context.fillStyle = 'rgba('+pane.backBorder.color.r+','+pane.backBorder.color.g+','+pane.backBorder.color.b+','+pane.backBorder.color.a+')';
    }
    context.fillRect(pane.x,pane.y,pane.width,pane.height);
    //Border After
    context.lineWidth = pane.border.width;
    context.strokeStyle = 'rgba('+pane.border.color.r+','+pane.border.color.g+','+pane.border.color.b+','+pane.border.color.a+')';
    if(pane.isMouseOver(mouseX,mouseY)){
      context.strokeStyle = 'rgba('+pane.borderHover.color.r+','+pane.borderHover.color.g+','+pane.borderHover.color.b+','+pane.borderHover.color.a+')';
    }
    context.strokeRect(pane.x,pane.y,pane.width,pane.height);
    //childs
    for(var j=pane.childs.length-1;j>=0;j--){
      var child = pane.childs[j];

    }
  };
  var drawTextBlock = function(textBlock){
    //Text
    context.lineWidth = textBlock.font.weight;
    context.font = textBlock.font.size+'px '+textBlock.font.family;
    context.fillStyle = 'rgba('+textBlock.font.color.r+','+textBlock.font.color.g+','+textBlock.font.color.b+','+textBlock.font.color.a+')';
    context.strokeStyle = 'rgba('+textBlock.font.color.r+','+textBlock.font.color.g+','+textBlock.font.color.b+','+textBlock.font.color.a+')';
    var x = textBlock.x+(textBlock.width/2)-(textBlock.textWidth(false)/2);
    var y = textBlock.y+(textBlock.height/2);//-(textBlock.textHeight()/2);
    if(textBlock.isMouseOver(mouseX,mouseY)){
      context.lineWidth = textBlock.fontHover.weight;
      context.font = textBlock.fontHover.size+'px '+textBlock.fontHover.family;
      context.fillStyle = 'rgba('+textBlock.fontHover.color.r+','+textBlock.fontHover.color.g+','+textBlock.fontHover.color.b+','+textBlock.fontHover.color.a+')';
      context.strokeStyle = 'rgba('+textBlock.fontHover.color.r+','+textBlock.fontHover.color.g+','+textBlock.fontHover.color.b+','+textBlock.fontHover.color.a+')';
      x = textBlock.x+(textBlock.width/2)-(textBlock.textWidth(true)/2);
      y = textBlock.y+(textBlock.height/2);//-(textBlock.textHeight()/2);
    }
    context.fillText(textBlock.text,x,y,textBlock.width);
    context.strokeText(textBlock.text,x,y,textBlock.width);
  };
  var drawButton = function(button){
    //Background First
    context.fillStyle = 'rgba('+button.back.color.r+','+button.back.color.g+','+button.back.color.b+','+button.back.color.a+')';
    if(button.isMouseOver(mouseX,mouseY)){
      context.fillStyle = 'rgba('+button.backHover.color.r+','+button.backHover.color.g+','+button.backHover.color.b+','+button.backHover.color.a+')';
    }
    context.fillRect(button.x,button.y,button.width,button.height);
    //Border After
    context.lineWidth = button.border.width;
    context.strokeStyle = 'rgba('+button.border.color.r+','+button.border.color.g+','+button.border.color.b+','+button.border.color.a+')';
    if(button.isMouseOver(mouseX,mouseY)){
      context.strokeStyle = 'rgba('+button.borderHover.color.r+','+button.borderHover.color.g+','+button.borderHover.color.b+','+button.borderHover.color.a+')';
    }
    context.strokeRect(button.x,button.y,button.width,button.height);
    //childs
    for(var j=button.childs.length-1;j>=0;j--){
      var child = button.childs[j];
      drawTextBlock(child);
    }
  };
  self.draw = function(){
    //Background
    context.fillStyle = 'rgba('+backgroundColor.r+','+backgroundColor.g+','+backgroundColor.b+','+backgroundColor.a+')';
    context.fillRect(0,0,width,height);

    for(var i=nodes.length-1;i>=0;i--){
      var node = nodes[i];
      if(node instanceof Scene.Control.Button){
        drawButton(node);
      }else if(node instanceof Scene.Control.Pane){
        drawPane(node);
      } else if(node instanceof Scene.Control.TextBlock){
        drawTextBlock(node);
      }else{
        console.log(node.toString());
      }
    }
    window.setTimeout(function(){self.draw();},10);
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

    self.draw();
  };

  self.getCanvas = function(){ return canvas; };
  self.getCanvasContext = function(){ return context; };
}
Scene.Control = {
  Pane : function(x=100,y=100,width=200,height=50){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    var childs = new Array();

    self.attach = function(node){
      if(!node instanceof Scene.Control.Button){
        console.log(node+" was not a Button");
        return;
      }
      var length = childs.length;
      var newLength = childs.push(node);
      return newLength>length;
    }
    self.attach = function(node){
      if(!node instanceof Scene.Control.Button){
        console.log(node+" was not a Button");
      }
      for(var i=childs.length-1;i>=0;i--){
        if(node == childs[i]){
          childs.push(node);
          return true;
        }
      }
      return false
    }
    this.isMouseOver = function(mouseX,mouseY){
      if(mouseX >= this.x && mouseX <= this.x+this.width){
        if(mouseY >= this.y && mouseY <= this.y+this.height){
          return true;
        }
      }
      return false;
    };

    this.border={color:Scene.Color.Black, width : 5};
    this.borderHover={color:Scene.Color.Black, width : 5};
    this.back={color:Scene.Color.None};
    this.backHover={color:Scene.Color.White};
  },
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
    this.borderHover={color:Scene.Color.White, width : 5};
    this.back={color:Scene.Color.White};
    this.backHover={color:Scene.Color.Black};

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
      if(!(callback instanceof Function||typeof callback === "function")){
        return;
      }
      clickCallback = callback;
    };
  },
  TextBlock : function(value='Text',x,y){
    this.x = x;
    this.y = y;
    this.width;
    this.height;

    this.text = value;
    this.font = {size : 20, color: Scene.Color.Black,family:'Arial', weight : 1};
    this.fontHover = {size : 20, color: Scene.Color.White,family:'Arial',weight : 2};
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
    Blue : {r:30,g:30,b:255,a:1},
    DarkBlue : {r:0,g:0,b:255,a:1},
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
function getDisplaySize(){
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {width:x,height:y};
}
