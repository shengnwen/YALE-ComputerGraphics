// for Assign 6
// Compute normal of object

function objectNormal(object, point){

if (object.type == 'sphere') return (sphereNormal (object, point));

if (object.type == 'spheretex'){
var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
newnorm=Vector.unitVector(newnorm);
diff = Math.cos(20*3.14159*Math.abs(point.y - object.point.y)/object.radius)
newnorm.y += .2*diff;
newnorm= Vector.unitVector(newnorm);
return (newnorm);
};

if (object.type == 'triangle') return (triNormal(object));

}
