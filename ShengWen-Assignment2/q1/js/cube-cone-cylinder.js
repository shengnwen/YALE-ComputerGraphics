/**
 * Created by shengwen on 9/23/15.
 *
 *
 */
function Cube() {
    this.name = "cube";

    this.vertices = new Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0

    ]);

    this.triangleIndices = new Uint16Array([
        0, 1, 2, 2, 1, 3,
        5, 4, 7, 4, 7, 6,
        0, 1, 5, 0, 4, 5,
        0, 6, 4, 0, 6, 2,
        2, 6, 3, 7, 6, 3,
        1, 5, 3, 3, 5, 7
    ]);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}

function Cone (resolution) {

    this.name = "cone";

    // vertices definition
    ////////////////////////////////////////////////////////////

    this.vertices = new Float32Array(3*(resolution+2));

    // apex of the cone
    this.vertices[0] = 0.0;
    this.vertices[1] = 2.0;
    this.vertices[2] = 0.0;

    // base of the cone
    var radius = 1.0;
    var angle;
    var step = 6.283185307179586476925286766559 / resolution;

    var vertexoffset = 3;
    for (var i = 0; i < resolution; i++) {

        angle = step * i;

        this.vertices[vertexoffset] = radius * Math.cos(angle);
        this.vertices[vertexoffset+1] = 0.0;
        this.vertices[vertexoffset+2] = radius * Math.sin(angle);
        vertexoffset += 3;
    }

    this.vertices[vertexoffset] = 0.0;
    this.vertices[vertexoffset+1] = 0.0;
    this.vertices[vertexoffset+2] = 0.0;

    // triangles defition
    ////////////////////////////////////////////////////////////

    this.triangleIndices = new Uint16Array(3*2*resolution);

    // lateral surface
    var triangleoffset = 0;
    for (var i = 0; i < resolution; i++) {

        this.triangleIndices[triangleoffset] = 0;
        this.triangleIndices[triangleoffset+1] = 1 + (i % resolution);
        this.triangleIndices[triangleoffset+2] = 1 + ((i+1) % resolution);
        triangleoffset += 3;
    }

    // bottom part of the cone
    for (var i = 0; i < resolution; i++) {

        this.triangleIndices[triangleoffset] = resolution+1;
        this.triangleIndices[triangleoffset+1] = 1 + (i % resolution);
        this.triangleIndices[triangleoffset+2] = 1 + ((i+1) % resolution);
        triangleoffset += 3;
    }

    this.numVertices = this.vertices.length/3;
    this.numTriangles = this.triangleIndices.length/3;
}


function Cylinder (resolution) {

    this.name = "cylinder";

    // vertices definition
    ////////////////////////////////////////////////////////////

    //this.vertices = new Float32Array(3*(2*resolution+2));
    //
    //var radius = 1.0;
    //var angle;
    //var step = 6.283185307179586476925286766559 / resolution;
    //
    //// lower circle
    //var vertexoffset = 0;
    //for (var i = 0; i < resolution; i++) {
    //
    //    angle = step * i;
    //
    //    this.vertices[vertexoffset] = radius * Math.cos(angle);
    //    this.vertices[vertexoffset+1] = 0.0;
    //    this.vertices[vertexoffset+2] = radius * Math.sin(angle);
    //    vertexoffset += 3;
    //}
    //
    //// upper circle
    //for (var i = 0; i < resolution; i++) {
    //
    //    angle = step * i;
    //
    //    this.vertices[vertexoffset] = radius * Math.cos(angle);
    //    this.vertices[vertexoffset+1] = 2.0;
    //    this.vertices[vertexoffset+2] = radius * Math.sin(angle);
    //    vertexoffset += 3;
    //}
    //
    //this.vertices[vertexoffset] = 0.0;
    //this.vertices[vertexoffset+1] = 0.0;
    //this.vertices[vertexoffset+2] = 0.0;
    //vertexoffset += 3;
    //
    //this.vertices[vertexoffset] = 0.0;
    //this.vertices[vertexoffset+1] = 2.0;
    //this.vertices[vertexoffset+2] = 0.0;
    //
    //
    //// triangles definition
    //////////////////////////////////////////////////////////////
    //
    //this.triangleIndices = new Uint16Array(3*4*resolution);
    //
    //// lateral surface
    //var triangleoffset = 0;
    //for (var i = 0; i < resolution; i++)
    //{
    //    this.triangleIndices[triangleoffset] = i;
    //    this.triangleIndices[triangleoffset+1] = (i+1) % resolution;
    //    this.triangleIndices[triangleoffset+2] = (i % resolution) + resolution;
    //    triangleoffset += 3;
    //
    //    this.triangleIndices[triangleoffset] = (i % resolution) + resolution;
    //    this.triangleIndices[triangleoffset+1] = (i+1) % resolution;
    //    this.triangleIndices[triangleoffset+2] = ((i+1) % resolution) + resolution;
    //    triangleoffset += 3;
    //}
    //
    //// bottom of the cylinder
    //for (var i = 0; i < resolution; i++)
    //{
    //    this.triangleIndices[triangleoffset] = i;
    //    this.triangleIndices[triangleoffset+1] = (i+1) % resolution;
    //    this.triangleIndices[triangleoffset+2] = 2*resolution;
    //    triangleoffset += 3;
    //}
    //
    //// top of the cylinder
    //for (var i = 0; i < resolution; i++)
    //{
    //    this.triangleIndices[triangleoffset] = resolution + i;
    //    this.triangleIndices[triangleoffset+1] = ((i+1) % resolution) + resolution;
    //    this.triangleIndices[triangleoffset+2] = 2*resolution+1;
    //    triangleoffset += 3;
    //}
    this.aziNum = 2;
    this.eleNum = 2;
    this.radius = 1.0;
    this.vertices = new Float32Array(3 * this.aziNum * this.eleNum);
    var theta = Math.PI * 2 / this.eleNum;
    var phi = Math.PI * 2 / this.aziNum;
    var vertexOffset = 0;
    for (var lat = 0; lat < this.eleNum; lat++) {
        for (var lon = 0; lon < this.aziNum; lon++) {
            this.vertices[vertexOffset] = this.radius * Math.cos(theta * lat) * Math.cos(phi * lon);
            this.vertices[vertexOffset + 1] = this.radius * Math.sin(theta * lat);
            this.vertices[vertexOffset + 2] = this.radius * Math.cos(theta * lat) * Math.sin(phi * lon);
            vertexOffset += 3;
        }
    }

    this.triangleIndices = new Uint16Array(3 * 2 * this.aziNum * this.eleNum);
    this.calculateVerticeIndex = function(lat, lon) {
        return lat*this.aziNum + lon;
    };

    var triangleOffset = 0;
    for (var lat = 0; lat < this.eleNum; lat++) {
        for (var lon = 0; lon < this.aziNum; lon++) {
            var index = this.calculateVerticeIndex(lat,lon);
            this.triangleIndices[triangleOffset] = index;
            this.triangleIndices[triangleOffset + 1] = this.calculateVerticeIndex((lat + 1) % this.eleNum, lon);
            this.triangleIndices[triangleOffset + 2] = this.calculateVerticeIndex((lat + 1) % this.eleNum, (lon + 1) % this.aziNum);
            this.triangleIndices[triangleOffset + 3] = index;
            this.triangleIndices[triangleOffset + 4] = this.calculateVerticeIndex((lat + 1) % this.eleNum, lon);
            this.triangleIndices[triangleOffset + 5] = this.calculateVerticeIndex((lat + 1) % this.eleNum, (lon - 1) % this.aziNum);
            triangleOffset += 6;
        }
    }
    this.numVertices = this.vertices.length/3;
    this.numTriangles = this.triangleIndices.length/3;
}
