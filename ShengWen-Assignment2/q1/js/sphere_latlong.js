/**
 * Created by shengwen on 9/22/15.
 */


//function Sphere_Latlong (resolution, res) {
//
//    //this.name = "cone";
//    //
//    //// vertices definition
//    //////////////////////////////////////////////////////////////
//    //
//    //this.vertices = new Float32Array(3*(resolution+2));
//    //
//    //// apex of the cone
//    //this.vertices[0] = 0.0;
//    //this.vertices[1] = 2.0;
//    //this.vertices[2] = 0.0;
//    //
//    //// base of the cone
//    //var radius = 1.0;
//    //var angle;
//    //var step = 6.283185307179586476925286766559 / resolution;
//    //
//    //var vertexoffset = 3;
//    //for (var i = 0; i < resolution; i++) {
//    //
//    //    angle = step * i;
//    //
//    //    this.vertices[vertexoffset] = radius * Math.cos(angle);
//    //    this.vertices[vertexoffset+1] = 0.0;
//    //    this.vertices[vertexoffset+2] = radius * Math.sin(angle);
//    //    vertexoffset += 3;
//    //}
//    //
//    //this.vertices[vertexoffset] = 0.0;
//    //this.vertices[vertexoffset+1] = 0.0;
//    //this.vertices[vertexoffset+2] = 0.0;
//    //
//    //// triangles defition
//    //////////////////////////////////////////////////////////////
//    //
//    //this.triangleIndices = new Uint16Array(3*2*resolution);
//    //
//    //// lateral surface
//    //var triangleoffset = 0;
//    //for (var i = 0; i < resolution; i++) {
//    //
//    //    this.triangleIndices[triangleoffset] = 0;
//    //    this.triangleIndices[triangleoffset+1] = 1 + (i % resolution);
//    //    this.triangleIndices[triangleoffset+2] = 1 + ((i+1) % resolution);
//    //    triangleoffset += 3;
//    //}
//    //
//    //// bottom part of the cone
//    //for (var i = 0; i < resolution; i++) {
//    //
//    //    this.triangleIndices[triangleoffset] = resolution+1;
//    //    this.triangleIndices[triangleoffset+1] = 1 + (i % resolution);
//    //    this.triangleIndices[triangleoffset+2] = 1 + ((i+1) % resolution);
//    //    triangleoffset += 3;
//    //}
//    //
//    //this.numVertices = this.vertices.length/3;
//    //this.numTriangles = this.triangleIndices.length/3;
//}
function Sphere_Latlong(aziNum, eleNum) {
    this.name = "sphere_latlong";

    var radius = 2.0;
    this.aziNum = aziNum;
    this.eleNum = eleNum;

    // not use this ways to calculate
    //!x = r sinθ cosφ
    //!y = r cosθ
    //!z = r sinθ sinφ

    // x= r cosθ cosφ
    // y = r sinθ
    // z = r cosθ sinφ
    this.vertices = new Float32Array(3 * aziNum * eleNum);
    var theta = Math.PI * 2 / this.eleNum;
    var phi = Math.PI * 2 / this.aziNum;
    for (var lat = 0; lat < this.eleNum; lat++) {
        for (var lon = 0; lon < this.aziNum; lon++) {
            var index = 3 *(lat * this.aziNum + lon);
            this.vertices[index] = radius * Math.cos(theta * lat) * Math.cos(phi * lon);
            this.vertices[index + 1] = radius * Math.sin(theta * lat);
            this.vertices[index + 2] = radius * Math.cos(theta * lat) * Math.sin(phi * lon);
        }
    }

    this.triangleIndices = new Uint16Array(3 * 2 * aziNum * eleNum);
    this.calculateVerticeIndex = function(lat, lon) {
        return lat*this.aziNum + lon;
    };

    var triangleOffset = 0;
    for (var lat = 0; lat < eleNum; lat++) {
        for (var lon = 0; lon < aziNum; lon++) {
            var index = this.calculateVerticeIndex(lat,lon);
            this.triangleIndices[triangleOffset] = index;
            this.triangleIndices[triangleOffset + 1] = this.calculateVerticeIndex((lat + 1) % eleNum, lon);
            this.triangleIndices[triangleOffset + 2] = this.calculateVerticeIndex((lat + 1) % eleNum, (lon + 1) % aziNum);
            this.triangleIndices[triangleOffset + 3] = index;
            this.triangleIndices[triangleOffset + 4] = this.calculateVerticeIndex((lat + 1) % eleNum, lon);
            this.triangleIndices[triangleOffset + 5] = this.calculateVerticeIndex((lat + 1) % eleNum, (lon - 1) % aziNum);
            triangleOffset += 6;
        }
    }



    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}

function checkNumber(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "You must enter a valid integer!";
        e.value = 20;
        return;
    }

    var n = parseInt(e.value);
    if (n <= 1) {
        document.getElementById("info").innerHTML = "You must enter a positive integer( > 1)!";
        e.value = 20;
        return;
    }
    e.value = n;
    document.getElementById("info").innerHTML = "";
}
