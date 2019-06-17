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

// Contains everything about the mouse and touch events.

var nop = function() {};

Input = function(dom) {

  this.spyEvent = nop;

  this.handle_mousedown = nop;
  this.handle_mousemove = nop;
  this.handle_mouseup = nop;
  this.handle_wheel = nop;

  this.handle_touchstart = nop;
  this.handle_touchmove = nop;
  this.handle_touchend = nop;
  this.handle_touchcancel = nop;
  this.handle_touchleave = nop;

  this.msg = null;
  this.prevPos = null;
  this.curPos = null;

  this.prevSize = null;
  this.curSize = null;
  this.hasMoved = false;

  var thiz = this;

  dom.addEventListener("mousedown", function(e) {
    e.preventDefault();
    thiz.handle_mousedown(e);
  }, false);

  dom.addEventListener("mousemove", function(e) {
    e.preventDefault();
    thiz.handle_mousemove(e);
  }, false);

  dom.addEventListener("mouseup", function(e) {
    e.preventDefault();
    thiz.handle_mouseup(e);
  }, false);

  dom.addEventListener("wheel", function(e) {
    e.preventDefault();
    thiz.handle_wheel(e);
  }, false);

  dom.addEventListener("touchstart", function(e) {
    e.preventDefault();
    thiz.handle_touchstart(e);
  }, false);

  dom.addEventListener("touchmove", function(e) {
    e.preventDefault();
    thiz.handle_touchmove(e);
  }, false);

  dom.addEventListener("touchend", function(e) {
    e.preventDefault();
    thiz.handle_touchend(e);
  }, false);

  dom.addEventListener("touchcancel", function(e) {
    e.preventDefault();
    thiz.handle_touchend(e);
  }, false);

  dom.addEventListener("touchleave", function(e) {
    e.preventDefault();
    thiz.handle_touchend(e);
  }, false);
};

Input.prototype.loadMouse = function(e) {
  this.getMousePos(e);
  this.msg = `${e.type} {x: ${this.curPos.x}, y: ${this.curPos.y}}`;
};

Input.prototype.loadTouch = function(e) {
  this.getTouchPos(e);
  this.getTouchSize(e);
  this.msg = `${e.type} {x: ${this.curPos.x}, y: ${this.curPos.y}, l:${this.curSize}}`;
};


Input.prototype.getMousePos = function(e) {
  this.curPos = {
    x: e.clientX,
    y: e.clientY
  };
};

Input.prototype.getTouchPos = function(e) {
  let x = 0;
  let y = 0;
  let n = e.touches.length;
  for (let i = 0; i < n; i++) {
    x += e.touches[i].clientX / n;
    y += e.touches[i].clientY / n;
  }
  this.curPos = {
    x: x,
    y: y
  };
};

Input.prototype.savePos = function() {
  this.prevPos = this.curPos;
};

Input.prototype.resetPos = function() {
  this.prevPos = null;
};


Input.prototype.getTouchSize = function(e) {
  let lMax = 0;
  let n = e.touches.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let l = Math.pow(e.touches[i].clientX - e.touches[j].clientX, 2);
      l += Math.pow(e.touches[i].clientY - e.touches[j].clientY, 2);
      lMax = Math.max(lMax, l);
    }
  }
  this.curSize = Math.pow(lMax, 0.5);
};


Input.prototype.saveTouchSize = function() {
  this.prevSize = this.curSize;
};

Input.prototype.resetTouchSize = function() {
  this.prevSize = null;
};