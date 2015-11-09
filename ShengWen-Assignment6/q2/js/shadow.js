// This is the part that makes objects cast shadows on each other: from here
// we'd check to see if the area in a shadowy spot can 'see' a light, and when
// this returns `false`, we make the area shadowy.

function isLightVisible(pt, scene, light) {

    var distObject = intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(light, pt)) //  was pt light, direction reverse
    }, scene);
// correction visible if intersection is further than distance to light
    return (distObject[0] > Vector.length(Vector.subtract(light, pt)) - .005);   // was  > -0.005

}

function isSpotLightVisible(pt, scene, lightPoint, toPoint, angle) {
    // calculate angle
    var lightVec = Vector.unitVector(Vector.subtract(toPoint, lightPoint));
    var ptVec = Vector.unitVector(Vector.subtract(pt, lightPoint));
    var lightAngle = Math.acos(Vector.dotProduct(lightVec, ptVec));
    lightAngle = lightAngle * 180 / Math.PI;
    if (lightAngle > angle) {
        return false;
    }
    var distObject = intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(lightPoint, pt)) //  was pt light, direction reverse
    }, scene);
// correction visible if intersection is further than distance to light
    return (distObject[0] > Vector.length(Vector.subtract(lightPoint, pt)) - .005);   // was  > -0.005

}
