print("landscape in");
class Landscape {
  constructor(width_ = 800, height_ = 800, order_ = 10) {
    this.width = width_;
    this.height = height_;
    this.order = order_;
    this.name = "Sol de Perlin à l'ordre - " + this.order;

    this.factors = [];
    this.noises = [];

    for (let i = 0; i < this.order; i++) {
      this.factors.push((Math.random() + 1) / 2 * 1 / Math.pow(2, i));
      this.noises.push(new PerlinNoise(-this.width / 1.5, this.width / 1.5, Math.pow(2, i + 2), -this.height / 1.5, this.height / 1.5, Math.pow(2, i + 2)));
    }

    // console.log(this.factors);
  }

  altitude(x, y, order) {
    // console.log("lkjlkj", order);
    let z = 0;
    for (let k = 0; k < Math.min(order, this.order); k++) {
      z += this.noises[k].noise(x, y) * this.factors[k];
    }
    // console.log();
    // console.log(this.noises[0]);
    return Math.max(300 * z, -50);
  }

  colorFunction(position) {
    let color = 0;
    let lastNoise = this.noises.last();
    if (position.z < -49.9) {
      color = 180 + lastNoise.noise(position.x, position.y) * 10;
    } else {
      color = 65 + (10 - 100) / 300 * position.z + lastNoise.noise(position.x, position.y) * 20;
    }
    // console.log(color);
    return color;
  }



}



POLY_NAMES = [];
POLY_FUNCTIONS = [];
POLY_NOISES = [];
POLY_FACT = [];








let width = 800;
let height = 800;
// POLY_
for (let i = 0; i < 10; i++) {
  POLY_NAMES.push("Sol de Perlin " + (i + 1));

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
      }
    }
  });
}



print("landscape.jsee ok");