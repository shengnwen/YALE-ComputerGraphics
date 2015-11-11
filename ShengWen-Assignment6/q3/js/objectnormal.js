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
        var delta = 0.2
        if (diffZ != 0) {
            delta *= diffX / diffZ;
        }
        newnorm.x += delta;
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
