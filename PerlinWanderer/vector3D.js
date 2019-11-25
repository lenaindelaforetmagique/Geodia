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

  rotate(u_, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let a11 = Math.pow(u_.x, 2) * (1 - c) + c;
    let a12 = u_.x * u_.y * (1 - c) - u_.z * s;
    let a13 = u_.x * u_.z * (1 - c) + u_.y * s;
    let a21 = u_.x * u_.y * (1 - c) + u_.z * s;
    let a22 = Math.pow(u_.y, 2) * (1 - c) + c;;
    let a23 = u_.y * u_.z * (1 - c) - u_.x * s;
    let a31 = u_.x * u_.z * (1 - c) - u_.y * s;
    let a32 = u_.y * u_.z * (1 - c) + u_.x * s;
    let a33 = Math.pow(u_.z, 2) * (1 - c) + c;;

    let newX = this.x * a11 + this.y * a12 + this.z * a13;
    let newY = this.x * a21 + this.y * a22 + this.z * a23;
    let newZ = this.x * a31 + this.y * a32 + this.z * a33;
    this.x = newX;
    this.y = newY;
    this.z = newZ;
  }

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