// Perlin Noise generator

PN_MATRIX = [];
PN_XMIN = 0;
PN_XMAX = 10;
YMAX = 10;
PN_PN_YMIN = 0;
PN_XDIV = 2;
PN_YDIV = 2;
PN_DX = 1;
PN_DY = 1;

initPerlinNoise = function(xMin, xMax, xDiv, yMin, yMax, yDiv) {
  PN_XMIN = xMin;
  PN_XMAX = xMax;
  PN_XDIV = xDiv;
  PN_YMIN = yMin;
  PN_YMAX = yMax;
  PN_YDIV = yDiv;
  PN_MATRIX = [];


  PN_DX = (PN_XMAX - PN_XMIN) / PN_XDIV;
  PN_DY = (PN_YMAX - PN_YMIN) / PN_YDIV;


  for (let i = 0; i < PN_XDIV + 1; i++) {
    let newLine = [];
    for (let j = 0; j < PN_YDIV + 1; j++) {
      let a = Math.random() * Math.PI * 2
      let vect = [];
      vect.push(Math.cos(a));
      vect.push(Math.sin(a));
      newLine.push(vect);
    }
    PN_MATRIX.push(newLine);
  }

}

/* Function to linearly interpolate between a0 and a1
 * Weight w should be in the range [0.0, 1.0]
 *
 * as an alternative, this slightly faster equivalent function (macro) can be used:
 * #define lerp(a0, a1, w) ((a0) + (w)*((a1) - (a0)))
 */
pn_lerp = function(a0, a1, w) {
  return (1.0 - w) * a0 + w * a1;
}

// Computes the dot product of the distance and gradient vectors.
pn_dotGridGradient = function(ix, iy, x, y) {

  // Precomputed (or otherwise) gradient vectors at each grid node

  // Compute the distance vector
  let dx = (x - (ix * PN_DX + PN_XMIN)) / PN_DX;
  let dy = (y - (iy * PN_DY + PN_YMIN)) / PN_DY;

  // Compute the dot-product
  return (dx * PN_MATRIX[ix][iy][0] + dy * PN_MATRIX[ix][iy][1]);
}


// Compute Perlin noise at coordinates x, y
perlinnoise = function(x, y) {
  // Determine grid cell coordinates

  let x0 = Math.floor((x - PN_XMIN) / PN_DX);
  let x1 = x0 + 1;
  let y0 = Math.floor((y - PN_YMIN) / PN_DY);
  let y1 = y0 + 1;

  // Determine interpolation weights
  // Could also use higher order polynomial/s-curve here
  let sx = (x - x0 * PN_DX - PN_XMIN) / PN_DX;
  let sy = (y - y0 * PN_DY - PN_YMIN) / PN_DY;

  sx = Math.sin((sx - 0.5) * Math.PI) / 2 + 0.5;
  sy = Math.sin((sy - 0.5) * Math.PI) / 2 + 0.5;

  // Interpolate between grid point gradients
  let n0 = pn_dotGridGradient(x0, y0, x, y);
  let n1 = pn_dotGridGradient(x1, y0, x, y);
  let ix0 = pn_lerp(n0, n1, sx);

  n0 = pn_dotGridGradient(x0, y1, x, y);
  n1 = pn_dotGridGradient(x1, y1, x, y);
  let ix1 = pn_lerp(n0, n1, sx);

  let value = pn_lerp(ix0, ix1, sy);
  return value;
}