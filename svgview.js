var SVGNS = "http://www.w3.org/2000/svg";

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

colorGeneratorRGBA = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}
colorGeneratorHSLA = function(h = 0, s = 0, l = 0, alpha = 1) {
  // return `hsl(${Math.floor(h)}, ${Math.floor(s)}, ${Math.floor(l)}, ${alpha})`;
  return `hsl(${h}, ${s}%, ${l}%, ${alpha})`;
}

wait = function(timeMS) {
  var d = new Date();
  var d2 = null;
  while (new Date() - d < timeMS) {

  }
}

class Universe {
  constructor() {
    this.container = document.getElementById("container");
    this.lb = document.getElementById("aleft");
    this.rb = document.getElementById("aright");
    this.ub = document.getElementById("aup");
    this.db = document.getElementById("adown");
    this.legend = document.getElementById("legend");

    this.dom = document.createElementNS(SVGNS, "svg");

    this.radius = 200;
    this.container.appendChild(this.dom);

    this.viewBox = new ViewBox(this.dom, this.radius);

    this.nodes = [];
    this.edges = [];
    this.faces = [];

    this.refinement = 1;
    this.polyID = 0;

    this.init();
    this.addEvents();
  }

  init() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }

    this.nodesDom = document.createElementNS(SVGNS, 'g');
    this.facesDom = document.createElementNS(SVGNS, 'g');
    this.edgesDom = document.createElementNS(SVGNS, 'g');

    this.dom.appendChild(this.facesDom);
    this.dom.appendChild(this.edgesDom);
    this.dom.appendChild(this.nodesDom);

    this.nodes = [];
    this.edges = [];
    this.faces = [];

    var legend = "";

    while (this.polyID < 0) {
      this.polyID += POLY_NAMES.length;
    }
    this.polyID = this.polyID % POLY_NAMES.length;

    let drawPolyedre = POLY_FUNCTIONS[this.polyID];

    drawPolyedre(this);
    this.updateFaces();
    legend = POLY_NAMES[this.polyID];

    if (this.refinement > 1) {
      this.refine(this.refinement);
    } else {
      this.refinement = 1;
    }
    legend += " - ordre " + this.refinement;

    this.legend.innerText = legend;
  }

  addNode(x_ = 0, y_ = 0, z_ = 0) {
    let newNode = new Node(x_, y_, z_, this.nodes.length);
    this.nodes.push(newNode);
    this.nodesDom.appendChild(newNode.dom);
    newNode.show();
  }

  addEdge(id1, id2, offset = 0) {
    let newEdge = new Edge(this.nodes[id1 + offset], this.nodes[id2 + offset]);
    this.edges.push(newEdge);
    this.edgesDom.appendChild(newEdge.dom);
    newEdge.show();
  }

  addTriangle(id1, id2, id3, offset = 0) {
    let newTriangle = new Triangle(this.nodes[id1 + offset], this.nodes[id2 + offset], this.nodes[id3 + offset]);
    this.faces.push(newTriangle);
  }

  addQuadrangle(id1, id2, id3, id4, offset = 0) {
    let newQuadrangle = new Quadrangle(
      this.nodes[id1 + offset],
      this.nodes[id2 + offset],
      this.nodes[id3 + offset],
      this.nodes[id4 + offset]
    );
    this.faces.push(newQuadrangle);
  }

  addQuintangle(id1, id2, id3, id4, id5, offset = 0) {
    let newQuintangle = new Quintangle(
      this.nodes[id1 + offset],
      this.nodes[id2 + offset],
      this.nodes[id3 + offset],
      this.nodes[id4 + offset],
      this.nodes[id5 + offset]
    );
    this.faces.push(newQuintangle);
  }

  refine(n) {
    let newNodes = [];
    let newFaces = [];
    for (let face of this.faces) {
      // let face = this.faces.last();
      let res = face.refine(n);
      newNodes = newNodes.concat(res[0]);
      newFaces = newFaces.concat(res[1]);
    }

    for (let newNode of newNodes) {
      newNode.position.forceNorm(this.radius);
      this.nodes.push(newNode);
      this.nodesDom.appendChild(newNode.dom);
      newNode.show();
    }

    this.faces = [];
    for (let newFace of newFaces) {
      this.faces.push(newFace);
      this.facesDom.appendChild(newFace.dom);
      newFace.show();
    }
    this.updateFaces();

  }


  updateFaces() {
    this.faces.sort(EVAL_DISTANCE);
    while (this.facesDom.firstChild != null) {
      this.facesDom.removeChild(this.facesDom.firstChild);
    }
    for (let face of this.faces) {
      this.facesDom.appendChild(face.dom);
      face.show();
    }

  }

  update() {
    for (let node of this.nodes) {
      node.show();
    }
    for (let edge of this.edges) {
      edge.show();
    }
    this.updateFaces();

  }

  addEvents() {
    let thiz = this;
    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ARROWLEFT":
          thiz.polyID -= 1;
          thiz.init();
          break;
        case "ARROWRIGHT":
          thiz.polyID += 1;
          thiz.init();
          break;
        case "ARROWUP":
          thiz.refinement += 1;
          thiz.init();
          break;
        case "ARROWDOWN":
          thiz.refinement -= 1;
          thiz.init();
          break;
        case "PAGEUP":
          ALPHA = Math.min(1, ALPHA + 0.05);
          thiz.update();
          break;
        case "PAGEDOWN":
          ALPHA = Math.max(0, ALPHA - 0.05);
          thiz.update();
          break;
        default:
          // console.log(e);
          break;
      }
    }

    // MOUSE events
    this.container.addEventListener("mousedown", function(e) {
      e.preventDefault();
      if (e.ctrlKey) {
        // thiz.addNode(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      } else {
        // thiz.addPoint(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      }
    }, false);

    document.addEventListener("mousemove", function(e) {
      // e.preventDefault();
      // console.log(e);
      if (e.buttons > 0) {
        // console.log(e);
        if (e.ctrlKey) {
          RAYTRACING_CHANGE_PHI(-e.movementX / 10);
          RAYTRACING_CHANGE_LAMBDA(e.movementY / 10);
        } else if (e.shiftKey) {
          PROJ_CHANGE_D(e.movementX + e.movementY);
        } else {
          PROJ_CHANGE_PHI(-e.movementX / 10);
          PROJ_CHANGE_LAMBDA(e.movementY / 10);
        }
        thiz.update();

        // thiz.addNode(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      } else {
        // thiz.addPoint(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      }
    }, false);

    document.addEventListener("mouseup", function(e) {
      e.preventDefault();
    }, false);

    document.addEventListener("wheel", function(e) {
      e.preventDefault();
      let k = 1.1;
      if (e.deltaY > 0) {
        k = 1 / k;
      }
      thiz.viewBox.scale(e.clientX, e.clientY, k);
    }, false);

    // BUTTONs Events
    this.lb.onclick = function() {
      thiz.polyID -= 1;
      thiz.init();
    };

    this.rb.onclick = function() {
      thiz.polyID += 1;
      thiz.init();
    };

    this.db.onclick = function() {
      thiz.refinement -= 1;
      thiz.init();
    };

    this.ub.onclick = function() {
      thiz.refinement += 1;
      thiz.init();
    };

    // TOUCH events
    this.prevX = null;
    this.prevY = null;

    this.container.addEventListener("touchstart", function(e) {
      e.preventDefault();
    }, false);

    this.container.addEventListener("touchmove", function(e) {
      e.preventDefault();
      if (thiz.prevX != null) {
        PROJ_CHANGE_PHI(-(e.changedTouches[0].clientX - thiz.prevX) / 10);
        PROJ_CHANGE_LAMBDA((e.changedTouches[0].clientY - thiz.prevY) / 10);
        thiz.update();
      }
      thiz.prevX = e.changedTouches[0].clientX;
      thiz.prevY = e.changedTouches[0].clientY;

    }, false);

    this.container.addEventListener("touchend", function(e) {
      e.preventDefault();
      thiz.prevX = null;
      thiz.prevY = null;
    }, false);

    this.container.addEventListener("touchcancel", function(e) {
      e.preventDefault();
    }, false);

    this.container.addEventListener("touchleave", function(e) {
      e.preventDefault();
    }, false);

    // OTHER events
    window.onresize = function(e) {
      thiz.viewBox.resize();
    }

    // window.onerror = function(msg, source, noligne, nocolonne, erreur) {
    //   let str = "";
    //   str += msg;
    //   str += " * ";
    //   str += source;
    //   str += " * ";
    //   str += noligne;
    //   str += " * ";
    //   str += nocolonne;
    //   str += " * ";
    //   // str += erreur;
    //   thiz.console(str);
    // }
  }

}

class ViewBox {
  constructor(parent_, radius_) {
    this.parent = parent_;
    this.radius = radius_;
    let fact = 2 * 1.5 * this.radius / Math.min(window.innerWidth, window.innerHeight);
    this.width = window.innerWidth * fact;
    this.height = window.innerHeight * fact;
    this.xMin = -this.width / 2;
    this.yMin = -this.height / 2;
    this.set();
  }

  repr() {
    return this.xMin + " " + this.yMin + " " + this.width + " " + this.height;
  }

  set() {
    this.parent.setAttributeNS(null, 'viewBox', this.repr());
  }

  realX(x) {
    // Returns the "real" X in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (x - domRect.left) / domRect.width * this.width + this.xMin;
  }

  realY(y) {
    // Returns the "real" Y in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (y - domRect.top) / domRect.height * this.height + this.yMin;
  }

  // Events
  resize() {
    this.height = this.width * window.innerHeight / window.innerWidth;
    this.set();
  }

  scale(x, y, fact = 1) {
    let coorX = this.realX(x);
    let coorY = this.realY(y);

    this.xMin = coorX - (coorX - this.xMin) / fact;
    this.yMin = coorY - (coorY - this.yMin) / fact;
    this.width /= fact;
    this.height /= fact;
    this.set();
  }

  translate(dx, dy) {
    let domRect = this.parent.getBoundingClientRect();
    this.xMin += dx / domRect.width * this.width;
    this.yMin += dy / domRect.height * this.height;
    this.set();
  }


}