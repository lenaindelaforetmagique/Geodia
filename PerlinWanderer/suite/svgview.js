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
  constructor(order_ = 1) {
    this.container = document.getElementById("container");
    this.lb = document.getElementById("aleft");
    this.rb = document.getElementById("aright");
    this.ub = document.getElementById("aup");
    this.db = document.getElementById("adown");
    this.legend = document.getElementById("legend");

    this.dom = document.createElementNS(SVGNS, "svg");

    this.radius = 0.75;

    this.container.appendChild(this.dom);

    this.viewBox = new ViewBox(this.dom, this.radius);
    this.camera = new Camera(this);
    this.raytracing = new Raytracing(this);

    this.width = 800;
    this.height = 800;
    this.landscape = new Landscape(this.width, this.height, 5);
    this.remesh = true;
    // console.log(this.camera);

    this.nodes = [];
    this.faces = [];

    this.order = order_;
    this.refinement = 0.15;

    let header = document.getElementById("header");
    let footer = document.getElementById("footer");
    // console.log(this.viewBox.fact);
    this.viewBox.translate(-window.innerWidth / 2, -(footer.offsetTop + header.offsetTop + header.offsetHeight) / 2);

    this.lastUpdate = Date.now();
    this.init();
    this.addEvents();
  }

  domInit() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }

    this.nodesDom = document.createElementNS(SVGNS, 'g');
    this.facesDom = document.createElementNS(SVGNS, 'g');

    this.dom.appendChild(this.facesDom);
    this.dom.appendChild(this.nodesDom);
  }

  init() {
    this.domInit();

    this.nodes = [];
    this.faces = [];

    var legend = "";

    while (this.order < 0) {
      this.order += POLY_NAMES.length;
    }
    this.order = this.order % POLY_NAMES.length;

    legend += " - ordre " + this.refinement;
    this.legend.innerText = legend;



  }


  mesh() {
    this.domInit();
    this.nodes = [];
    this.faces = [];


    // -- Sol de base --
    let nbre = 2;
    let dx = this.width / (nbre - 1);
    let dy = this.height / (nbre - 1);
    for (let i = 0; i < nbre; i++) {
      for (let j = 0; j < nbre; j++) {
        let x = i * dx - this.width / 2;
        let y = j * dy - this.height / 2;
        this.addNode(x, y, 0);
      }
    }

    for (let i = 0; i < nbre - 1; i++) {
      for (let j = 0; j < nbre - 1; j++) {
        this.addTriangle(i * nbre + j, (i + 1) * nbre + j, (i + 1) * nbre + j + 1, 0);
        this.addTriangle(i * nbre + j, (i + 1) * nbre + j + 1, i * nbre + j + 1, 0);
      }
    }

    // -- meshing
    let tmpFaces = this.faces;
    let newNodes = [];
    let newFaces = [];
    let oldLength = this.faces.length;
    let newLength = oldLength + 1;

    while (tmpFaces.length > 0) {
      let angle = tmpFaces[0].apparentAngle();
      if (angle > this.refinement) {
        let res = tmpFaces[0].refine(2);
        tmpFaces = tmpFaces.concat(res[1]);
        if (angle < this.refinement * 1.5) {
          tmpFaces[0].alpha = 0.9;
          newFaces.push(tmpFaces[0]);
        }
      } else {
        newFaces.push(tmpFaces[0]);
      }
      tmpFaces.splice(0, 1);
    }
    this.faces = newFaces;

    this.nodes = [];
    for (let face of this.faces) {
      for (let node of face.nodes) {
        if (!this.nodes.includes(node)) {
          this.nodes.push(node);
        }
      }
    }

    // recal Z + color
    for (let node of this.nodes) {
      node.position.z = this.landscape.altitude(node.position.x, node.position.y, this.order);
    }

    for (let face of this.faces) {
      // let z = face.center();
      // z = z.z;
      face.color = this.landscape.colorFunction(face.center());
    }
  }


  refresh() {
    let now = Date.now();
    if (now - this.lastUpdate > 20) {
      this.lastUpdate = now;
      this.update();
      // console.log("hop");
      // this.show();
    }
  }

  addNode(x_ = 0, y_ = 0, z_ = 0) {
    let thiz = this;
    let newNode = new Node(thiz, x_, y_, z_, this.nodes.length);
    this.nodes.push(newNode);
    this.nodesDom.appendChild(newNode.dom);
    newNode.show();
  }

  addNode_COG(nodeList, offset) {
    let thiz = this;
    let newNode = new Node(thiz, 0, 0, 0, this.nodes.length);
    // let nodePos = new Vector3D(0,0,0);
    for (let i of nodeList) {
      newNode.position.add(this.nodes[i + offset].position);
    }
    newNode.position.div(nodeList.length);

    this.nodes.push(newNode);
    this.nodesDom.appendChild(newNode.dom);
    newNode.show();
  }

  addTriangle(id1, id2, id3, offset = 0) {
    let thiz = this;
    let newTriangle = new Triangle(thiz, this.nodes[id1 + offset], this.nodes[id2 + offset], this.nodes[id3 + offset]);
    this.faces.push(newTriangle);
  }

  addQuadrangle(id1, id2, id3, id4, offset = 0) {
    let thiz = this;
    let newQuadrangle = new Quadrangle(thiz,
      this.nodes[id1 + offset],
      this.nodes[id2 + offset],
      this.nodes[id3 + offset],
      this.nodes[id4 + offset]
    );
    this.faces.push(newQuadrangle);
  }

  addQuintangle(id1, id2, id3, id4, id5, offset = 0) {
    let thiz = this;
    let newQuintangle = new Quintangle(thiz,
      this.nodes[id1 + offset],
      this.nodes[id2 + offset],
      this.nodes[id3 + offset],
      this.nodes[id4 + offset],
      this.nodes[id5 + offset]
    );
    this.faces.push(newQuintangle);
  }


  update() {
    if (this.remesh) {
      let newZ = this.landscape.altitude(this.camera.position.x, this.camera.position.y, this.order);
      this.camera.position.z = newZ + 10;
      this.mesh();
      this.remesh = false;
    }
    this.updateFaces();
  }



  updateFaces() {

    let EVAL_DISTANCE = function(polygon1, polygon2) {
      return polygon1.isBefore(polygon2);
    }
    this.faces.sort(EVAL_DISTANCE);

    while (this.facesDom.firstChild != null) {
      this.facesDom.removeChild(this.facesDom.firstChild);
    }

    for (let face of this.faces) {
      if (this.camera.isVisible(face)) {
        this.facesDom.appendChild(face.dom);
        face.show();
      }
    }

  }

  moveLong(intensity = 1) {
    this.camera.moveZ(intensity);
    this.remesh = true;
  }

  moveLat(intensity = 1) {
    this.camera.moveX(intensity);
    this.remesh = true;
  }

  changeOrder(intensity = 1) {
    this.order += intensity;
    this.remesh = true;
  }

  changeRefinement(intensity = 1) {
    this.refinement *= Math.pow(2, intensity);;
  }

  addEvents() {
    let thiz = this;
    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ARROWLEFT":
          thiz.changeOrder(-1);
          break;
        case "ARROWRIGHT":
          thiz.changeOrder(1);
          break;
        case "ARROWUP":
          thiz.changeRefinement(1);
          break;
        case "ARROWDOWN":
          thiz.changeRefinement(-1);
          break;
        case "PAGEUP":
          ALPHA = Math.min(1, ALPHA + 0.05);
          thiz.update();
          break;
        case "PAGEDOWN":
          ALPHA = Math.max(0, ALPHA - 0.05);
          thiz.update();
          break;
        case "S":
          // thiz.camera.rotate_uz(-1);
          thiz.moveLat(-1);
          break;
        case "F":
          // thiz.camera.rotate_uz(+1);
          thiz.moveLat(1);
          break;
        case "D":
          // thiz.camera.rotate_ux(-1);
          thiz.moveLong(1);
          break;
        case "E":
          // thiz.camera.rotate_ux(+1);
          thiz.moveLong(-1);
          break;
        default:
          // console.log(e);
          break;
      }
    }

    // MOUSE events
    this.container.addEventListener("mousedown", function(e) {
      e.preventDefault();
    }, false);

    document.addEventListener("mousemove", function(e) {
      // e.preventDefault();
      // console.log(e);
      if (e.buttons > 0) {
        // console.log(e);
        if (e.altKey) {
          thiz.raytracing.change_phi(-e.movementX / 10);
          thiz.raytracing.change_lambda(e.movementY / 10);
        } else if (e.shiftKey) {
          thiz.camera.change_d(e.movementX + e.movementY);
        } else {
          // thiz.camera.change_phi(-e.movementX / 10);
          // thiz.camera.change_lambda(e.movementY / 10);

        }
        // thiz.update();

        // thiz.addNode(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      } else {
        thiz.camera.set_lat(e.clientY / window.innerHeight);
        thiz.camera.set_long(e.clientX / window.innerWidth);

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
      thiz.changeOrder(-1);
    };

    this.rb.onclick = function() {
      thiz.changeOrder(1);
    };

    this.db.onclick = function() {
      thiz.changeRefinement(-1);
    };

    this.ub.onclick = function() {
      thiz.changeRefinement(1);
    };


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
    //   // thiz.console(str);
    //   thiz.legend.innerText += "\n" + str;
    //   print(str);
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
    this.xMin = 0; //-this.width / 2;
    this.yMin = 0; //-this.height / 2;
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
print("svgview.js ok");