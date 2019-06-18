class Node {
  constructor(x_ = 0, y_ = 0, z_ = 0, id) {
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
    var position = PROJ_FUNCTION(this.position);
    this.domEl.setAttribute('cx', position[0]);
    this.domEl.setAttribute('cy', position[1]);
    this.domTx.setAttributeNS(null, "x", position[0]);
    this.domTx.setAttributeNS(null, "y", position[1]);
  }
}

class Edge {
  constructor(n1, n2) {
    this.node1 = n1;
    this.node2 = n2;

    this.dom = document.createElementNS(SVGNS, 'polyline');
    this.dom.setAttribute("class", "edge");
  }

  show() {
    var pos1 = PROJ_FUNCTION(this.node1.position);
    var pos2 = PROJ_FUNCTION(this.node2.position);
    let list = `${pos1[0]}, ${pos1[1]}, ${pos2[0]}, ${pos2[1]} `;

    this.dom.setAttributeNS(null, "points", list);

    // this.dom.setAttribute()
  }
}


class Polygon {
  constructor(nodesList_) {
    this.nodes = nodesList_;

    this.dom = document.createElementNS(SVGNS, 'polygon');
    // this.dom.setAttribute('fill', this.color);
  }

  show() {
    let list = "";
    for (let node of this.nodes) {
      let pos = PROJ_FUNCTION(node.position);
      list += `${pos[0]}, ${pos[1]}, `;
    }
    let pos0 = PROJ_FUNCTION(this.nodes[0].position);
    list += `${pos0[0]}, ${pos0[1]}`

    this.dom.setAttributeNS(null, "points", list);

    let alpha = -0.25;
    let beta = -0.85;
    let gamma = 0.75;
    let center = this.center();
    let projCenter = PROJ_FUNCTION(this.center());
    let color = (
        projCenter[0] * alpha +
        projCenter[1] * beta +
        projCenter[2] * gamma) /
      (Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2)) * 40 / 100 + 150;
    this.dom.setAttribute('fill', colorGenerator(color, color, color, 1));
  }

  center() {
    let centerPos = new Vector3D(0, 0, 0);
    for (let node of this.nodes) {
      centerPos.add(node.position);
    }
    centerPos.div(this.nodes.length);
    return centerPos;
  }

  isBefore(other) {
    let res = PROJ_FUNCTION(this.center())[2];
    res -= PROJ_FUNCTION(other.center())[2];
    return res;
  }

}

class Triangle extends Polygon {
  constructor(n1, n2, n3) {
    super([n1, n2, n3]);

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
        let newNode = new Node();
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
        let newFace = new Triangle(newNodes[id], newNodes[id + 1], newNodes[id + n + 1 - i]);
        newFaces.push(newFace);
        id += 1;
      }
      id += 1;
    }
    id = 0;
    for (let i = 0; i <= n - 2; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let newFace = new Triangle(newNodes[id + 1], newNodes[id + n + 2 - i], newNodes[id + n + 1 - i]);
        newFaces.push(newFace);
        id += 1;
      }
      id += 2;
    }

    return [newNodes, newFaces];
  }
}

class Quadrangle extends Polygon {
  constructor(n1, n2, n3, n4) {
    super([n1, n2, n3, n4]);
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
        let newNode = new Node(0, 0, 0, i + "+" + j);
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
        let newFace = new Quadrangle(
          newNodes[i * (n + 1) + j],
          newNodes[i * (n + 1) + j + 1],
          newNodes[(i + 1) * (n + 1) + (j + 1)],
          newNodes[(i + 1) * (n + 1) + j]
        );
        newFaces.push(newFace);
      }
    }

    return [newNodes, newFaces];
  }
}

class Quintangle extends Polygon {
  constructor(n1, n2, n3, n4, n5) {
    super([n1, n2, n3, n4, n5]);
  }

  refine(n) {
    let newNodes = this.nodes;
    let newFaces = this;
    return [newNodes, newFaces];
  }
}

EVAL_DISTANCE = function(polygon1, polygon2) {
  return polygon1.isBefore(polygon2);
}