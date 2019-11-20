var PROJ_LAMBDA; // latitude
var PROJ_PHI; // longitude
var PROJ_RR; // distance of screen
var PROJ_D; // distance of convergence point
var PROJ_UX = new Vector3D();
var PROJ_UY = new Vector3D();
var PROJ_UZ = new Vector3D();
var PROJ_UX_SIGN = 1;
var PROJ_EXPLODE;


PROJ_FUNCTION = function(vector) {
  var newX = PROJ_UX.dotProduct(vector);
  var newY = PROJ_UY.dotProduct(vector);
  var newZ = PROJ_UZ.dotProduct(vector);
  // console.log(newZ);
  let fact = PROJ_D / (PROJ_D + PROJ_RR - newZ) / (PROJ_D / (PROJ_D + PROJ_RR));
  return [newX * fact, newY * fact, newZ];
}

var DEG_TO_RAD = Math.PI / 180;


PROJ_UPDATE_VECTORS = function() {
  // console.log(PROJ_LAMBDA, PROJ_PHI);
  PROJ_UZ = new Vector3D(
    Math.cos(PROJ_LAMBDA * DEG_TO_RAD) * Math.cos(PROJ_PHI * DEG_TO_RAD),
    Math.cos(PROJ_LAMBDA * DEG_TO_RAD) * Math.sin(PROJ_PHI * DEG_TO_RAD),
    Math.sin(PROJ_LAMBDA * DEG_TO_RAD));

  PROJ_UX.x = -PROJ_UZ.y;
  PROJ_UX.y = +PROJ_UZ.x;
  PROJ_UX.z = 0;

  PROJ_UX.normalize();
  PROJ_UX.mult(PROJ_UX_SIGN);

  // PROJ_UY = PROJ_UZ.crossProduct(PROJ_UX);
  PROJ_UY = PROJ_UX.crossProduct(PROJ_UZ);

  // console.log(PROJ_LAMBDA, PROJ_PHI);
}

PROJ_CAMERA = function() {
  var res = PROJ_UZ.copy();
  res.mult(PROJ_RR);
  return res;
}

PROJ_CHANGE_D = function(intensity = 0) {
  PROJ_D += intensity * 10;
  PROJ_D = Math.max(10, PROJ_D);
}


PROJ_CHANGE_PHI = function(intensity = 0) {
  PROJ_PHI += intensity * 10 * PROJ_UX_SIGN;
  PROJ_UPDATE_VECTORS();
}

PROJ_CHANGE_LAMBDA = function(intensity = 0) {
  PROJ_LAMBDA += intensity * 10 * PROJ_UX_SIGN;
  if (PROJ_LAMBDA > 90) {
    PROJ_LAMBDA = 180 - PROJ_LAMBDA;
    PROJ_PHI += 180;
    PROJ_UX_SIGN *= -1;

  } else if (PROJ_LAMBDA < -90) {
    PROJ_LAMBDA = -180 - PROJ_LAMBDA;
    PROJ_PHI += 180;
    PROJ_UX_SIGN *= -1;
  }
  // PROJ_LAMBDA = Math.max(-90, Math.min(PROJ_LAMBDA, 90));
  PROJ_UPDATE_VECTORS();
}


PROJ_CHANGE_EXPLODE = function(intensity = 0) {
  PROJ_EXPLODE += intensity;
  PROJ_EXPLODE = Math.max(0, PROJ_EXPLODE);
  PROJ_EXPLODE = Math.min(600, PROJ_EXPLODE);
}

// =============================================================================
PROJ_LAMBDA = 10;
PROJ_PHI = 190;
PROJ_RR = 250;
PROJ_D = 1000;
PROJ_EXPLODE = 0;
PROJ_UPDATE_VECTORS();