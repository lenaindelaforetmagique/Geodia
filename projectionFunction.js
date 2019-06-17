var PROJ_LAMBDA;
var PROJ_PHI;
var PROJ_RR;
var PROJ_UX = new Vector3D();
var PROJ_UY = new Vector3D();
var PROJ_UZ = new Vector3D();


PROJ_FUNCTION = function(vector) {
  var newX = PROJ_UX.dotProduct(vector);
  var newY = PROJ_UY.dotProduct(vector);
  var newZ = PROJ_UZ.dotProduct(vector);
  return [newX, newY, newZ];
}

var DEG_TO_RAD = Math.PI / 180;


PROJ_UPDATE_VECTORS = function() {
  PROJ_UZ = new Vector3D(
    Math.cos(PROJ_LAMBDA * DEG_TO_RAD) * Math.cos(PROJ_PHI * DEG_TO_RAD),
    Math.cos(PROJ_LAMBDA * DEG_TO_RAD) * Math.sin(PROJ_PHI * DEG_TO_RAD),
    Math.sin(PROJ_LAMBDA * DEG_TO_RAD));

  PROJ_UX.x = -PROJ_UZ.y;
  PROJ_UX.y = +PROJ_UZ.x;
  PROJ_UX.z = 0;

  PROJ_UX.normalize();

  // PROJ_UY = PROJ_UZ.crossProduct(PROJ_UX);
  PROJ_UY = PROJ_UX.crossProduct(PROJ_UZ);
}


PROJ_CHANGE_PHI = function(intensity = 0) {
  PROJ_PHI += intensity * 10;
  PROJ_UPDATE_VECTORS();
}

PROJ_CHANGE_LAMBDA = function(intensity = 0) {
  PROJ_LAMBDA += intensity * 10;
  PROJ_LAMBDA = Math.max(-90, Math.min(PROJ_LAMBDA, 90));
  PROJ_UPDATE_VECTORS();
}

// =============================================================================
PROJ_LAMBDA = 2;
PROJ_PHI = 15;
PROJ_UPDATE_VECTORS();