ALPHA = 1;

class Node {
  constructor(parent_, x_ = 0, y_ = 0, z_ = 0, id) {
    this.parent = parent_;
    // console.log(this.parent);
    this.position = new Vector3D(x_, y_, z_);

    this.size = 5;
    this.dom = document.createElementNS(SVGNS, 'g');

    this.domEl = document.createElementNS(SVGNS, 'ellipse');
    this.domEl.setAttribute("class", "node");
    this.domEl.setAttribute('ry', this.size / 2);
    this.domEl.setAttribute('rx', this.size / 2);
    // this.dom.appendChild(this.domEl);

    this.domTx = document.createElementNS(SVGNS, "text");
    // console.log(id);
    this.domTx.textContent = id;
    // this.dom.appendChild(this.domTx);
  }

  show() {
    var position = this.parent.camera.PROJ_FUNCTION(this.position);
    this.domEl.setAttribute('cx', position[0]);
    this.domEl.setAttribute('cy', position[1]);
    this.domTx.setAttributeNS(null, "x", position[0]);
    this.domTx.setAttributeNS(null, "y", position[1]);
  }
}

class Edge {
  constructor(parent_, n1, n2) {
    this.parent = parent_;
    this.node1 = n1;
    this.node2 = n2;

    this.dom = document.createElementNS(SVGNS, 'polyline');
    this.dom.setAttribute("class", "edge");
  }

  show() {
    var pos1 = this.parent.camera.PROJ_FUNCTION(this.node1.position);
    var pos2 = this.parent.camera.PROJ_FUNCTION(this.node2.position);
    let list = `${pos1[0]}, ${pos1[1]}, ${pos2[0]}, ${pos2[1]} `;

    this.dom.setAttributeNS(null, "points", list);

    // this.dom.setAttribute()
  }
}


class Polygon {
  constructor(parent_, nodesList_) {
    this.parent = parent_;
    this.nodes = nodesList_;
    this.color = 0;

    this.dom = document.createElementNS(SVGNS, 'polygon');
    // this.dom.setAttribute('fill', this.color);
  }

  show() {
    let list = "";
    for (let node of this.nodes) {
      let b = node.position.copy();
      // console.log("parent", this.parent);
      let pos = this.parent.camera.PROJ_FUNCTION(b);
      list += `${pos[0]}, ${pos[1]}, `;
    }
    let b = this.nodes[0].position.copy();
    let pos0 = this.parent.camera.PROJ_FUNCTION(b);
    // list += `${pos0[0]}, ${pos0[1]}`

    this.dom.setAttributeNS(null, "points", list);

    let alpha = -0.25;
    let beta = -0.85;
    let gamma = 0.75;
    let center = this.center();

    let color_SL = this.parent.raytracing.light(this.center(), this.normalVector());
    // this.dom.setAttribute('fill', colorGeneratorHSLA(0, 100 + color_SL[0] * 0 + 0, (color_SL[0] * 2 + color_SL[1]) * 40 / 3 + 60, ALPHA));
    // this.dom.setAttribute('fill', colorGeneratorHSLA(0, color_SL[0] * 0 + 0, (color_SL[0] * 2 + color_SL[1]) * 40 / 3 + 60, ALPHA));
    this.dom.setAttribute('fill', colorGeneratorHSLA(this.color, color_SL[0] * 100, color_SL[1] * 40 / 3 + 30, ALPHA));
    this.dom.setAttribute('stroke', colorGeneratorHSLA(this.color, color_SL[0] * 100, color_SL[1] * 40 / 3 + 30, ALPHA));
  }

  center() {
    let centerPos = new Vector3D(0, 0, 0);
    for (let node of this.nodes) {
      centerPos.add(node.position);
    }
    centerPos.div(this.nodes.length);
    return centerPos;
  }

  normalVector() {
    let res;
    let v1 = this.nodes[1].position.copy();
    v1.sub(this.nodes[0].position);
    // v1.normalize();
    let v2 = this.nodes[2].position.copy();
    v2.sub(this.nodes[0].position);
    // v2.normalize();
    res = v1.crossProduct(v2);
    res.normalize();
    // sign
    // let v3 = new Vector3D(0, 0, 0);
    // v3.sub(this.center());
    // if (res.dotProduct(v3) > 0) {
    // res.mult(-1);
    // }
    return res;

  }

  isBefore(other) {
    let res = this.parent.camera.PROJ_FUNCTION(this.center())[2];
    res -= this.parent.camera.PROJ_FUNCTION(other.center())[2];
    return res;
  }

}

class Triangle extends Polygon {
  constructor(parent_, n1, n2, n3) {
    super(parent_, [n1, n2, n3]);

    this.node1 = n1;
    this.node2 = n2;
    this.node3 = n3;
  }

  refine(n) {
    let ux = this.node2.position.copy()
    ux.sub(this.node1.position);
    ux.div(n);

    let uy = this.node3.position.copy()
    uy.sub(this.node1.position);
    uy.div(n);

    let newNodes = [];
    let newFaces = [];

    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n - i; j++) {
        let newNode = new Node(this.parent);
        let dx = ux.copy();
        dx.mult(i);
        let dy = uy.copy();
        dy.mult(j);
        newNode.position = this.node1.position.copy();
        newNode.position.add(dx);
        newNode.position.add(dy);
        newNodes.push(newNode);
      }
    }
    let id = 0
    for (let i = 0; i <= n - 1; i++) {
      for (let j = 0; j < n - i; j++) {
        let newFace = new Triangle(this.parent, newNodes[id], newNodes[id + n + 1 - i], newNodes[id + 1]);
        newFaces.push(newFace);
        id += 1;
      }
      id += 1;
    }
    id = 0;
    for (let i = 0; i <= n - 2; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let newFace = new Triangle(this.parent, newNodes[id + 1], newNodes[id + n + 1 - i], newNodes[id + n + 2 - i]);
        newFaces.push(newFace);
        id += 1;
      }
      id += 2;
    }

    return [newNodes, newFaces];
  }
}

class Quadrangle extends Polygon {
  constructor(parent_, n1, n2, n3, n4) {
    super(parent_, [n1, n2, n3, n4]);
    this.node1 = n1;
    this.node2 = n2;
    this.node3 = n3;
    this.node4 = n4;
  }

  refine(n) {
    let newNodes = [];
    let newFaces = [];
    let tmp;

    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        let newNode = new Node(this.parent, 0, 0, 0, i + "+" + j);
        tmp = this.node1.position.copy();
        tmp.mult(1 - i / n);
        tmp.mult(1 - j / n);
        newNode.position.add(tmp);

        tmp = this.node2.position.copy();
        tmp.mult(i / n);
        tmp.mult(1 - j / n);
        newNode.position.add(tmp);

        tmp = this.node3.position.copy();
        tmp.mult(i / n);
        tmp.mult(j / n);
        newNode.position.add(tmp);

        tmp = this.node4.position.copy();
        tmp.mult(1 - i / n);
        tmp.mult(j / n);
        newNode.position.add(tmp);

        newNodes.push(newNode);
      }
    }
    for (let i = 0; i <= n - 1; i++) {
      for (let j = 0; j <= n - 1; j++) {
        let newFace = new Quadrangle(this.parent,
          newNodes[i * (n + 1) + j],
          newNodes[(i + 1) * (n + 1) + j],
          newNodes[(i + 1) * (n + 1) + (j + 1)],
          newNodes[i * (n + 1) + j + 1]
        );
        newFaces.push(newFace);
      }
    }

    return [newNodes, newFaces];
  }
}

class Quintangle extends Polygon {
  constructor(parent_, n1, n2, n3, n4, n5) {
    super(parent_, [n1, n2, n3, n4, n5]);
  }

  refine(n) {
    let newNodes = [];
    let newFaces = [];
    let center = this.center();

    // NODES
    for (let i = 0; i < n; i++) {
      // niveaux
      for (let k = 0; k < 5; k++) {
        // cotés
        let vectUx = this.nodes[(k + 1) % 5].position.copy();
        vectUx.sub(this.nodes[k].position);
        vectUx.div(n);
        let vectUy = center.copy();
        vectUy.sub(this.nodes[k].position);
        vectUy.div(n);
        for (let j = 0; j < n - i; j++) {
          // ligne de noeuds
          // décalage dj
          let dj = 0;
          if (i % 3 == 1) {
            dj = 0.5;
          } else if (i % 3 == 2) {
            dj = 0.5;
          }
          // this.nodes[k].position + i * uy + j * ux
          let newNode = new Node(this.parent, 0, 0, 0, "5");
          let tmpX = vectUx.copy();
          tmpX.mult(j + dj);
          let tmpY = vectUy.copy();
          tmpY.mult(i);
          newNode.position = this.nodes[k].position.copy();
          newNode.position.add(tmpX);
          newNode.position.add(tmpY);

          newNodes.push(newNode);
        }
      }
    }
    if (n > 0 && n % 3 == 0) {
      let newNode = new Node(this.parent, 0, 0, 0);
      newNode.position = center.copy();
      newNodes.push(newNode);
    }

    // Quintangles
    let offset = 0;
    let newFace;
    while (n > 0) {
      // type 1 : sommets
      if (n != 1) {
        newFace = new Quintangle(this.parent,
          newNodes[5 * n - 1 + offset],
          newNodes[0 + offset],
          newNodes[1 + offset],
          newNodes[5 * n + offset],
          newNodes[5 * n + 5 * (n - 1) - 1 + offset]
        );
        newFaces.push(newFace);
        for (let k = 1; k < 5; k++) {
          newFace = new Quintangle(this.parent,
            newNodes[k * n - 1 + offset],
            newNodes[k * n + offset],
            newNodes[k * n + 1 + offset],
            newNodes[5 * n + k * (n - 1) + offset],
            newNodes[5 * n + k * (n - 1) - 1 + offset]
          );
          newFaces.push(newFace);
        }
      }

      // type 2 : bas
      for (let i = 0; i <= n - 3; i++) {
        for (let k = 0; k < 5; k++) {
          newFace = new Quintangle(this.parent,
            newNodes[k * n + i + 1 + offset],
            newNodes[k * n + i + 2 + offset],
            newNodes[5 * n + k * (n - 1) + i + 1 + offset],
            newNodes[5 * n + 5 * (n - 1) + k * (n - 2) + i + offset],
            newNodes[5 * n + k * (n - 1) + i + offset]
          );
          newFaces.push(newFace);
        }
      }

      // type 3 : contre-sommet
      if (n >= 3) {
        newFace = new Quintangle(this.parent,
          newNodes[5 * n + 5 * (n - 1) - 1 + offset],
          newNodes[5 * n + offset],
          newNodes[5 * n + 5 * (n - 1) + offset],
          newNodes[5 * n + 5 * (n - 1) + 5 * (n - 2) + offset],
          newNodes[5 * n + 5 * (n - 1) + 5 * (n - 2) - 1 + offset]
        );
        newFaces.push(newFace);

        for (let k = 1; k < 5; k++) {
          newFace = new Quintangle(this.parent,
            newNodes[5 * n + k * (n - 1) - 1 + offset],
            newNodes[5 * n + k * (n - 1) + offset],
            newNodes[5 * n + 5 * (n - 1) + k * (n - 2) + offset],
            newNodes[5 * n + 5 * (n - 1) + 5 * (n - 2) + k * (n - 3) + offset],
            newNodes[5 * n + 5 * (n - 1) + k * (n - 2) - 1 + offset]
          );
          newFaces.push(newFace);
        }
      }

      // type 4 : haut
      for (let k = 0; k < 5; k++) {
        for (let i = 1; i <= n - 3; i++) {
          newFace = new Quintangle(this.parent,
            newNodes[5 * n + k * (n - 1) + i + offset],
            newNodes[5 * n + 5 * (n - 1) + (k * (n - 2) + i) % (5 * (n - 2)) + offset],
            newNodes[5 * n + 5 * (n - 1) + 5 * (n - 2) + (k * (n - 3) + i) % (5 * (n - 3)) + offset],
            newNodes[5 * n + 5 * (n - 1) + 5 * (n - 2) + k * (n - 3) + i - 1 + offset],
            newNodes[5 * n + 5 * (n - 1) + k * (n - 2) + i - 1 + offset]
          );
          newFaces.push(newFace);
        }
      }

      // type 5 : calotte
      if (n == 1 || n == 2) {
        let max = newNodes.length;
        newFace = new Quintangle(this.parent,
          newNodes[max - 1],
          newNodes[max - 5],
          newNodes[max - 4],
          newNodes[max - 3],
          newNodes[max - 2]
        );
        newFaces.push(newFace);
      }


      offset += 5 * n + 5 * (n - 1) + 5 * (n - 2);
      n -= 3;
    }



    return [newNodes, newFaces];
  }
}

EVAL_DISTANCE = function(polygon1, polygon2) {
  return polygon1.isBefore(polygon2);
}

print("geom.js ok");