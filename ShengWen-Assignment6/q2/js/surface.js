// # Surface
//

// If `trace()` determines that a ray intersected with an object, `surface`
// decides what color it acquires from the interaction.

//updated for Assn 6 to have types for lights and colors for lambertAmount to account for light colors

function surface(ray, scene, object, pointAtTime, normal, depth) {

    var objColor = scene.mats[object.mat].color,
        c = Vector.ZERO,
        specReflect = Vector.ZERO,
        lambertAmount = Vector.ZERO;

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.

    scene.mats[5].n = Number(document.getElementById('exponentN').value);
    scene.mats[5].metal = (document.getElementById('isMetal').value == "True")?1:0;


    if (scene.mats[object.mat].lambert) {
        for (var i = 0; i < scene.lights.length; i++) {
            var lightPoint = scene.lights[i].point;

            // First: can we see the light? If not, this is a shadowy area
            // and it gets no light from the lambert shading process.
            switch (scene.lights[i].type) {
                case 'omni':
                {
                    if (isLightVisible(pointAtTime, scene, lightPoint)) {
                        // Otherwise, calculate the lambertian reflectance, which
                        // essentially is a 'diffuse' lighting system - direct light
                        // is bright, and from there, less direct light is gradually,
                        // beautifully, less light.

                        var contribution = Vector.dotProduct(Vector.unitVector(
                            Vector.subtract(lightPoint, pointAtTime)), normal);
                        if (contribution > 0) lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.lights[i].color, contribution));
                    }
                }
                    break;
                case 'spot':
                {
                    var toPoint = scene.lights[i].topoint;
                    var angle = scene.lights[i].angle;
                    if (isSpotLightVisible(pointAtTime, scene, lightPoint, toPoint, angle)) {
                        // Otherwise, calculate the lambertian reflectance, which
                        // essentially is a 'diffuse' lighting system - direct light
                        // is bright, and from there, less direct light is gradually,
                        // beautifully, less light.

                        var contribution = Vector.dotProduct(Vector.unitVector(
                            Vector.subtract(lightPoint, pointAtTime)), normal);
                        if (contribution > 0) lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.lights[i].color, contribution));
                    }
                }
                    break;
                case 'spherical':{
                    // sample 25 points in sphere as normal omni light
                    var theta = 0, phi = 0, r = scene.lights[i].radius;
                    var subLights = [];
                    for (var al = 0; al < 5; al++) {
                        theta += Math.PI / 6;
                        for (var lon = 0; lon < 5; lon++) {
                            // generate omni point
                            phi += Math.PI / 3;
                            var newLight = {};
                            newLight.x = r * Math.sin(theta) * Math.cos(phi) + lightPoint.x;
                            newLight.y = r * Math.sin(theta) * Math.sin(phi) + lightPoint.y;
                            newLight.z = r * Math.cos(theta) + lightPoint.z;
                            subLights.push(newLight);
                            if (isLightVisible(pointAtTime, scene, newLight)) {
                                // Otherwise, calculate the lambertian reflectance, which
                                // essentially is a 'diffuse' lighting system - direct light
                                // is bright, and from there, less direct light is gradually,
                                // beautifully, less light.

                                var contribution = Vector.dotProduct(Vector.unitVector(
                                    Vector.subtract(newLight, pointAtTime)), normal);
                                if (contribution > 0) lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.lights[i].color, contribution));
                            }
                        }
                    }

                }break;
            }


        }
    }


    // for assn 6, adjust lit color by object color and divide by 255 since light color is 0 to 255
    lambertAmount = Vector.compScale(lambertAmount, objColor);
    lambertAmount = Vector.scale(lambertAmount, scene.mats[object.mat].lambert);
    lambertAmount = Vector.scale(lambertAmount, 1. / 255.);

    // **[Specular](https://en.wikipedia.org/wiki/Specular_reflection)** is a fancy word for 'reflective': rays that hit objects
    // with specular surfaces bounce off and acquire the colors of other objects
    // they bounce into.
    //   if (object.specular) {
    if (scene.mats[object.mat].specular) {

        // This is basically the same thing as what we did in `render()`, just
        // instead of looking from the viewpoint of the camera, we're looking
        // from a point on the surface of a shiny object, seeing what it sees
        // and making that part of a reflection.
        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(Vector.scale(ray.vector, -1), normal)
        };

        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
            //     specReflect = Vector.add(specReflect, Vector.scale(reflectedColor, scene.mats[object.mat].specular));
            //  alert(specReflect.x);
            c = Vector.add(c, Vector.scale(reflectedColor, scene.mats[object.mat].specular));
        }
    }

    // lambert should never 'blow out' the lighting of an object,
    // even if the ray bounces between a lot of things and hits lights
//updated for Assn 6 lambertAmount is scaled and clamped
    //   lambertAmount = Vector.scale(lambertAmount, 1./255.);
//    lambertAmount = Math.min(1, lambertAmount);

    // **Ambient** colors shine bright regardless of whether there's a light visible -
    // a circle with a totally ambient blue color will always just be a flat blue
    // circle.
    return Vector.add3(c,
        //  Vector.scale(b, lambertAmount * object.lambert),
        lambertAmount,
        Vector.scale(objColor, scene.mats[object.mat].ambient));
}


