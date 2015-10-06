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
        e.value = parseInt((start + end) / 2);
        return;

    } else {
        var n = parseFloat(e.value);
        if (n < start || n > end) {
            document.getElementById('info').innerHTML = "This input " +
                "should be between " +
                start + " and " +
                end;
            e.value = parseInt((start + end) / 2);
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
        y: 0,
        z: 2.6
    },
    fieldOfView: 45,
    vector: {
        x: 0,
        y: 0,
        z: 1
    }
};

// ## Lights
//
// Lights are defined only as points in space - surfaces that have lambert
// shading will be affected by any visible lights.
scene.lights = [{
    x: -30,
    y: -10,
    z: 20
}];

// ## Objects
//
// This raytracer handles sphere objects, with any color, position, radius,
// and surface properties.
scene.objects = [
    {
        type: 'sphere',
        point: {
            x: 0,
            y: 0,
            z: 0
        },
        color: {
            x: 0,
            y: 0,
            z: 0
        },
        specular: 0.2,
        lambert: 0.7,
        ambient: 0.1,
        radius: 2
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

    radius = parseFloat(document.getElementById("diameter").value) / 2;
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
    modifyScene();
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
        maxDepth = 2,
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
    var checkColor = function (p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
            return true;
        }
        return false;
    }

    var calColor = function (depth, centerX, centerY, delta) {
        color = [];
        var xcomp = Vector.scale(vpRight, ((centerX + delta) * pixelWidth) - halfWidth),
            ycomp = Vector.scale(vpUp, ((height - (centerY + delta)) * pixelHeight) - halfHeight);
        ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
        color.push(trace(ray, scene, 0));

        xcomp = Vector.scale(vpRight, ((centerX + delta) * pixelWidth) - halfWidth);
        ycomp = Vector.scale(vpUp, ((height - (centerY - delta)) * pixelHeight) - halfHeight);
        ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
        color.push(trace(ray, scene, 0));

        xcomp = Vector.scale(vpRight, ((centerX - delta) * pixelWidth) - halfWidth);
        ycomp = Vector.scale(vpUp, ((height - (centerY + delta)) * pixelHeight) - halfHeight);
        ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
        color.push(trace(ray, scene, 0));

        xcomp = Vector.scale(vpRight, ((centerX - delta) * pixelWidth) - halfWidth);
        ycomp = Vector.scale(vpUp, ((height - (centerY - delta)) * pixelHeight) - halfHeight);
        ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
        color.push(trace(ray, scene, 0));

        if (checkColor(color[0], color[1]) && checkColor(color[2], color[1])
            && checkColor(color[2], color[3])) {
            //if (color[0] == color[1] && color[1] == color[2] && color[2] == color[3]) {
            return color[0];
        } else if (depth == maxDepth) {
            var avg = {
                x: (color[0].x + color[1].x + color[2].x + color[3].x) / 4,
                y: (color[0].y + color[1].y + color[2].y + color[3].y) / 4,
                z: (color[0].z + color[1].z + color[2].z + color[3].z) / 4,
            }
            return avg;
        } else {

            delta *= 0.5;
            color = [];
            color.push(calColor(depth + 1,
                centerX + delta,
                centerY + delta, delta));

            color.push(calColor(depth + 1,
                centerX + delta,
                centerY - delta), delta);

            color.push(calColor(depth + 1,
                centerX - delta,
                centerY + delta, delta));
            color.push(calColor(depth + 1,
                centerX - delta,
                centerY - delta, delta));

            var avg = {
                x: (color[0].x + color[1].x + color[2].x + color[3].x) / 4,
                y: (color[0].y + color[1].y + color[2].y + color[3].y) / 4,
                z: (color[0].z + color[1].z + color[2].z + color[3].z) / 4,
            }
            return avg;
        }
    }
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            //var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
            //    ycomp = Vector.scale(vpUp, ((height- y) * pixelHeight) - halfHeight);
            //
            //ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));
            //color = trace(ray, scene, 0);
            color = calColor(1, x, y, 0.5);
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

    var distObject = intersectScene(ray, scene);

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
    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
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
        var object = scene.objects[i],
            dist = sphereIntersection(object, ray);
        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}

// ## Detecting collisions against a sphere
//
// ![](graphics/sphereintersection.png)
//
// Spheres are one of the simplest objects for rays to interact with, since
// the geometrical math for finding intersections and reflections with them
// is pretty straightforward.
function sphereIntersection(sphere, ray) {
    var eye_to_center = Vector.subtract(sphere.point, ray.point),
    // picture a triangle with one side going straight from the camera point
    // to the center of the sphere, another side being the vector.
    // the final side is a right angle.
    //
    // This equation first figures out the length of the vector side
        v = Vector.dotProduct(eye_to_center, ray.vector),
    // then the length of the straight from the camera to the center
    // of the sphere
        eoDot = Vector.dotProduct(eye_to_center, eye_to_center),
    // and compute a segment from the right angle of the triangle to a point
    // on the `v` line that also intersects the circle
        discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);
    // If the discriminant is negative, that means that the sphere hasn't
    // been hit by the ray
    if (discriminant < 0) {
        return;
    } else {
        // otherwise, we return the distance from the camera point to the sphere
        // `Math.sqrt(dotProduct(a, a))` is the length of a vector, so
        // `v - Math.sqrt(discriminant)` means the length of the the vector
        // just from the camera to the intersection point.
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

// # Surface
//
// ![](http://farm3.staticflickr.com/2851/10524788334_f2e3903b36_b.jpg)
//
// If `trace()` determines that a ray intersected with an object, `surface`
// decides what color it acquires from the interaction.
function surface(ray, scene, object, pointAtTime, normal, depth) {
    var b = object.color,
        c = Vector.ZERO,
        lambertAmount = 0;

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.
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
            c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
        }
    }


    lambertAmount = Math.min(1, lambertAmount);


    return Vector.add3(c,
        Vector.scale(b, lambertAmount * object.lambert),
        Vector.scale(b, object.ambient));
}

function isLightVisible(pt, scene, light) {
    var distObject = intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(pt, light))
    }, scene);
    return distObject[0] > -0.005;
}