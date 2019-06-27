var RAYTRACING_LAMBDA = 30;
var RAYTRACING_PHI = 120;
var RAYTRACING_RR = 100000;



RAYTRACING_SOURCE = function() {
  var res = new Vector3D(
    Math.cos(RAYTRACING_LAMBDA * DEG_TO_RAD * 1.5) * Math.cos(RAYTRACING_PHI * DEG_TO_RAD * 1.1),
    Math.cos(RAYTRACING_LAMBDA * DEG_TO_RAD * 1.5) * Math.sin(RAYTRACING_PHI * DEG_TO_RAD * 1.1),
    Math.sin(RAYTRACING_LAMBDA * DEG_TO_RAD * 1.5));
  // var res = new Vector3D(1, 2, 1);
  res.mult(RAYTRACING_RR);
  return res;
}

RAYTRACING_LIGHT = function(center, normalVector) {
  var vect1 = RAYTRACING_SOURCE();
  vect1.sub(center);
  vect1.normalize();
  var cosalpha1 = vect1.dotProduct(normalVector);
  var coeff1 = (cosalpha1 + 1) / 2;
  // console.log(coeff1);

  var eyePos = PROJ_UZ.copy()
  eyePos.mult(PROJ_RR);
  eyePos.sub(center);
  eyePos.normalize();
  var cosalpha2 = eyePos.dotProduct(normalVector);
  var coeff2 = 1 - Math.abs(cosalpha1 - cosalpha2) / 2;


  return coeff1 * coeff2;
}