POLY_NAMES = [];
POLY_FUNCTIONS = [];

// 4
POLY_NAMES.push("Tétraèdre");
POLY_FUNCTIONS.push(function(parent) {
  let fact = parent.radius / 3;
  // Nodes (12)
  let offset = parent.nodes.length;
  parent.addNode(Math.sqrt(6) * fact, -Math.sqrt(2) * fact, -1 * fact);
  parent.addNode(-Math.sqrt(6) * fact, -Math.sqrt(2) * fact, -1 * fact);
  parent.addNode(0, 2 * Math.sqrt(2) * fact, -1 * fact);
  parent.addNode(0, 0, 3 * fact);

  // Triangles (20)
  parent.addTriangle(0, 1, 2, offset);
  parent.addTriangle(0, 2, 3, offset);
  parent.addTriangle(0, 3, 1, offset);
  parent.addTriangle(1, 3, 2, offset);
});

// 6
POLY_NAMES.push("Hexaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let one = parent.radius / Math.sqrt(3);
  // Nodes (12)
  let offset = parent.nodes.length;
  parent.addNode(-one, -one, -one);
  parent.addNode(-one, one, -one);
  parent.addNode(one, -one, -one);
  parent.addNode(one, one, -one);
  parent.addNode(-one, -one, one);
  parent.addNode(-one, one, one);
  parent.addNode(one, -one, one);
  parent.addNode(one, one, one);

  // Triangles (20)
  parent.addQuadrangle(0, 1, 3, 2, offset);
  parent.addQuadrangle(0, 4, 5, 1, offset);
  parent.addQuadrangle(0, 2, 6, 4, offset);
  parent.addQuadrangle(1, 5, 7, 3, offset);
  parent.addQuadrangle(2, 3, 7, 6, offset);
  parent.addQuadrangle(4, 6, 7, 5, offset);
});

// 8
POLY_NAMES.push("Octaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let fact = parent.radius;
  let offset = parent.nodes.length;
  // Nodes (12)
  parent.addNode(1 * fact, 0, 0);
  parent.addNode(-1 * fact, 0, 0);
  parent.addNode(0, 1 * fact, 0);
  parent.addNode(0, -1 * fact, 0);
  parent.addNode(0, 0, 1 * fact);
  parent.addNode(0, 0, -1 * fact);

  // Faces (8)
  parent.addTriangle(0, 5, 2, offset);
  parent.addTriangle(0, 3, 5, offset);
  parent.addTriangle(0, 4, 3, offset);
  parent.addTriangle(0, 2, 4, offset);
  parent.addTriangle(1, 4, 2, offset);
  parent.addTriangle(1, 3, 4, offset);
  parent.addTriangle(1, 5, 3, offset);
  parent.addTriangle(1, 2, 5, offset);
});

// 12
POLY_NAMES.push("Dodecaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let fact = parent.radius / Math.sqrt(3);
  let offset = parent.nodes.length;

  let one = fact * 1;
  let phi = fact * (1 + Math.sqrt(5)) / 2;
  let one_phi = fact * 1 / ((1 + Math.sqrt(5)) / 2);
  // Nodes (12)
  parent.addNode(0, one_phi, phi);
  parent.addNode(0, one_phi, -phi);
  parent.addNode(0, -one_phi, phi);
  parent.addNode(0, -one_phi, -phi);
  parent.addNode(one_phi, phi, 0);
  parent.addNode(one_phi, -phi, 0);
  parent.addNode(-one_phi, phi, 0);
  parent.addNode(-one_phi, -phi, 0);
  parent.addNode(phi, 0, one_phi);
  parent.addNode(phi, 0, -one_phi);
  parent.addNode(-phi, 0, one_phi);
  parent.addNode(-phi, 0, -one_phi);
  parent.addNode(one, one, one);
  parent.addNode(one, one, -one);
  parent.addNode(one, -one, one);
  parent.addNode(one, -one, -one);
  parent.addNode(-one, one, one);
  parent.addNode(-one, one, -one);
  parent.addNode(-one, -one, one);
  parent.addNode(-one, -one, -one);

  // Faces (8)
  parent.addQuintangle(0, 2, 14, 8, 12, offset);
  parent.addQuintangle(0, 12, 4, 6, 16, offset);
  parent.addQuintangle(0, 16, 10, 18, 2, offset);
  parent.addQuintangle(1, 13, 9, 15, 3, offset);
  parent.addQuintangle(1, 17, 6, 4, 13, offset);
  parent.addQuintangle(1, 3, 19, 11, 17, offset);
  parent.addQuintangle(2, 18, 7, 5, 14, offset);
  parent.addQuintangle(3, 15, 5, 7, 19, offset);
  parent.addQuintangle(4, 12, 8, 9, 13, offset);
  parent.addQuintangle(5, 15, 9, 8, 14, offset);
  parent.addQuintangle(6, 17, 11, 10, 16, offset);
  parent.addQuintangle(7, 18, 10, 11, 19, offset);
});

//20
POLY_NAMES.push("Icosaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let offset = parent.nodes.length;
  let phi = (1 + Math.sqrt(5)) / 2;
  let one = 1;
  let fact = parent.radius / Math.sqrt(1 + phi ** 2);
  phi *= fact;
  one *= fact;
  // Nodes (12)
  parent.addNode(phi, one, 0);
  parent.addNode(phi, -one, 0);
  parent.addNode(-phi, one, 0);
  parent.addNode(-phi, -one, 0);
  parent.addNode(one, 0, phi);
  parent.addNode(-one, 0, phi);
  parent.addNode(one, 0, -phi);
  parent.addNode(-one, 0, -phi);
  parent.addNode(0, phi, one);
  parent.addNode(0, phi, -one);
  parent.addNode(0, -phi, one);
  parent.addNode(0, -phi, -one);

  // Faces (20)
  parent.addTriangle(0, 4, 1, offset);
  parent.addTriangle(0, 8, 4, offset);
  parent.addTriangle(0, 9, 8, offset);
  parent.addTriangle(0, 6, 9, offset);
  parent.addTriangle(0, 1, 6, offset);
  parent.addTriangle(1, 11, 6, offset);
  parent.addTriangle(1, 10, 11, offset);
  parent.addTriangle(1, 4, 10, offset);
  parent.addTriangle(2, 7, 3, offset);
  parent.addTriangle(2, 9, 7, offset);
  parent.addTriangle(2, 8, 9, offset);
  parent.addTriangle(2, 5, 8, offset);
  parent.addTriangle(2, 3, 5, offset);
  parent.addTriangle(3, 10, 5, offset);
  parent.addTriangle(3, 11, 10, offset);
  parent.addTriangle(3, 7, 11, offset);
  parent.addTriangle(4, 5, 10, offset);
  parent.addTriangle(4, 8, 5, offset);
  parent.addTriangle(6, 7, 9, offset);
  parent.addTriangle(6, 11, 7, offset);
});

// 14
POLY_NAMES.push("Cuboctaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let one = parent.radius / Math.sqrt(2);
  // Nodes (12)
  let offset = parent.nodes.length;
  parent.addNode(one, one, 0);
  parent.addNode(one, -one, 0);
  parent.addNode(-one, one, 0);
  parent.addNode(-one, -one, 0);
  parent.addNode(one, 0, one);
  parent.addNode(one, 0, -one);
  parent.addNode(-one, 0, one);
  parent.addNode(-one, 0, -one);
  parent.addNode(0, one, one);
  parent.addNode(0, one, -one);
  parent.addNode(0, -one, one);
  parent.addNode(0, -one, -one);

  // Triangles
  parent.addTriangle(0, 5, 9, offset);
  parent.addTriangle(0, 8, 4, offset);
  parent.addTriangle(1, 4, 10, offset);
  parent.addTriangle(1, 11, 5, offset);
  parent.addTriangle(2, 6, 8, offset);
  parent.addTriangle(2, 9, 7, offset);
  parent.addTriangle(3, 10, 6, offset);
  parent.addTriangle(3, 7, 11, offset);

  // Quadrangles
  parent.addQuadrangle(0, 4, 1, 5, offset);
  parent.addQuadrangle(0, 9, 2, 8, offset);
  parent.addQuadrangle(1, 10, 3, 11, offset);
  parent.addQuadrangle(2, 7, 3, 6, offset);
  parent.addQuadrangle(4, 8, 6, 10, offset);
  parent.addQuadrangle(5, 11, 7, 9, offset);
});


// 32
POLY_NAMES.push("Icosidodécaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let phi = parent.radius;
  let one = 2 * phi / (1 + Math.sqrt(5));
  let c2 = (one + phi) / 2;
  // Nodes (12)
  let offset = parent.nodes.length;
  parent.addNode(0, 0, phi);
  parent.addNode(0, 0, -phi);
  parent.addNode(one / 2, phi / 2, c2);
  parent.addNode(one / 2, phi / 2, -c2);
  parent.addNode(one / 2, -phi / 2, c2);
  parent.addNode(one / 2, -phi / 2, -c2);
  parent.addNode(-one / 2, phi / 2, c2);
  parent.addNode(-one / 2, phi / 2, -c2);
  parent.addNode(-one / 2, -phi / 2, c2);
  parent.addNode(-one / 2, -phi / 2, -c2);

  // parent.addNode(        0, phi ,       0);
  // parent.addNode(        0, -phi,       0);
  // parent.addNode(  phi / 2, c2  , one / 2);
  // parent.addNode(  phi / 2, -c2 , one / 2);
  // parent.addNode( -phi / 2, c2  , one / 2);
  // parent.addNode( -phi / 2, -c2 , one / 2);
  // parent.addNode(  phi / 2, c2  ,-one / 2);
  // parent.addNode(  phi / 2, -c2 ,-one / 2);
  // parent.addNode( -phi / 2, c2  ,-one / 2);
  // parent.addNode( -phi / 2, -c2 ,-one / 2);

  parent.addNode(0, phi, 0);
  parent.addNode(0, -phi, 0);
  parent.addNode(phi / 2, c2, one / 2);
  parent.addNode(phi / 2, -c2, one / 2);
  parent.addNode(-phi / 2, c2, one / 2);
  parent.addNode(-phi / 2, -c2, one / 2);
  parent.addNode(phi / 2, c2, -one / 2);
  parent.addNode(phi / 2, -c2, -one / 2);
  parent.addNode(-phi / 2, c2, -one / 2);
  parent.addNode(-phi / 2, -c2, -one / 2);

  parent.addNode(phi, 0, 0);
  parent.addNode(-phi, 0, 0);
  parent.addNode(c2, one / 2, phi / 2);
  parent.addNode(-c2, one / 2, phi / 2);
  parent.addNode(c2, one / 2, -phi / 2);
  parent.addNode(-c2, one / 2, -phi / 2);
  parent.addNode(c2, -one / 2, phi / 2);
  parent.addNode(-c2, -one / 2, phi / 2);
  parent.addNode(c2, -one / 2, -phi / 2);
  parent.addNode(-c2, -one / 2, -phi / 2);

  // Triangles (20)
  parent.addTriangle(0, 2, 6, offset);
  parent.addTriangle(0, 8, 4, offset);
  parent.addTriangle(1, 5, 9, offset);
  parent.addTriangle(1, 7, 3, offset);
  parent.addTriangle(2, 22, 12, offset);
  parent.addTriangle(3, 16, 24, offset);
  parent.addTriangle(4, 13, 26, offset);
  parent.addTriangle(5, 28, 17, offset);
  parent.addTriangle(6, 14, 23, offset);
  parent.addTriangle(7, 25, 18, offset);
  parent.addTriangle(8, 27, 15, offset);
  parent.addTriangle(9, 19, 29, offset);
  parent.addTriangle(10, 12, 16, offset);
  parent.addTriangle(10, 18, 14, offset);
  parent.addTriangle(11, 17, 13, offset);
  parent.addTriangle(11, 15, 19, offset);
  parent.addTriangle(20, 22, 26, offset);
  parent.addTriangle(20, 28, 24, offset);
  parent.addTriangle(21, 27, 23, offset);
  parent.addTriangle(21, 25, 29, offset);

  // Quintangles (12)
  parent.addQuintangle(0, 4, 26, 22, 2, offset);
  parent.addQuintangle(0, 6, 23, 27, 8, offset);
  parent.addQuintangle(1, 3, 24, 28, 5, offset);
  parent.addQuintangle(1, 9, 29, 25, 7, offset);
  parent.addQuintangle(2, 12, 10, 14, 6, offset);
  parent.addQuintangle(3, 7, 18, 10, 16, offset);
  parent.addQuintangle(4, 8, 15, 11, 13, offset);
  parent.addQuintangle(5, 17, 11, 19, 9, offset);
  parent.addQuintangle(12, 22, 20, 24, 16, offset);
  parent.addQuintangle(13, 17, 28, 20, 26, offset);
  parent.addQuintangle(14, 18, 25, 21, 23, offset);
  parent.addQuintangle(15, 27, 21, 29, 19, offset);
  // parent.addQuintangle(17,,,,, offset);

});

// 12
POLY_NAMES.push("Pentakidodécaèdre");
POLY_FUNCTIONS.push(function(parent) {
  let fact = parent.radius / Math.sqrt(3);
  let offset = parent.nodes.length;

  let one = fact * 1;
  let phi = fact * (1 + Math.sqrt(5)) / 2;
  let one_phi = fact * 1 / ((1 + Math.sqrt(5)) / 2);
  // Nodes (20)
  parent.addNode(0, one_phi, phi);
  parent.addNode(0, one_phi, -phi);
  parent.addNode(0, -one_phi, phi);
  parent.addNode(0, -one_phi, -phi);
  parent.addNode(one_phi, phi, 0);
  parent.addNode(one_phi, -phi, 0);
  parent.addNode(-one_phi, phi, 0);
  parent.addNode(-one_phi, -phi, 0);
  parent.addNode(phi, 0, one_phi);
  parent.addNode(phi, 0, -one_phi);
  parent.addNode(-phi, 0, one_phi);
  parent.addNode(-phi, 0, -one_phi);
  parent.addNode(one, one, one);
  parent.addNode(one, one, -one);
  parent.addNode(one, -one, one);
  parent.addNode(one, -one, -one);
  parent.addNode(-one, one, one);
  parent.addNode(-one, one, -one);
  parent.addNode(-one, -one, one);
  parent.addNode(-one, -one, -one);

  // Nodes (+12)
  parent.addNode_COG([0, 2, 14, 8, 12], offset);
  parent.addNode_COG([0, 12, 4, 6, 16], offset);
  parent.addNode_COG([0, 16, 10, 18, 2], offset);
  parent.addNode_COG([1, 3, 15, 9, 13], offset);
  parent.addNode_COG([1, 13, 4, 6, 17], offset);
  parent.addNode_COG([1, 17, 11, 19, 3], offset);
  parent.addNode_COG([2, 14, 5, 7, 18], offset);
  parent.addNode_COG([3, 15, 5, 7, 19], offset);
  parent.addNode_COG([4, 12, 8, 9, 13], offset);
  parent.addNode_COG([5, 14, 8, 9, 15], offset);
  parent.addNode_COG([6, 16, 10, 11, 17], offset);
  parent.addNode_COG([7, 18, 10, 11, 19], offset);
  for (let i = 19; i <= 31; i++) {
    parent.nodes[offset + i].position.forceNorm(parent.radius);
  }

  // Faces (60)
  parent.addTriangle(0, 2, 20, offset);
  parent.addTriangle(2, 14, 20, offset);
  parent.addTriangle(14, 8, 20, offset);
  parent.addTriangle(8, 12, 20, offset);
  parent.addTriangle(12, 0, 20, offset);
  parent.addTriangle(0, 12, 21, offset);
  parent.addTriangle(12, 4, 21, offset);
  parent.addTriangle(4, 6, 21, offset);
  parent.addTriangle(6, 16, 21, offset);
  parent.addTriangle(16, 0, 21, offset);
  parent.addTriangle(0, 16, 22, offset);
  parent.addTriangle(16, 10, 22, offset);
  parent.addTriangle(10, 18, 22, offset);
  parent.addTriangle(18, 2, 22, offset);
  parent.addTriangle(2, 0, 22, offset);
  parent.addTriangle(1, 23, 3, offset);
  parent.addTriangle(3, 23, 15, offset);
  parent.addTriangle(15, 23, 9, offset);
  parent.addTriangle(9, 23, 13, offset);
  parent.addTriangle(13, 23, 1, offset);
  parent.addTriangle(1, 24, 13, offset);
  parent.addTriangle(13, 24, 4, offset);
  parent.addTriangle(4, 24, 6, offset);
  parent.addTriangle(6, 24, 17, offset);
  parent.addTriangle(17, 24, 1, offset);
  parent.addTriangle(1, 25, 17, offset);
  parent.addTriangle(17, 25, 11, offset);
  parent.addTriangle(11, 25, 19, offset);
  parent.addTriangle(19, 25, 3, offset);
  parent.addTriangle(3, 25, 1, offset);
  parent.addTriangle(2, 26, 14, offset);
  parent.addTriangle(14, 26, 5, offset);
  parent.addTriangle(5, 26, 7, offset);
  parent.addTriangle(7, 26, 18, offset);
  parent.addTriangle(18, 26, 2, offset);
  parent.addTriangle(3, 15, 27, offset);
  parent.addTriangle(15, 5, 27, offset);
  parent.addTriangle(5, 7, 27, offset);
  parent.addTriangle(7, 19, 27, offset);
  parent.addTriangle(19, 3, 27, offset);
  parent.addTriangle(4, 12, 28, offset);
  parent.addTriangle(12, 8, 28, offset);
  parent.addTriangle(8, 9, 28, offset);
  parent.addTriangle(9, 13, 28, offset);
  parent.addTriangle(13, 4, 28, offset);
  parent.addTriangle(5, 29, 14, offset);
  parent.addTriangle(14, 29, 8, offset);
  parent.addTriangle(8, 29, 9, offset);
  parent.addTriangle(9, 29, 15, offset);
  parent.addTriangle(15, 29, 5, offset);
  parent.addTriangle(6, 30, 16, offset);
  parent.addTriangle(16, 30, 10, offset);
  parent.addTriangle(10, 30, 11, offset);
  parent.addTriangle(11, 30, 17, offset);
  parent.addTriangle(17, 30, 6, offset);
  parent.addTriangle(7, 18, 31, offset);
  parent.addTriangle(18, 10, 31, offset);
  parent.addTriangle(10, 11, 31, offset);
  parent.addTriangle(11, 19, 31, offset);
  parent.addTriangle(19, 7, 31, offset);
});