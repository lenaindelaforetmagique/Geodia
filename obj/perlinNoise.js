// Perlin Noise generator
print("perlin in");

class PerlinNoise {
  constructor(xMin, xMax, xDiv, yMin, yMax, yDiv) {
    this.xmin = xMin;
    this.xmax = xMax;
    this.xdiv = xDiv;
    this.ymin = yMin;
    this.ymax = yMax;
    this.ydiv = yDiv;
    this.matrix = [];

    this.DX = (this.xmax - this.xmin) / this.xdiv;
    this.DY = (this.ymax - this.ymin) / this.ydiv;

    for (let i = 0; i < this.xdiv + 1; i++) {
      let newLine = [];
      for (let j = 0; j < this.ydiv + 1; j++) {
        let a = Math.random() * Math.PI * 2
        let vect = [];
        vect.push(Math.cos(a));
        vect.push(Math.sin(a));
        newLine.push(vect);
      }
      this.matrix.push(newLine);
    }
  }

  lerp(a0, a1, w) {
    return (1 - w) * a0 + w * a1;
  }

  // Computes the dot product of the distance and gradient vectors.
  dotGridGradient(ix, iy, x, y) {

    // Precomputed (or otherwise) gradient vectors at each grid node

    // Compute the distance vector
    let dx = (x - (ix * this.DX + this.xmin)) / this.DX;
    let dy = (y - (iy * this.DY + this.ymin)) / this.DY;

    // Compute the dot-product
    return (dx * this.matrix[ix][iy][0] + dy * this.matrix[ix][iy][1]);
  }


  // Compute Perlin noise at coordinates x, y
  noise(x, y) {
    // Determine grid cell coordinates

    let x0 = Math.floor((x - this.xmin) / this.DX);
    let x1 = x0 + 1;
    let y0 = Math.floor((y - this.ymin) / this.DY);
    let y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    let sx = (x - x0 * this.DX - this.xmin) / this.DX;
    let sy = (y - y0 * this.DY - this.ymin) / this.DY;

    sx = Math.sin((sx - 0.5) * Math.PI) / 2 + 0.5;
    sy = Math.sin((sy - 0.5) * Math.PI) / 2 + 0.5;

    // Interpolate between grid point gradients
    let n0 = this.dotGridGradient(x0, y0, x, y);
    let n1 = this.dotGridGradient(x1, y0, x, y);
    let ix0 = this.lerp(n0, n1, sx);

    n0 = this.dotGridGradient(x0, y1, x, y);
    n1 = this.dotGridGradient(x1, y1, x, y);
    let ix1 = this.lerp(n0, n1, sx);

    let value = this.lerp(ix0, ix1, sy);
    return value;
  }
}

print("perlinNoise.js ok ");