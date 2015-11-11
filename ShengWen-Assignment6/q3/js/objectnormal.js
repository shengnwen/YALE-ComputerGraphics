// for Assign 6
// Compute normal of object

function objectNormal(object, point) {

    if (object.type == 'sphere') return (sphereNormal(object, point));

    if (object.type == 'spheretex') {
        var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
        newnorm = Vector.unitVector(newnorm);
        diff = Math.cos(20 * 3.14159 * Math.abs(point.y - object.point.y) / object.radius)
        newnorm.y += .2 * diff;
        newnorm = Vector.unitVector(newnorm);
        return (newnorm);
    }
    if (object.type == 'spherelong') {
        var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
        newnorm = Vector.unitVector(newnorm);
        diffX = point.x - object.point.x;
        diffZ = point.z - object.point.z;
        if(Math.abs(diffZ)/object.radius <= 0.01|| Math.abs(diffX) / object.radius <= 0.01 || Math.abs(Math.abs(diffZ/diffX) - 1) <= 0.05) {
            newnorm.x *= 1.5;
            newnorm.z *= 1.5;
        } else {
            var tanVal = Math.abs(diffX / diffZ);
            if (Math.abs(tanVal - Math.tan(Math.PI / 12 * 2)) / Math.tan(Math.PI / 12 * 2) <= 0.05 || Math.abs(tanVal - Math.tan(Math.PI / 12 * 4)) / Math.tan(Math.PI / 12 * 4) <= 0.05 ||
                Math.abs(tanVal - Math.tan(Math.PI / 12)) / Math.tan(Math.PI / 12)<= 0.05 || Math.abs(tanVal - Math.tan(Math.PI / 12 * 5)) * Math.tan(Math.PI / 12 * 5) <= 0.05) {
                newnorm.x *= 1.5;
                newnorm.z *= 1.5;
            }
        }
        //if (diffZ == 0 || diffX == 0 ||
        //    Math.abs(Math.abs(diffX/diffZ) - Math.sqrt(3)) <= 0.03
        //    || Math.abs(Math.abs(diffX / diffZ) - 0.5) <= 0.03
        //    || Math.abs() <= 0.03) {
        //    newnorm.x *= 1.5;
        //    newnorm.z *= 1.5;
        //}
        //if (diffZ != 0) {
        //    delta *= diffX / diffZ;
        //}
        //newnorm.x += delta;
        newnorm = Vector.unitVector(newnorm);
        return (newnorm);
    }
    if (object.type == 'sphere3') {
        var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
        newnorm = Vector.unitVector(newnorm);
        diffX = Math.cos(20 * 3.14159 * Math.abs(point.x - object.point.x) / object.radius);
        diffY = Math.sin(20 * 3.14159 * Math.abs(point.y - object.point.y) / object.radius);
        newnorm.x += .2 * diffX;
        newnorm.y += .2 * diffY;
        newnorm = Vector.unitVector(newnorm);
        return (newnorm);
    }
    if (object.type == 'triangle') return (triNormal(object));

}
