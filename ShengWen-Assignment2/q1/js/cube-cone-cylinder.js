/**
 * Created by shengwen on 9/23/15.
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

function Cone(resolution) {
    this.name = "cone";
    this.resolution = resolution;

    this.vertices = new Float32Array(3 * (resolution + 2));

    // apex of cone
    this.vertices[0] = 0.0;
    this.vertices[1] = 2.0; // height
    this.vertices[2] = 0.0;

    //base of the cone
    var radius = 1.0;
    var angle;
    var step = Math.PI * 2 / resolution;

    var vertexOffset = 3;
    for (var i = 0; i < resolution; i++) {
        angle = step * i;
        this.vertices[vertexOffset] = radius * Math.cos(angle);
        this.vertices[vertexOffset] = 0.0;
        this.vertices[vertexOffset] = radius * Math.sin(angle);

        vertexOffset += 3;
    }

    this.vertices[vertexOffset] = 0.0;
    this.vertices[vertexOffset + 1] = 0.0;
    this.vertices[vertexOffset + 2] = 0.0;


    this.triangleIndices = new Uint16Array(3 * 2 * resolution);

    //lateral surface +  bottom suface
    var triangleOffset = 0;
    for (var i = 0; i < resolution; i++) {
        this.triangleIndices[triangleOffset] = 0;
        this.triangleIndices[triangleOffset + 1] = 1 + (i % resolution);
        this.triangleIndices[triangleOffset + 2] = 1 + ((i + 1) % resolution);
        this.triangleIndices[triangleOffset + 3] = 1 + (i % resolution);
        this.triangleIndices[triangleOffset + 4] = 1 + ((i + 1) % resolution);
        this.triangleIndices[triangleOffset + 5] = resolution + 1;

        triangleOffset += 6;
    }

    this.numVertices = this.vertices.length / 3;
    this.numVertices = this.triangleIndices / 3;

}

function Cylinder(resolution) {
    this.name = "cylinder";

    this.vertices = new Float32Array(3 * (2 * resolution + 2));
    this.resolution = resolution;
    var radius = 1.0;
    var angle;
    var step = Math.PI * 2 / resolution;

    // lower circle
    var vertexOffset = 0;
    for (var i = 0; i < resolution; i++) {
        angle = step * i;
        this.vertices[vertexOffset] = radius * Math.cos(angle);
        this.vertices[vertexOffset + 1] = 0.0;
        this.vertices[vertexOffset + 2] = radius * Math.sin(angle);
        vertexOffset += 3;
    }

    // upper circle
    for (var i = 0; i < resolution; i++) {
        angle = step * i;
        this.vertices[vertexOffset] = radius * Math.cos(angle);
        this.vertices[vertexOffset + 1] = 2.0;
        this.vertices[vertexOffset + 2] = radius * Math.sin(angle);
        vertexOffset += 3;
    }

    //lower and upper center
    this.vertices[vertexOffset] = 0.0;
    this.vertices[vertexOffset + 1] = 0.0;
    this.vertices[vertexOffset + 2] = 0.0;
    vertexOffset += 3;

    this.vertices[vertexOffset] = 0.0;
    this.vertices[vertexOffset + 1] = 2.0;
    this.vertices[vertexOffset + 2] = 0.0;

    //triangles definition

    this.triangleIndices = new Uint16Array(3 * 4 * resolution);

    // lateral surface
    var triangleOffset = 0;
    for (var i = 0; i < resolution; i++) {
        this.triangleIndices[triangleOffset] = i;
        this.triangleIndices[triangleOffset + 1] = (i + 1) % resolution;
        this.triangleIndices[triangleOffset + 2] = i + resolution;
        this.triangleIndices[triangleOffset + 3] = i + resolution;
        this.triangleIndices[triangleOffset + 4] = (i + 1) % resolution + resolution;
        this.triangleIndices[triangleOffset + 5] = (i + 1) % resolution;
        triangleOffset += 6;
    }

    // bottom/ upper surface

    for (var i = 0; i < resolution; i++) {
        this.triangleIndices[triangleOffset] = i;
        this.triangleIndices[triangleOffset + 1] = (i + 1) % resolution;
        this.triangleIndices[triangleOffset + 2] = 2 * resolution;
        this.triangleIndices[triangleOffset + 3] = i + resolution;
        this.triangleIndices[triangleOffset + 4] = (i + 1) % resolution + resolution;
        this.triangleIndices[triangleOffset + 5] = 2 * resolution + 1;

        triangleOffset += 6;
    }

}