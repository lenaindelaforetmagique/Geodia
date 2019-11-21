class Ground {
  constructor(xmin, xmax, ymin, ymax, order) {
    this.perlinNoise = [];
    this.perlinFact = [];
    this.nbNoise = order;
    for (let k = 0; k < this.nbNoise; k++) {
      this.perlinNoise.push(new PerlinNoise(xmin, xmax, 2 * (k + 1), ymin, ymax, 2 * (k + 1)));
      this.perlinFact.push(Math.random() * (5 - k));
    }
  }

  altitude(x, y) {
    let z = 0;
    for (let k = 0; k < this.perlinNoise.length; k++) {
      z += this.perlinNoise[k].noise(x, y) * this.perlinFact[k];
    }
    return Math.max(100 * z, 0);
  }
}


POLY_NAMES = [];
POLY_FUNCTIONS = [];
POLY_GROUNDS = [];

print("landscape in");

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



// POLY_
for (let i = 0; i < 10; i++) {
  POLY_NAMES.push("Sol de Perlin " + (i + 1));
  POLY_FUNCTIONS.push(function(parent) {
    let nbre = 3;
    let dx = parent.radius / nbre * 8;
    let dy = dx;
    let width = dx * (nbre - 1);
    let height = dy * (nbre - 1);

    POLY_GROUNDS.push(new Ground(-width / 1.5, width / 1.5, -height / 1.5, height / 1.5, POLY_GROUNDS.length + 2));

    for (let i = 0; i < nbre; i++) {
      for (let j = 0; j < nbre; j++) {
        let x = i * dx - width / 2;
        let y = j * dy - height / 2;

        // console.log(z);
        parent.addNode(x, y, 0);
        // parent.last.color=
      }
    }

    for (let i = 0; i < nbre - 1; i++) {
      for (let j = 0; j < nbre - 1; j++) {
        parent.addTriangle(i * nbre + j, (i + 1) * nbre + j, (i + 1) * nbre + j + 1, 0);
        parent.addTriangle(i * nbre + j, (i + 1) * nbre + j + 1, i * nbre + j + 1, 0);
      }
    }
  });

}



print("landscape.jsee ok");