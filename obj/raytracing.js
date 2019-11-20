var RAYTRACING_LAMBDA = 30;
var RAYTRACING_PHI = 180;
var RAYTRACING_RR = 100000;



RAYTRACING_SOURCE = function() {
  var res = new Vector3D(
    Math.cos(RAYTRACING_LAMBDA * DEG_TO_RAD) * Math.cos(RAYTRACING_PHI * DEG_TO_RAD),
    Math.cos(RAYTRACING_LAMBDA * DEG_TO_RAD) * Math.sin(RAYTRACING_PHI * DEG_TO_RAD),
    Math.sin(RAYTRACING_LAMBDA * DEG_TO_RAD));
  // var res = new Vector3D(1, 2, 1);
  res.mult(RAYTRACING_RR);
  return res;
}



RAYTRACING_CHANGE_PHI = function(intensity = 0) {
  RAYTRACING_PHI += intensity * 10;
}

RAYTRACING_CHANGE_LAMBDA = function(intensity = 0) {
  RAYTRACING_LAMBDA += intensity * 10;
}






RAYTRACING_LIGHT = function(center, normalVector) {
  // Saturation
  var vect1 = RAYTRACING_SOURCE();
  vect1.sub(center);
  vect1.normalize();
  var cosalpha1 = vect1.dotProduct(normalVector);
  var saturation = (cosalpha1 + 1) / 2;


  // Reflexion (LIGHT)
  // 1 - bissectrice
  var vect_object_source = RAYTRACING_SOURCE();
  vect_object_source.sub(center);
  vect_object_source.normalize();
  var vect_object_eye = PROJ_CAMERA();
  vect_object_eye.sub(center);
  vect_object_eye.normalize();

  // 2 - angle avec normale
  vect_object_source.add(vect_object_eye);
  vect_object_source.normalize();
  var cosalpha3 = vect_object_source.dotProduct(normalVector);
  var light = Math.max(0, cosalpha3) ** 3;


  return [saturation, light];
}