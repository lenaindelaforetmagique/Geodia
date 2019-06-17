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

class Face {
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

  show() {
    var pos1 = PROJ_FUNCTION(this.node1.position);
    var pos2 = PROJ_FUNCTION(this.node2.position);
    var pos3 = PROJ_FUNCTION(this.node3.position);
    let list = `${pos1[0]}, ${pos1[1]}, ${pos2[0]}, ${pos2[1]} `;
    list += `${pos3[0]}, ${pos3[1]}, ${pos1[0]}, ${pos1[1]} `;

    this.dom.setAttributeNS(null, "points", list);

    let color = ((pos1[2] + pos2[2] + pos3[2]) / 3) * 50 / 100 + 150;

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

EVAL_DISTANCE = function(face1, face2) {
  return face1.isBefore(face2);
}