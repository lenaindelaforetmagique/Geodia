var SVGNS = "http://www.w3.org/2000/svg";

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}

class Universe {
  constructor() {
    this.container = document.getElementById("container");
    this.dom = document.createElementNS(SVGNS, "svg");

    this.nodesDom = document.createElementNS(SVGNS, 'g');
    this.facesDom = document.createElementNS(SVGNS, 'g');
    this.edgesDom = document.createElementNS(SVGNS, 'g');


    this.radius = 200;

    this.dom.appendChild(this.facesDom);
    this.dom.appendChild(this.edgesDom);
    this.dom.appendChild(this.nodesDom);

    this.container.appendChild(this.dom);

    this.viewBox = new ViewBox(this.dom, this.radius);

    this.nodes = [];
    this.edges = [];
    this.faces = [];

    this.addEvents();
    this.icosaedre();
  }

  init() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }
    this.pointsDom = document.createElementNS(SVGNS, 'g');
    this.dom.appendChild(this.pointsDom);

    this.nodes = [];
    this.edges = [];
    this.faces = [];
  }

  addNode(x_ = 0, y_ = 0, z_ = 0) {
    let newNode = new Node(x_, y_, z_, this.nodes.length);
    this.nodes.push(newNode);
    this.nodesDom.appendChild(newNode.dom);
    newNode.show();
  }

  addEdge(id1, id2) {
    let newEdge = new Edge(this.nodes[id1], this.nodes[id2]);
    this.edges.push(newEdge);
    this.edgesDom.appendChild(newEdge.dom);
    newEdge.show();
  }

  addFace(id1, id2, id3) {
    let newFace = new Face(this.nodes[id1], this.nodes[id2], this.nodes[id3]);
    this.faces.push(newFace);
  }

  icosaedre() {
    let phi = (1 + Math.sqrt(5)) / 2;
    let one = 1;
    let fact = this.radius / Math.sqrt(1 + phi ** 2);
    phi *= fact;
    one *= fact;
    // Nodes (12)
    this.addNode(phi, one, 0);
    this.addNode(phi, -one, 0);
    this.addNode(-phi, one, 0);
    this.addNode(-phi, -one, 0);
    this.addNode(one, 0, phi);
    this.addNode(-one, 0, phi);
    this.addNode(one, 0, -phi);
    this.addNode(-one, 0, -phi);
    this.addNode(0, phi, one);
    this.addNode(0, phi, -one);
    this.addNode(0, -phi, one);
    this.addNode(0, -phi, -one);

    // Edges (30)
    // this.addEdge(0, 1);
    // this.addEdge(0, 4);
    // this.addEdge(0, 8);
    // this.addEdge(0, 9);
    // this.addEdge(0, 6);
    // this.addEdge(1, 4);
    // this.addEdge(1, 6);
    // this.addEdge(1, 10);
    // this.addEdge(1, 11);
    // this.addEdge(2, 3);
    // this.addEdge(2, 5);
    // this.addEdge(2, 7);
    // this.addEdge(2, 8);
    // this.addEdge(2, 9);
    // this.addEdge(3, 5);
    // this.addEdge(3, 7);
    // this.addEdge(3, 10);
    // this.addEdge(3, 11);
    // this.addEdge(4, 8);
    // this.addEdge(4, 10);
    // this.addEdge(4, 5);
    // this.addEdge(5, 8);
    // this.addEdge(5, 10);
    // this.addEdge(6, 7);
    // this.addEdge(6, 9);
    // this.addEdge(6, 11);
    // this.addEdge(7, 9);
    // this.addEdge(7, 11);
    // this.addEdge(8, 9);
    // this.addEdge(10, 11);

    // Faces (20)
    this.addFace(0, 1, 4);
    this.addFace(0, 4, 8);
    this.addFace(0, 8, 9);
    this.addFace(0, 9, 6);
    this.addFace(0, 6, 1);
    this.addFace(1, 6, 11);
    this.addFace(1, 11, 10);
    this.addFace(1, 10, 4);
    this.addFace(2, 3, 7);
    this.addFace(2, 7, 9);
    this.addFace(2, 9, 8);
    this.addFace(2, 8, 5);
    this.addFace(2, 5, 3);
    this.addFace(3, 5, 10);
    this.addFace(3, 10, 11);
    this.addFace(3, 11, 7);
    this.addFace(4, 10, 5);
    this.addFace(4, 5, 8);
    this.addFace(6, 9, 7);
    this.addFace(6, 7, 11);
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
          PROJ_CHANGE_PHI(1);
          thiz.update();
          break;
        case "ARROWRIGHT":
          PROJ_CHANGE_PHI(-1);
          thiz.update();
          break;
        case "ARROWUP":
          PROJ_CHANGE_LAMBDA(1);
          thiz.update();
          break;
        case "ARROWDOWN":
          PROJ_CHANGE_LAMBDA(-1);
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
        // console.log(e.buttons);
        PROJ_CHANGE_PHI(-e.movementX / 10);
        PROJ_CHANGE_LAMBDA(e.movementY / 10);
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