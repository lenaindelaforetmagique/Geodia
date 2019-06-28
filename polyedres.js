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
  parent.addTriangle(0, 2, 5, offset);
  parent.addTriangle(0, 5, 3, offset);
  parent.addTriangle(0, 3, 4, offset);
  parent.addTriangle(0, 4, 2, offset);
  parent.addTriangle(1, 2, 4, offset);
  parent.addTriangle(1, 4, 3, offset);
  parent.addTriangle(1, 3, 5, offset);
  parent.addTriangle(1, 5, 2, offset);
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
  parent.addQuintangle(1, 3, 15, 9, 13, offset);
  parent.addQuintangle(1, 13, 4, 6, 17, offset);
  parent.addQuintangle(1, 17, 11, 19, 3, offset);
  parent.addQuintangle(2, 14, 5, 7, 18, offset);
  parent.addQuintangle(3, 15, 5, 7, 19, offset);
  parent.addQuintangle(4, 12, 8, 9, 13, offset);
  parent.addQuintangle(5, 14, 8, 9, 15, offset);
  parent.addQuintangle(6, 16, 10, 11, 17, offset);
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
  parent.addTriangle(0, 1, 4, offset);
  parent.addTriangle(0, 4, 8, offset);
  parent.addTriangle(0, 8, 9, offset);
  parent.addTriangle(0, 9, 6, offset);
  parent.addTriangle(0, 6, 1, offset);
  parent.addTriangle(1, 6, 11, offset);
  parent.addTriangle(1, 11, 10, offset);
  parent.addTriangle(1, 10, 4, offset);
  parent.addTriangle(2, 3, 7, offset);
  parent.addTriangle(2, 7, 9, offset);
  parent.addTriangle(2, 9, 8, offset);
  parent.addTriangle(2, 8, 5, offset);
  parent.addTriangle(2, 5, 3, offset);
  parent.addTriangle(3, 5, 10, offset);
  parent.addTriangle(3, 10, 11, offset);
  parent.addTriangle(3, 11, 7, offset);
  parent.addTriangle(4, 10, 5, offset);
  parent.addTriangle(4, 5, 8, offset);
  parent.addTriangle(6, 9, 7, offset);
  parent.addTriangle(6, 7, 11, offset);
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
  parent.addTriangle(0, 4, 8, offset);
  parent.addTriangle(1, 4, 10, offset);
  parent.addTriangle(1, 5, 11, offset);
  parent.addTriangle(2, 6, 8, offset);
  parent.addTriangle(2, 7, 9, offset);
  parent.addTriangle(3, 6, 10, offset);
  parent.addTriangle(3, 7, 11, offset);

  // Quadrangles
  parent.addQuadrangle(0, 4, 1, 5, offset);
  parent.addQuadrangle(0, 9, 2, 8, offset);
  parent.addQuadrangle(1, 11, 3, 10, offset);
  parent.addQuadrangle(2, 6, 3, 7, offset);
  parent.addQuadrangle(4, 10, 6, 8, offset);
  parent.addQuadrangle(5, 9, 7, 11, offset);
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
  parent.addTriangle(2, 12, 22, offset);
  parent.addTriangle(3, 24, 16, offset);
  parent.addTriangle(4, 13, 26, offset);
  parent.addTriangle(5, 17, 28, offset);
  parent.addTriangle(6, 14, 23, offset);
  parent.addTriangle(7, 18, 25, offset);
  parent.addTriangle(8, 15, 27, offset);
  parent.addTriangle(9, 19, 29, offset);
  parent.addTriangle(10, 12, 16, offset);
  parent.addTriangle(10, 14, 18, offset);
  parent.addTriangle(11, 13, 17, offset);
  parent.addTriangle(11, 15, 19, offset);
  parent.addTriangle(20, 22, 26, offset);
  parent.addTriangle(20, 24, 28, offset);
  parent.addTriangle(21, 23, 27, offset);
  parent.addTriangle(21, 25, 29, offset);

  // Quintangles (12)
  parent.addQuintangle(0, 2, 22, 26, 4, offset);
  parent.addQuintangle(0, 6, 23, 27, 8, offset);
  parent.addQuintangle(1, 3, 24, 28, 5, offset);
  parent.addQuintangle(1, 7, 25, 29, 9, offset);
  parent.addQuintangle(2, 12, 10, 14, 6, offset);
  parent.addQuintangle(3, 7, 18, 10, 16, offset);
  parent.addQuintangle(4, 8, 15, 11, 13, offset);
  parent.addQuintangle(5, 9, 19, 11, 17, offset);
  parent.addQuintangle(12, 16, 24, 20, 22, offset);
  parent.addQuintangle(13, 17, 28, 20, 26, offset);
  parent.addQuintangle(14, 18, 25, 21, 23, offset);
  parent.addQuintangle(15, 19, 29, 21, 27, offset);
  // parent.addQuintangle(17,,,,, offset);



});