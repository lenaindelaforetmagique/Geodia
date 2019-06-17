// MIT License
//
// Copyright (c) 2018 Xavier Morin
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// HTML view + events + update


removeDOMChildren = function(dom) {
  //removes all children of dom
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  };
};

isTouched = function(dom, x, y) {
  // returns true/false if dom is under (x,y)
  let box = dom.getBoundingClientRect();
  return (box.x <= x && x <= box.x + box.width) && (box.y <= y && y <= box.y + box.height);
}


HTMLView = function(sourceShapes, coord = [0, 0], animated = true, numProj = 0) {
  this.container = document.getElementById("container");
  this.animated = animated;
  this.hasChanged = false;

  this.svgMap = null;
  this.svgText = null;

  this.lambda0 = coord[0];
  this.phi0 = coord[1];

  this.iProjection = 0;
  this.projection = ListOfProjections[0];
  this.projTitle = "";

  this.lastUpdate = Date.now();

  this.init(sourceShapes, coord);
  this.setupInput();
  this.changeProj(numProj);
  this.setupUpdate();
}


HTMLView.prototype.init = function(sourceShapes, coord) {
  this.svgMap = new SVGMap(sourceShapes, coord);
  this.container.appendChild(this.svgMap.domObj);

  this.svgText = new SVGText();
  this.container.appendChild(this.svgText.domObj);
  this.svgText.setAnimationBtn(this.animated);

  this.lambda0 = coord[0];
  this.phi0 = coord[1];
}

HTMLView.prototype.changeProj = function(incr = 0, dlambda = 0, dphi = 0) {
  this.iProjection += incr;
  while (this.iProjection < 0) {
    this.iProjection += ListOfProjections.length;
  }
  this.iProjection %= ListOfProjections.length;
  this.projection = ListOfProjections[this.iProjection];

  this.phi0 = Math.max(-90, Math.min(90, this.phi0 + dphi));
  this.lambda0 += dlambda;
  while (this.lambda0 < -180) {
    this.lambda0 += 360;
    this.lambda0 = Math.floor(this.lambda0 / 10) * 10;
  }
  while (this.lambda0 > 180) {
    this.lambda0 -= 360;
    this.lambda0 = Math.floor(this.lambda0 / 10) * 10;
  }

  this.projection.setProj(this.lambda0, this.phi0);
  this.svgText.setProj(this.projection);
  this.svgMap.reProject(this.projection)

  this.hasChanged = true;
}

HTMLView.prototype.toggleAnimated = function() {
  this.animated = !this.animated;
  this.svgText.setAnimationBtn(this.animated);
}

HTMLView.prototype.update = function() {
  this.svgMap.update(this.animated);
}

HTMLView.prototype.draw = function() {
  this.svgMap.draw();
}

HTMLView.prototype.setupInput = function() {
  // all events behavior here
  var thiz = this;

  document.onkeydown = function(e) {
    // console.log(e.which);
    switch (e.which) {
      case 68: //d
        thiz.changeProj(0, 0, -10);
        break;
      case 69: //e
        thiz.changeProj(0, 0, 10);
        break;
      case 70: //f
        thiz.changeProj(0, 10);
        break;
      case 83: //s
        thiz.changeProj(0, -10);
        break;
      case 37: // left arrow
        thiz.changeProj(-1);
        break;
      case 39: // right arrow
        thiz.changeProj(1);
        break;
    }
  }

  window.onresize = function(e) {
    thiz.svgMap.viewBox.resize();
    thiz.changeProj(0);
    thiz.svgText.resize();
  }

  this.svgText.controlText.onclick = function(e) {
    thiz.svgText.toggleControl();
  }

  this.svgText.animationBtn.onclick = function(e) {
    thiz.toggleAnimated();
  }

  this.touchInput();
}


HTMLView.prototype.touchInput = function() {
  var thiz = this;
  var dom = this.container;

  this.input = new Input(dom);

  move = function(dx, dy) {
    thiz.svgMap.viewBox.translate(-dx, -dy);
  };

  zoom = function(k) {
    thiz.svgMap.viewBox.scale(thiz.input.curPos.x, thiz.input.curPos.y, k);
  };

  changeOrigin = function(dx, dy) {
    let domRect = thiz.svgMap.domObj.getBoundingClientRect();
    let k = domRect.width / thiz.svgMap.viewBox.box[2];
    thiz.changeProj(0, dx / k, dy / k);
  }

  this.input.handle_mousedown = function(e) {
    thiz.input.loadMouse(e);
    thiz.input.savePos();
  };

  this.input.handle_mousemove = function(e) {
    thiz.input.loadMouse(e);
    if (thiz.input.prevPos !== null) {
      let dx = thiz.input.curPos.x - thiz.input.prevPos.x;
      let dy = thiz.input.curPos.y - thiz.input.prevPos.y;
      if (e.shiftKey) {
        changeOrigin(-dx, dy);
      } else {
        move(dx, dy);
      }
      thiz.input.savePos();
    }
  };

  this.input.handle_mouseup = function(e) {
    thiz.input.loadMouse(e);
    thiz.input.resetPos();
  };

  this.input.handle_wheel = function(e) {
    thiz.input.loadMouse(e);
    let k = 1.1;
    if (e.deltaY > 0) {
      k = 1 / k;
    }
    zoom(k);
  };

  this.input.handle_touchstart = function(e) {
    thiz.input.loadTouch(e);
    thiz.input.savePos();
    thiz.input.saveTouchSize();
  };

  this.input.handle_touchmove = function(e) {
    thiz.input.loadTouch(e);
    thiz.input.hasMoved = true;

    if (thiz.input.prevPos !== null) {
      let dx = thiz.input.curPos.x - thiz.input.prevPos.x;
      let dy = thiz.input.curPos.y - thiz.input.prevPos.y;

      if (thiz.input.curSize > 0) {
        // more than 1 finger
        move(dx, dy);

        if (thiz.input.prevSize > 0) {
          zoom(thiz.input.curSize / thiz.input.prevSize);
          thiz.input.saveTouchSize();
        }
      } else {
        // 1 finger + x-slide>20px
        changeOrigin(-dx, dy);
      }
      thiz.input.savePos();
    }
  };

  this.input.handle_touchend = function(e) {
    if (!thiz.input.hasMoved) {
      let x = thiz.input.prevPos.x;
      let y = thiz.input.prevPos.y;
      if (isTouched(thiz.svgText.animationBtn, x, y)) {
        thiz.toggleAnimated();
      } else if (isTouched(thiz.svgText.controlText, x, y)) {
        thiz.svgText.toggleControl();
      } else if (x < window.innerWidth / 4) {
        thiz.changeProj(-1);
      } else if (x > window.innerWidth * 3 / 4) {
        thiz.changeProj(1);
      }
    }
    thiz.input.resetPos();
    thiz.input.resetTouchSize();
    thiz.input.hasMoved = false;
  };
};


HTMLView.prototype.setupUpdate = function() {
  var thiz = this;
  var updateCB = function(timestamp) {
    thiz.refresh(timestamp);
    window.requestAnimationFrame(updateCB);
  };
  updateCB(0);
};

HTMLView.prototype.needRefresh = function() {
  if (this.animated) {
    let now = Date.now();
    if (now - this.lastUpdate > 20) {
      this.lastUpdate = now;
      return true;
    } else {
      return false;
    }
  } else if (this.hasChanged) {
    this.hasChanged = false;
    return true;
  }
}

HTMLView.prototype.refresh = function(ts) {
  if (this.needRefresh()) {
    this.update();
    this.draw();
  }
};