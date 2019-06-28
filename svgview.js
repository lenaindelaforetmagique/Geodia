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

    this.idPolyedre = 4;
    this.refinement = 10;

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

    while (this.idPolyedre < 0) {
      this.idPolyedre += 5;
    }
    // console.log(this.idPolyedre);
    switch (this.idPolyedre % 5) {
      case 0:
        this.tetraedre();
        legend = "Tétraèdre";
        break;
      case 1:
        this.hexaedre();
        legend = "Hexaèdre";
        break;
      case 2:
        this.octaedre();
        legend = "Octaèdre";
        break;
      case 3:
        this.dodecaedre();
        legend = "Dodecaèdre";
        break;
      case 4:
        this.icosaedre();
        legend = "Icosaèdre";
        break;

      default:
        // console.log(e);
        break;
    }

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

  tetraedre() {
    let fact = this.radius / 3;
    // Nodes (12)
    let offset = this.nodes.length;
    this.addNode(Math.sqrt(6) * fact, -Math.sqrt(2) * fact, -1 * fact);
    this.addNode(-Math.sqrt(6) * fact, -Math.sqrt(2) * fact, -1 * fact);
    this.addNode(0, 2 * Math.sqrt(2) * fact, -1 * fact);
    this.addNode(0, 0, 3 * fact);

    // Edges (30)

    // Triangles (20)
    this.addTriangle(0, 1, 2, offset);
    this.addTriangle(0, 2, 3, offset);
    this.addTriangle(0, 3, 1, offset);
    this.addTriangle(1, 3, 2, offset);
    this.updateFaces();
  }

  hexaedre() {
    let one = this.radius / Math.sqrt(3);
    // Nodes (12)
    let offset = this.nodes.length;
    this.addNode(-one, -one, -one);
    this.addNode(-one, one, -one);
    this.addNode(one, -one, -one);
    this.addNode(one, one, -one);
    this.addNode(-one, -one, one);
    this.addNode(-one, one, one);
    this.addNode(one, -one, one);
    this.addNode(one, one, one);


    // Edges (30)

    // Triangles (20)
    this.addQuadrangle(0, 1, 3, 2, offset);
    this.addQuadrangle(0, 4, 5, 1, offset);
    this.addQuadrangle(0, 2, 6, 4, offset);
    this.addQuadrangle(1, 5, 7, 3, offset);
    this.addQuadrangle(2, 3, 7, 6, offset);
    this.addQuadrangle(4, 6, 7, 5, offset);
    this.updateFaces();
  }

  octaedre() {
    let fact = this.radius;
    let offset = this.nodes.length;
    // Nodes (12)
    this.addNode(1 * fact, 0, 0);
    this.addNode(-1 * fact, 0, 0);
    this.addNode(0, 1 * fact, 0);
    this.addNode(0, -1 * fact, 0);
    this.addNode(0, 0, 1 * fact);
    this.addNode(0, 0, -1 * fact);

    // Edges (30)

    // Faces (8)
    this.addTriangle(0, 2, 5, offset);
    this.addTriangle(0, 5, 3, offset);
    this.addTriangle(0, 3, 4, offset);
    this.addTriangle(0, 4, 2, offset);
    this.addTriangle(1, 2, 4, offset);
    this.addTriangle(1, 4, 3, offset);
    this.addTriangle(1, 3, 5, offset);
    this.addTriangle(1, 5, 2, offset);
    this.updateFaces();
  }

  dodecaedre() {
    let fact = this.radius / Math.sqrt(3);
    let offset = this.nodes.length;

    let one = fact * 1;
    let phi = fact * (1 + Math.sqrt(5)) / 2;
    let one_phi = fact * 1 / ((1 + Math.sqrt(5)) / 2);
    // Nodes (12)
    this.addNode(0, one_phi, phi);
    this.addNode(0, one_phi, -phi);
    this.addNode(0, -one_phi, phi);
    this.addNode(0, -one_phi, -phi);
    this.addNode(one_phi, phi, 0);
    this.addNode(one_phi, -phi, 0);
    this.addNode(-one_phi, phi, 0);
    this.addNode(-one_phi, -phi, 0);
    this.addNode(phi, 0, one_phi);
    this.addNode(phi, 0, -one_phi);
    this.addNode(-phi, 0, one_phi);
    this.addNode(-phi, 0, -one_phi);
    this.addNode(one, one, one);
    this.addNode(one, one, -one);
    this.addNode(one, -one, one);
    this.addNode(one, -one, -one);
    this.addNode(-one, one, one);
    this.addNode(-one, one, -one);
    this.addNode(-one, -one, one);
    this.addNode(-one, -one, -one);


    // Edges (30)

    // Faces (8)
    this.addQuintangle(0, 2, 14, 8, 12, offset);
    this.addQuintangle(0, 12, 4, 6, 16, offset);
    this.addQuintangle(0, 16, 10, 18, 2, offset);
    this.addQuintangle(1, 3, 15, 9, 13, offset);
    this.addQuintangle(1, 13, 4, 6, 17, offset);
    this.addQuintangle(1, 17, 11, 19, 3, offset);
    this.addQuintangle(2, 14, 5, 7, 18, offset);
    this.addQuintangle(3, 15, 5, 7, 19, offset);
    this.addQuintangle(4, 12, 8, 9, 13, offset);
    this.addQuintangle(5, 14, 8, 9, 15, offset);
    this.addQuintangle(6, 16, 10, 11, 17, offset);
    this.addQuintangle(7, 18, 10, 11, 19, offset);


    this.updateFaces();
  }


  icosaedre() {
    let offset = this.nodes.length;
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
    // this.addEdge(0, 1, offset);
    // this.addEdge(0, 4, offset);
    // this.addEdge(0, 8, offset);
    // this.addEdge(0, 9, offset);
    // this.addEdge(0, 6, offset);
    // this.addEdge(1, 4, offset);
    // this.addEdge(1, 6, offset);
    // this.addEdge(1, 10, offset);
    // this.addEdge(1, 11, offset);
    // this.addEdge(2, 3, offset);
    // this.addEdge(2, 5, offset);
    // this.addEdge(2, 7, offset);
    // this.addEdge(2, 8, offset);
    // this.addEdge(2, 9, offset);
    // this.addEdge(3, 5, offset);
    // this.addEdge(3, 7, offset);
    // this.addEdge(3, 10, offset);
    // this.addEdge(3, 11, offset);
    // this.addEdge(4, 8, offset);
    // this.addEdge(4, 10, offset);
    // this.addEdge(4, 5, offset);
    // this.addEdge(5, 8, offset);
    // this.addEdge(5, 10, offset);
    // this.addEdge(6, 7, offset);
    // this.addEdge(6, 9, offset);
    // this.addEdge(6, 11, offset);
    // this.addEdge(7, 9, offset);
    // this.addEdge(7, 11, offset);
    // this.addEdge(8, 9, offset);
    // this.addEdge(10, 11, offset);

    // Faces (20)
    this.addTriangle(0, 1, 4, offset);
    this.addTriangle(0, 4, 8, offset);
    this.addTriangle(0, 8, 9, offset);
    this.addTriangle(0, 9, 6, offset);
    this.addTriangle(0, 6, 1, offset);
    this.addTriangle(1, 6, 11, offset);
    this.addTriangle(1, 11, 10, offset);
    this.addTriangle(1, 10, 4, offset);
    this.addTriangle(2, 3, 7, offset);
    this.addTriangle(2, 7, 9, offset);
    this.addTriangle(2, 9, 8, offset);
    this.addTriangle(2, 8, 5, offset);
    this.addTriangle(2, 5, 3, offset);
    this.addTriangle(3, 5, 10, offset);
    this.addTriangle(3, 10, 11, offset);
    this.addTriangle(3, 11, 7, offset);
    this.addTriangle(4, 10, 5, offset);
    this.addTriangle(4, 5, 8, offset);
    this.addTriangle(6, 9, 7, offset);
    this.addTriangle(6, 7, 11, offset);
    this.updateFaces();
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
          thiz.idPolyedre -= 1;
          thiz.init();
          break;
        case "ARROWRIGHT":
          thiz.idPolyedre += 1;
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
      thiz.idPolyedre -= 1;
      thiz.init();
    };

    this.rb.onclick = function() {
      thiz.idPolyedre += 1;
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