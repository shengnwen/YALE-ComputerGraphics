/**
 * Created by shengwen on 10/5/15.
 */

function checkRGB(e) {
    if (e.value == "") {
        e.value = 102;
        return;
    }
    var val = parseInt(e.value);
    if (val < 0) {
        val = 0;
        document.getElementById('info').innerHTML = "RGB value should be in 0 - 255!";
    } else if (val > 255) {
        val = 255;
        document.getElementById('info').innerHTML = "RGB value should be in 0 - 255!";
    } else {
        document.getElementById('info').innerHTML = "";
    }
    e.value = val;
}

function checkDir(e) {
    if (e.value == "") {
        e.value = 1;
    }
}

function checkNumber(e, start, end) {
    if (e.value == "") {
        document.getElementById('info').innerHTML = "This input value " +
            "should be between " +
            start + " and " +
            end;
        e.value = end;
        return;

    } else {
        var n = parseFloat(e.value);
        if (n < start || n > end) {
            document.getElementById('info').innerHTML = "This input diameter" +
                "should be between " +
                start + " and " +
                end;
            e.value = end;
            return;
        } else {
            e.value = n;
        }
    }
}

var radius;
var r, g, b;
var lx, ly, lz;
var c, ctx;
var scene = {};
scene.camera = {
    point: {
        x: 0,
        y: 1,
        z: 20
    },
    fieldOfView: 45,
    vector: {
        //x: -4,
        //y: -3,
        //z: 4

        x: 0,
        y: 1,
        z: 0
    }
};

// ## Lights
//
// Lights are defined only as points in space - surfaces that have lambert
// shading will be affected by any visible lights.
scene.lights = [{
    x: 0,
    y: 3,
    z: 8
}];

// ## Objects
//
// This raytracer handles sphere objects, with any color, position, radius,
// and surface properties.
scene.objects = [
    //{
    //    type: 'sphere',
    //    point: {
    //        x: 0,
    //        y: 6,
    //        z: 2
    //    },
    //    color: {
    //        x: 133,
    //        y: 233,
    //        z: 255
    //    },
    //    specular: 0.2,
    //    lambert: 0.7,
    //    ambient: 0.1,
    //    radius: 1.5
    //},
    {
        type:'triangle',
        point1:{
            x:0,
            y:0,
            z:-5
        },
        point2:{
            x:1,
            y:0,
            z:5
        },
        point3:{
            x:0,
            y:0,
            z:10
        },
        color:{
            x:153,
            y:102,
            z:255
        },
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.1,
        radius: 1
    }
    ,
    {
        type:'cone',
        center: {
            x: 0,
            y: 2,
            z: 0
        },
        color:{
            x: 255,
            y:255,
            z: 0
        },
        height: 6,
        radius: 1,
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.3
    }
];

function modifyScene() {

    r = parseInt(document.getElementById('rVal').value);
    g = parseInt(document.getElementById('gVal').value);
    b = parseInt(document.getElementById('bVal').value);

    lx = parseFloat(document.getElementById('lXVal').value);
    ly = parseFloat(document.getElementById('lYVal').value);
    lz = parseFloat(document.getElementById('lZVal').value);

    // change x,y,z vector;

    radius = parseFloat(document.getElementById("diameter").value)/2;
    scene.objects[0].radius = radius;
    scene.objects[0].color.x = r;
    scene.objects[0].color.y = g;
    scene.objects[0].color.z = b;

    var lr = Math.sqrt(lx * lx + ly * ly + lz * lz);
    if (lr < radius) {
        document.getElementById('info').innerHTML = "The light is inside the sphere!!!";
    } else {
        document.getElementById('info').innerHTML = "";
    }
    scene.lights[0].x = lx;
    scene.lights[0].y = ly;
    scene.lights[0].z = lz;
}


function draw() {
    //modifyScene();
    render(scene);
}


var c = document.getElementById('my_canvas');
var width = parseInt(c.width), height = parseInt(c.height);
var ctx = c.getContext('2d'),
    data = ctx.getImageData(0, 0, width, height);




// # Throwing Rays
//
// This is one part where we can't follow nature exactly: technically photons
// come out of lights, bounce off of objects, and then some hit the 'eye'
// and many don't. Simulating this - sending rays in all directions out of
// each light and most not having any real effect - would be too inefficient.
//
// Luckily, the reverse is more efficient and has practically the same result -
// instead of rays going 'from' lights to the eye, we follow rays from the eye
// and see if they end up hitting any features and lights on their travels.
//
// For each pixel in the canvas, there needs to be at least one ray of light
// that determines its color by bouncing through the scene.
function render(scene) {
    // first 'unpack' the scene to make it easier to reference
    var camera = scene.camera,
        objects = scene.objects,
        lights = scene.lights;

    // This process
    // is a bit odd, because there's a disconnect between pixels and vectors:
    // given the left and right, top and bottom rays, the rays we shoot are just
    // interpolated between them in little increments.
    //
    // Starting with the height and width of the scene, the camera's place,
    // direction, and field of view, we calculate factors that create
    // `width*height` vectors for each ray

    // Start by creating a simple vector pointing in the direction the camera is
    // pointing - a unit vector
    var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),

    // and then we'll rotate this by combining it with a version that's turned
    // 90° right and one that's turned 90° up. Since the [cross product](http://en.wikipedia.org/wiki/Cross_product)
    // takes two vectors and creates a third that's perpendicular to both,
    // we use a pure 'UP' vector to turn the camera right, and that 'right'
    // vector to turn the camera up.
        vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
        vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),

    // The actual ending pixel dimensions of the image aren't important here -
    // note that `width` and `height` are in pixels, but the numbers we compute
    // here are just based on the ratio between them, `height/width`, and the
    // `fieldOfView` of the camera.
        fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);

    var index, color;
    var ray = {
        point: camera.point
    };
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            //console.log("\n\n x:" + x + " y:" + y + "\n\n");
            // turn the raw pixel `x` and `y` values into values from -1 to 1
            // and use these values to scale the facing-right and facing-up
            // vectors so that we generate versions of the `eyeVector` that are
            // skewed in each necessary direction.
            var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
                ycomp = Vector.scale(vpUp, ((height- y) * pixelHeight) - halfHeight);

            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

            // use the vector generated to raytrace the scene, returning a color
            // as a `{x, y, z}` vector of RGB values
            color = trace(ray, scene, 0);
            index = (x * 4) + (y * width * 4),
                data.data[index + 0] = color.x;
            data.data[index + 1] = color.y;
            data.data[index + 2] = color.z;
            data.data[index + 3] = 255;
        }
    }

    // Now that each ray has returned and populated the `data` array with
    // correctly lit colors, fill the canvas with the generated data.
    ctx.putImageData(data, 0, 0);
}

// # Trace
//
// Given a ray, shoot it until it hits an object and return that object's color,
// or `Vector.WHITE` if no object is found. This is the main function that's
// called in order to draw the image, and it recurses into itself if rays
// reflect off of objects and acquire more color.
function trace(ray, scene, depth) {
    // This is a recursive method: if we hit something that's reflective,
    // then the call to `surface()` at the bottom will return here and try
    // to find what the ray reflected into. Since this could easily go
    // on forever, first check that we haven't gone more than three bounces
    // into a reflection.
    if (depth > 3) return;
    //console.log("intersect fun start");
    var distObject = intersectScene(ray, scene);
    //console.log("intersect fun end");
    // If we don't hit anything, fill this pixel with the background color -
    // in this case, white.
    if (distObject[0] === Infinity) {
        return Vector.WHITE;
    }

    var dist = distObject[0],
        object = distObject[1];

    // The `pointAtTime` is another way of saying the 'intersection point'
    // of this ray into this object. We compute this by simply taking
    // the direction of the ray and making it as long as the distance
    // returned by the intersection check.
    //console.log("scale start!");
    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));
    //console.log("scale done!");
    //return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
    return surface(ray, scene, object, pointAtTime, objectNormal(object, pointAtTime), depth);
}

// # Detecting collisions against all objects
//
// Given a ray, let's figure out whether it hits anything, and if so,
// what's the closest thing it hits.
function intersectScene(ray, scene) {
    // The base case is that it hits nothing, and travels for `Infinity`
    var closest = [Infinity, null];
    // But for each object, we check whether it has any intersection,
    // and compare that intersection - is it closer than `Infinity` at first,
    // and then is it closer than other objects that have been hit?
    for (var i = 0; i < scene.objects.length; i++) {
        var object = scene.objects[i], dist;
        if (object.type == 'sphere') {
            dist= sphereIntersection(object, ray);
        } else if (object.type == 'triangle') {
            dist = triangleIntersection(object, ray);
        } else if (object.type == 'cone') {
            dist = coneIntersection(object, ray);
        }
        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}

function coneIntersection(cone, ray) {
    var P_O = Vector.subtract(ray.point, Vector.ZERO);
    var po = Math.sqrt(Vector.dotProduct(P_O, P_O));
    var sinAlpha = cone.radius / Math.sqrt(cone.radius * cone.radius + cone.height * cone.height);
    var yAxis = Vector.UP;
    var sinBetaAndAlpha = Math.sqrt(ray.point.x * ray.point.x + ray.point.z * ray.point.z) / po;
    var sinBeta = sinBetaAndAlpha * Math.sqrt(1 - sinAlpha * sinAlpha)
        - Math.sqrt(1 - sinBetaAndAlpha * sinBetaAndAlpha) * sinAlpha;
    var O_P = Vector.subtract(Vector.ZERO, ray.point);
    var cosGamma = Vector.dotProduct(O_P, ray.vector) / po;
    var sinGammaAndBeta = Math.sqrt(1 - cosGamma * cosGamma) * Math.sqrt(1 - sinBeta * sinBeta) + cosGamma*sinBeta;
    var t = po * sinBeta / sinGammaAndBeta;
    //console.log("t:" + t);
    //console.log("intersec done");
    if (t < 0) {
        return;
    }
    var P_Q = Vector.add(ray.point, Vector.scale(ray.vector, t));
    if (P_Q.y > cone.height || P_Q.y < 0) {
        return;
    } if (P_Q.y == cone.height) {
        if (P_Q.x * P_Q.x + P_Q.z * P_Q.z <= cone.radius * cone.radius) {
            return t;
        } else {
            return;
        }
    }
    var a = 4 * (ray.vector.x * ray.vector.x) + 4 * (ray.vector.z * ray.vector.z) - (ray.vector.y * ray.vector.y);
    var b = 2 * (4 * ray.vector.x * ray.point.x + 4 * ray.vector.z*ray.point.z - ray.vector.y*ray.point.y);
    var c = 4 * ray.point.x * ray.point.x + 4 * ray.point.z * ray.point.z - ray.point.y * ray.point.y;

    if (a < 0) {
        a = -a;
        b = -b;
        c = -c;
    }
    if (b*b - 4 * a * c < 0) {
        return;
    } else if( c > 0 && (-b * a < 0)) {
        return;
    }
    return t;
}

function triangleIntersection(triangle, ray) {
    var B_A = Vector.subtract(triangle.point2, triangle.point1);
    var C_A = Vector.subtract(triangle.point3, triangle.point1);
    var A_C = Vector.subtract(triangle.point1, triangle.point3);
    var n = Vector.crossProduct(B_A, C_A);
    var perAB = Vector.crossProduct(n, B_A);
    perAB = Vector.scale(perAB, 1/ Vector.dotProduct(C_A, perAB));
    var perAC = Vector.crossProduct(n, A_C);
    perAC = Vector.scale(perAC, 1/Vector.dotProduct(B_A, perAC));

    var u = Vector.dotProduct(n, ray.vector);
    var t = Vector.dotProduct(Vector.subtract(triangle.point1, ray.point), n) / u;
    if (t < 0) {
        return;
    }
    var Q = Vector.add(ray.point, Vector.scale(ray.vector, t));
    var Q_C = Vector.subtract(Q, triangle.point3);
    var gamma = Vector.dotProduct(Q_C, perAC);
    var Q_B = Vector.subtract(Q, triangle.point2);
    var beta = Vector.dotProduct(Q_B, perAB);
    var alpha = 1 - gamma - beta;
    if (gamma < 0 || beta < 0 || alpha < 0) {
        return;
    } else {
        return t;
    }
}



function sphereIntersection(sphere, ray) {
    var eye_to_center = Vector.subtract(sphere.point, ray.point),
        v = Vector.dotProduct(eye_to_center, ray.vector),
        eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
        discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);
    if (discriminant < 0) {
        return;
    } else {
        return v - Math.sqrt(discriminant);
    }
}

// A normal is, at each point on the surface of a sphere or some other object,
// a vector that's perpendicular to the surface and radiates outward. We need
// to know this so that we can calculate the way that a ray reflects off of
// a sphere.
function sphereNormal(sphere, pos) {
    return Vector.unitVector(
        Vector.subtract(pos, sphere.point));
}

function objectNormal(object, pos) {
    //console.log("normal start");
    //console.log("pos:x:" + pos.x + " y:" + pos.y + " z:" + pos.z);
    if (object.type == 'sphere') {
        return Vector.unitVector(
            Vector.subtract(pos, object.point));
    } else if (object.type == 'triangle') {
        var B_A = Vector.subtract(object.point2, object.point1);
        var C_A = Vector.subtract(object.point3, object.point1);
        var n = Vector.crossProduct(B_A, C_A);
        return Vector.scale(Vector.unitVector(n), -1);
    } else if (object.type=='cone') {
        var Q_O = Vector.subtract(pos, Vector.ZERO);
        var relCenter = {x:0, y:0, z:pos.z};
        var Q_relCenter = Vector.subtract(pos, relCenter);
        var yAxis = Vector.UP;
        var Q_tanLine = Vector.crossProduct(Q_relCenter, yAxis);
        var n = Vector.crossProduct(Q_O, Q_tanLine);
        //if (n.y > 0) {
        //    //console.log("scale n!");
        //    n = Vector.scale(n, -1)
        //    //console.log("scale n success!");
        //}
        //else if (n.x == 0 && n.y == 0 && n.z == 0) {
        //    n = Vector.unitVector(scene.lights[0])
        //}
        n = Vector.scale(n, -1)
        //console.log("n:x:" + n.x + ", y:" + n.y + ", z:" + n.z);
        //console.log("normal done!");
        return Vector.unitVector(n)
    }

}


function surface(ray, scene, object, pointAtTime, normal, depth) {
    var b = object.color,
        c = Vector.ZERO,
        lambertAmount = 0;

    if (object.lambert) {
        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[0];

            if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;

            var contribution = Vector.dotProduct(Vector.unitVector(
                Vector.subtract(lightPoint, pointAtTime)), normal);

            if (contribution > 0) lambertAmount += contribution;
        }
    }

    if (object.specular) {

        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal)
        };
        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
            //console.log("scale start!");
            c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
            //console.log("scale done!");
        }
    }


    lambertAmount = Math.min(1, lambertAmount);


    return Vector.add3(c,
        Vector.scale(b, lambertAmount * object.lambert),
        Vector.scale(b, object.ambient));
}

function isLightVisible(pt, scene, light) {
    //console.log("pt:x:" + pt.x + " ,y:" + pt.y + " , z:" + pt.z);
    var distObject =  intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(pt, light))
    }, scene);
    return distObject[0] > -0.005;
}
