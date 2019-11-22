POLY_NAMES = [];
POLY_FUNCTIONS = [];
POLY_NOISES = [];
POLY_FACT = [];

print("landscape in");

let colorFunction = function(poly) {
  let z = poly.center().z;
  let color = 0;

  if (z < -49) {
    color = 180 + Math.random() * 10;
  } else {
    color = 65 + (10 - 100) / 300 * z + Math.random() * 20;
  }
  return color
};

altitude = function(x, y, order) {
  let z = 0;
  for (let k = 0; k < Math.min(order + 1, POLY_NOISES.length); k++) {
    z += POLY_NOISES[k].noise(x, y) * POLY_FACT[k];
  }

  return Math.max(300 * z, -50);
}


let width = 800;
let height = 800;
let seed = 1; //Math.random();

// POLY_
for (let i = 0; i < 10; i++) {
  POLY_NAMES.push("Sol de Perlin " + (i + 1));
  POLY_NOISES.push(new PerlinNoise(-width / 1.5, width / 1.5, Math.pow(2, i + 2), -height / 1.5, height / 1.5, Math.pow(2, i + 2)));
  POLY_FACT.push((Math.random() + 1) / 2 * 1 / Math.pow(2, i));
  // POLY_FACT.push(Math.random());
  POLY_FUNCTIONS.push(function(parent) {
    let nbre = 4;
    let dx = width / (nbre - 1);
    let dy = height / (nbre - 1);

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
        // parent.addQuadrangle(i * nbre + j, (i + 1) * nbre + j, (i + 1) * nbre + j + 1, i * nbre + j + 1, 0)
      }
    }
  });

  // POLY_FUNCTIONS.push(function(parent) {
  //   let nbre = 6;
  //   let dx = width / (nbre - 1);
  //   let dy = height / (nbre - 1);
  //   let r = width / 1.55;
  //
  //
  //   parent.addNode(0, 0, 0);
  //   for (let i = 0; i < nbre; i++) {
  //     parent.addNode(r * Math.cos(i * Math.PI * 2 / nbre), r * Math.sin(i * Math.PI * 2 / nbre), 0);
  //   }
  //
  //
  //   for (let i = 0; i < nbre; i++) {
  //     parent.addTriangle(0, i + 1, i < nbre - 1 ? i + 2 : 1, 0);
  //   }
  //
  //   // parent.addTriangle(0, 1, 2, 0);
  //
  // });

}



print("landscape.jsee ok");