POLY_NAMES = [];
POLY_FUNCTIONS = [];



POLY_NAMES.push("Sol de Perlin");
POLY_FUNCTIONS.push(function(parent) {
  let nbre = 10;
  let dx = parent.radius / nbre * 8;
  let dy = dx;


  let colorFunction = function(poly) {
    let z = poly.center().z;
    let color = 0;
    if (z < 1) {
      color = 180 + Math.random() * 10;
    } else {
      color = 100 + (50 - 100) / 300 * z + Math.random() * 0;
    }
    return color

  };

  let perlinNoise = [];
  let perlinFact = [];
  let nbNoise = 6;
  for (let k = 0; k < nbNoise; k++) {
    perlinNoise.push(new PerlinNoise(-nbre * dx / 2, nbre * dx / 2, 2 * (k + 1), -nbre * dy / 2, nbre * dy / 2, 2 * (k + 1)));
    perlinFact.push(Math.random() * (5 - k));
  }

  for (let i = 0; i < nbre; i++) {
    for (let j = 0; j < nbre; j++) {
      let x = i * dx - nbre * dx / 2;
      let y = j * dy - nbre * dy / 2;
      let r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      // let z = 50 * Math.cos(r / size) * Math.exp(-r / size / 5);
      let z = 0;
      for (let k = 0; k < perlinNoise.length; k++) {
        z += perlinNoise[k].noise(x, y) * perlinFact[k];
      }
      z = Math.max(z, 0);
      // console.log(z);
      parent.addNode(x, y, 100 * z);
      // parent.last.color=
    }
  }

  for (let i = 0; i < nbre - 1; i++) {
    for (let j = 0; j < nbre - 1; j++) {
      parent.addTriangle(i * nbre + j, (i + 1) * nbre + j + 1, (i + 1) * nbre + j, 0);
      parent.faces.last().color = colorFunction(parent.faces.last());
      parent.addTriangle(i * nbre + j, i * nbre + j + 1, (i + 1) * nbre + j + 1, 0);
      parent.faces.last().color = colorFunction(parent.faces.last());
    }
  }
});