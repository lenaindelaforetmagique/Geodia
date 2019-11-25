class Raytracing {
  constructor(parent_) {
    this.parent = parent_;
    this.lambda = 30;
    this.phi = 180;
    this.rr = 100000;

    this.position = new Vector3D();
    this.update_position();
  }

  update_position() {
    this.position = new Vector3D(
      Math.cos(this.lambda * DEG_TO_RAD) * Math.cos(this.phi * DEG_TO_RAD),
      Math.cos(this.lambda * DEG_TO_RAD) * Math.sin(this.phi * DEG_TO_RAD),
      Math.sin(this.lambda * DEG_TO_RAD));
    // var res = new Vector3D(1, 2, 1);
    this.position.mult(this.rr);
  }

  change_phi(intensity = 0) {
    this.phi += intensity * 10;
    this.update_position();
  }

  change_lambda(intensity = 0) {
    this.lambda += intensity * 10;
    this.update_position();
  }

  light(center, normalVector) {
    // Saturation
    var vect1 = this.position.copy();
    vect1.sub(center);
    vect1.normalize();
    var cosalpha1 = vect1.dotProduct(normalVector);
    var saturation = (cosalpha1 + 1) / 2;


    // Reflexion (LIGHT)
    // 1 - bissectrice
    var vect_object_source = this.position.copy();
    vect_object_source.sub(center);
    vect_object_source.normalize();
    var vect_object_eye = this.parent.camera.position.copy();
    vect_object_eye.sub(center);
    vect_object_eye.normalize();

    // 2 - angle avec normale
    vect_object_source.add(vect_object_eye);
    vect_object_source.normalize();
    var cosalpha3 = vect_object_source.dotProduct(normalVector);
    var light = Math.max(0, cosalpha3) ** 3;

    return [saturation, light];
  }
}