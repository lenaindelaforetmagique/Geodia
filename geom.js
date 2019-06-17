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

class Triangle {
  constructor(n1, n2, n3) {
    this.node1 = n1;
    this.node2 = n2;
    this.node3 = n3;

    this.dom = document.createElementNS(SVGNS, 'polygon');
    this.dom.setAttribute("class", "face");
    let c = Math.random() * 0 + 200;
    this.color = colorGenerator(c, c, c, 1);
    this.dom = document.createElementNS(SVGNS, 'polygon');
    this.dom.setAttribute('fill', this.color);
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

  show() {
    var pos1 = PROJ_FUNCTION(this.node1.position);
    var pos2 = PROJ_FUNCTION(this.node2.position);
    var pos3 = PROJ_FUNCTION(this.node3.position);
    let list = `${pos1[0]}, ${pos1[1]}, ${pos2[0]}, ${pos2[1]} `;
    list += `${pos3[0]}, ${pos3[1]}, ${pos1[0]}, ${pos1[1]} `;

    this.dom.setAttributeNS(null, "points", list);

    let alpha = -0.25;
    let beta = -0.85;
    let gamma = 0.5;
    let color = (
        (pos1[0] + pos2[0] + pos3[0]) * (alpha) +
        (pos1[1] + pos2[1] + pos3[1]) * (beta) +
        (pos1[2] + pos2[2] + pos3[2] * (gamma))) /
      (Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2)) *
      12 / 100 + 150;

    this.dom.setAttribute('fill', colorGenerator(color, color, color, 1));

    // this.dom.setAttribute()
  }

  isBefore(other) {
    var res = 0;
    res += PROJ_FUNCTION(this.node1.position)[2];
    res += PROJ_FUNCTION(this.node2.position)[2];
    res += PROJ_FUNCTION(this.node3.position)[2];
    res -= PROJ_FUNCTION(other.node1.position)[2];
    res -= PROJ_FUNCTION(other.node2.position)[2];
    res -= PROJ_FUNCTION(other.node3.position)[2];
    res /= 3;
    return res;
  }
}

EVAL_DISTANCE = function(triangle1, triangle2) {
  return triangle1.isBefore(triangle2);
}