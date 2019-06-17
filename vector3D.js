//-----------------------------------------------------------------------------
class Vector3D {
  constructor(x_ = 0, y_ = 0, z_ = 0) {
    this.x = x_;
    this.y = y_;
    this.z = z_;
  }

  copy() {
    return new Vector3D(this.x, this.y, this.z);
  }

  norm() {
    let res = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    return res;
  }

  normalize() {
    let norm_ = this.norm();
    if (norm_ > 0) {
      this.x /= norm_;
      this.y /= norm_;
      this.z /= norm_;
    }
  }

  forceNorm(newVal) {
    this.normalize();
    this.mult(newVal);
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }

  mult(scal) {
    this.x *= scal;
    this.y *= scal;
    this.z *= scal;
  }

  div(scal) {
    this.x /= scal;
    this.y /= scal;
    this.z /= scal;
  }

  limitNorm(maxNorm) {
    let norm_ = this.norm();
    if (norm_ > maxNorm) {
      this.mult(maxNorm / norm_);
    }
  }

  dotProduct(other) {
    let res = 0;
    res += this.x * other.x;
    res += this.y * other.y;
    res += this.z * other.z;
    return res;
  }

  crossProduct(other) {
    return new Vector3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x);
  }

  // rotate(angle) {
  //   let new_x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  //   let new_y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
  //   this.x = new_x;
  //   this.y = new_y;
  // }

  // domRepr() {
  //   let result = document.createElementNS(SVGNS, 'ellipse');
  //   result.setAttribute('fill', "blue");
  //   // result.setAttribute('stroke', "white");
  //   result.setAttribute('rx', 2);
  //   result.setAttribute('ry', 2);
  //   result.setAttribute('cx', this.x);
  //   result.setAttribute('cy', this.y);
  //   return result;
  // }
}

distance = function(vect1, vect2) {
  let res = vect1.copy();
  res.sub(vect2);
  return res.norm();
}

// angle = function(vect1, vect2) {
//   // returns the angle between vect1 and vect2
//   let v1 = vect1.copy();
//   let v2 = vect2.copy();
//   v1.normalize();
//   v2.normalize();
//   let sin = v1.crossProduct(v2);
//   let cos = v1.dotProduct(v2);
//   let theta = Math.acos(cos);
//   if (sin < 0) {
//     theta *= -1;
//   }
//   return theta;
// }