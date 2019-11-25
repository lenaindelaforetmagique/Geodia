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
  constructor(order_ = 0, refinement_ = 1) {
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

    // console.log(this.camera);

    this.nodes = [];
    this.faces = [];

    this.order = order_;
    this.refinement = refinement_;

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

    // -- Sol de base --
    let nbre = 2;
    let dx = this.width / (nbre - 1);
    let dy = this.height / (nbre - 1);
    for (let i = 0; i < nbre; i++) {
      for (let j = 0; j < nbre; j++) {
        let x = i * dx - this.width / 2;
        let y = j * dy - this.height / 2;
        let z = this.landscape.altitude(x, y, this.order);
        this.addNode(x, y, 0);
      }
    }

    for (let i = 0; i < nbre - 1; i++) {
      for (let j = 0; j < nbre - 1; j++) {
        this.addTriangle(i * nbre + j, (i + 1) * nbre + j, (i + 1) * nbre + j + 1, 0);
        this.addTriangle(i * nbre + j, (i + 1) * nbre + j + 1, i * nbre + j + 1, 0);
      }
    }
    // -- fin sol de base --

    // -- début raffinement --
    if (this.refinement > 1) {
      // this.refine(this.refinement);
    } else {
      this.refinement = 1;
    }
    legend += " - ordre " + this.refinement;

    let oldLength = this.faces.length;
    let newLength = 0;
    // console.log("débutWHile");
    // while (oldLength != newLength) {
    //   console.log(oldLength, newLength);
    //   oldLength = newLength;
    //   this.refine();
    //   newLength = this.faces.length;
    // }
    // console.log("finWHile");
    // -- fin raffinement --


    // -- calcul des Z --
    this.legend.innerText = legend;
    for (let node of this.nodes) {
      let newZ = this.landscape.altitude(node.position.x, node.position.y, this.order);
      node.position.z = newZ;
    }

    for (let face of this.faces) {
      face.color = this.landscape.colorFunction(face.center());;
    }
    // -- fin calcul des Z --

    this.updateFaces();
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


  refine() {
    let newNodes = [];
    let newFaces = [];
    for (let face of this.faces) {
      // console.log(face.radius(), distance(face.center(), this.camera.position));
      if (face.radius() / distance(face.center(), this.camera.position) > 1 / 1) {
        // console.log("oui");
        let res = face.refine(2);
        newNodes = newNodes.concat(res[0]);
        newFaces = newFaces.concat(res[1]);
      } else {
        // console.log("non");
        newNodes = newNodes.concat(face.nodes);
        newFaces = newFaces.concat([face]);
      }
    }

    // console.log(newFaces.length);

    this.nodes = [];
    for (let newNode of newNodes) {
      // newNode.position.forceNorm(this.radius);
      this.nodes.push(newNode);
      // this.nodesDom.appendChild(newNode.dom);
      newNode.show();
    }


    this.faces = [];
    for (let newFace of newFaces) {
      this.faces.push(newFace);
      this.facesDom.appendChild(newFace.dom);
      newFace.show();
    }
    // this.updateFaces();
  }


  update() {
    if (this.recal) {
      this.init();
      let newZ = this.landscape.altitude(this.camera.position.x, this.camera.position.y, this.order);
      this.camera.position.z = newZ + 25;
      this.recal = false;
    }

    // this.camera.position
    // this.camera.update();
    //
    // for (let node of this.nodes) {
    //   node.show();
    // }
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
        face.color = this.landscape.colorFunction(face.center());;
        this.facesDom.appendChild(face.dom);
        face.show();
      }
    }

  }

  moveLong(intensity = 1) {
    this.camera.moveZ(intensity);
    this.recal = true;
  }

  moveLat(intensity = 1) {
    this.camera.moveX(intensity);
    this.recal = true;
  }

  addEvents() {
    let thiz = this;
    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ARROWLEFT":
          thiz.order -= 1;
          thiz.init();
          break;
        case "ARROWRIGHT":
          thiz.order += 1;
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
      if (e.ctrlKey) {
        // thiz.addNode(this,thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      } else {
        // thiz.addPoint(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      }
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

        // thiz.camera.rotate_ux(e.movementY / 2);
        // thiz.camera.rotate_Z(e.movementX / 2);


        // thiz.camera.change_lambda(e.movementY / 10);
        // thiz.addPoint(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      }
    }, false);


    // document.addEventListener("mouseover", function(e) {
    //
    //   thiz.camera.rotate_ux(thiz.viewBox.realY(e.clientY));
    //   thiz.camera.rotate_Z(thiz.viewBox.realX(e.clientX));
    //   // thiz.camera.rotate_ux(e.movementY / 10);
    //   // thiz.camera.rotate_Z(e.movementX / 10);
    //   e.preventDefault();
    // }, false);


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
      thiz.order -= 1;
      thiz.init();
    };

    this.rb.onclick = function() {
      thiz.order += 1;
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

    this.prevPos = null;

    this.getTouchPos = function(e) {
      let thisX = 0;
      let thisY = 0;
      let thisSize = 0;

      for (let touch of e.touches) {
        thisX += touch.clientX;
        thisY += touch.clientY;

        for (let other of e.touches) {
          let l = Math.pow(touch.clientX - other.clientX, 2);
          l += Math.pow(touch.clientY - other.clientY, 2);
          thisSize = Math.max(thisSize, l);
        }
      }

      thisX /= e.touches.length;
      thisY /= e.touches.length;

      thisSize = Math.pow(thisSize, 0.5);

      return {
        x: thisX,
        y: thisY,
        size: thisSize
      };
    }

    this.container.addEventListener("touchstart", function(e) {
      e.preventDefault();
      this.prevPos = thiz.getTouchPos(e);
    }, false);

    this.container.addEventListener("touchmove", function(e) {
      e.preventDefault();
      let curPos = thiz.getTouchPos(e);

      if (thiz.prevPos != null) {
        if (e.touches.length > 1) {
          if (thiz.prevPos.size > 0) {
            // thiz.camera.CHANGE_EXPLODE(-(curPos.x - thiz.prevPos.x + curPos.y - thiz.prevPos.y));
          }
        } else {
          thiz.camera.CHANGE_PHI(-(curPos.x - thiz.prevPos.x) / 10);
          thiz.camera.CHANGE_LAMBDA((curPos.y - thiz.prevPos.y) / 10);
        }

        thiz.update();
      }
      thiz.prevPos = curPos;
    }, false);

    this.container.addEventListener("touchend", function(e) {
      e.preventDefault();
      thiz.prevPos = null;
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