var DEG_TO_RAD = Math.PI / 180;

class Camera {
  constructor(parent_) {
    this.parent = parent_;
    this.lambda = 10; // latitude
    this.phi = 190; // longitude
    this.lambda = 30; // latitude
    this.phi = 0; // longitude
    this.rr = 1; // distance of screen
    this.d = 1; // distance of convergence point
    this.ux = new Vector3D(-1, 1, 0);
    this.uy = new Vector3D(0, 0, -1);
    this.uz = new Vector3D(-1, -1, 0);
    this.ux.normalize();
    this.uz.normalize();

    this.ux_sign = 1;

    this.position = new Vector3D(0, 0, 0);
    this.longSpeed = -1;

    // this.update_vectors();
    // this.position = this.uz.copy();
    this.position.mult(1000);
    // console.log(this.position);
  }

  update() {
    // console.log(this.position);
    // this.change_phi(0.005);

    // let dz = this.uz.copy();
    // dz.mult(this.longSpeed);
    // this.position.add(dz);

    // this.update_vectors();
  }

  PROJ_FUNCTION(vector) {
    let vect2 = vector.copy();
    // console.log("la");
    // console.log(this.position);
    vect2.sub(this.position);
    var newX = this.ux.dotProduct(vect2);
    var newY = this.uy.dotProduct(vect2);
    var newZ = this.uz.dotProduct(vect2);
    // console.log(newZ);
    // let fact = this.d / (this.d + this.rr - newZ) / (this.d / (this.d + this.rr));
    let fact = (this.d + this.rr) / (this.d + this.rr - newZ);
    return [newX * fact, newY * fact, newZ];
  }

  isVisible(polygon) {
    let res = true;
    for (let node of polygon.nodes) {
      let projPos = this.PROJ_FUNCTION(node.position);
      res &= (projPos[2] < 2);
    }
    return res;
  }

  update_vectors() {
    // console.log(this.lambda, this.phi);
    this.uz = new Vector3D(
      Math.cos(this.lambda * DEG_TO_RAD) * Math.cos(this.phi * DEG_TO_RAD),
      Math.cos(this.lambda * DEG_TO_RAD) * Math.sin(this.phi * DEG_TO_RAD),
      Math.sin(this.lambda * DEG_TO_RAD));

    this.ux.x = -this.uz.y;
    this.ux.y = +this.uz.x;
    this.ux.z = 0;

    this.ux.normalize();
    this.ux.mult(this.ux_sign);

    this.uy = this.ux.crossProduct(this.uz);

    // console.log(this.lambda, this.phi);
  }

  set_lat(alpha) {
    // alpha [0;1] for [+90,-90]
    // coupled with rotate ux
    alpha = (90 - 180 * alpha) * DEG_TO_RAD;
    let curLat = Math.asin(this.uz.z);
    this.rotate_ux(-(alpha + curLat));
  }

  set_long(alpha) {
    // alpha [0;1] for [-360,+360]
    // coupled with rotate Z
    alpha = (360 * 3 * alpha) * DEG_TO_RAD;
    // console.log(alpha);
    let uz2 = this.uz.copy();
    uz2.z = 0;
    uz2.normalize();
    let curLong = Math.acos(uz2.y);

    if (uz2.x < 0) {
      curLong *= -1;
    }
    // console.log(curLong);
    this.rotate_Z(alpha + curLong);
  }



  rotate_ux(angle = 0) {
    this.uy.rotate(this.ux, angle);
    this.uz.rotate(this.ux, angle);
  }

  rotate_uz(angle) {
    this.ux.rotate(this.uz, angle);
    this.uy.rotate(this.uz, angle);
  }

  rotate_Z(angle) {
    let globalZ = new Vector3D(0, 0, 1);
    this.ux.rotate(globalZ, angle);
    this.uy.rotate(globalZ, angle);
    this.uz.rotate(globalZ, angle);
  }


  moveX(intensity = 0) {
    let dx = this.ux.copy();
    dx.z = 0;
    dx.normalize();
    dx.mult(intensity);
    this.position.add(dx);
  }

  moveZ(intensity = 0) {
    let dz = this.uz.copy();
    dz.z = 0;
    dz.normalize();
    dz.mult(intensity);
    this.position.add(dz);
  }

  change_d(intensity = 0) {
    this.d += intensity * 10;
    this.d = Math.max(0.1, this.d);
  }


  change_phi(intensity = 0) {
    this.phi += intensity * 0 * this.ux_sign;
  }

  change_lambda(intensity = 0) {
    this.lambda += intensity * 0 * this.ux_sign;
    if (this.lambda > 90) {
      this.lambda = 180 - this.lambda;
      this.phi += 180;
      this.ux_sign *= -1;

    } else if (this.lambda < -90) {
      this.lambda = -180 - this.lambda;
      this.phi += 180;
      this.ux_sign *= -1;
    }
    // this.lambda = Math.max(-90, Math.min(this.lambda, 90));
  }
}