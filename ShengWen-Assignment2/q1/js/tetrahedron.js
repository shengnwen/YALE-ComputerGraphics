/**
 * Created by shengwen on 9/22/15.
 */

function Tetrahedron() {
    this.name = "tetrahedron";

    this.vertices = new Float32Array(3 * 4);
    var sideLength = 2.0;

    // 3 points in the bottom layer
    var angle = Math.PI * 2 / 3;
    for (var i = 0; i < 3; i++) {
        this.vertices[i * 3 + 0] = sideLength * Math.cos(angle * i);
        this.vertices[i * 3 + 1] = 0.0;
        this.vertices[i * 3 + 2] = sideLength * Math.sin(angle * i);
    }

    //apex of tetrahedron
    this.vertices[3 * 3 + 0] = 0.0;
    this.vertices[3 * 3 + 1] = sideLength;
    this.vertices[3 * 3 + 2] = 0.0;

    this.triangleIndices = new Uint16Array([
        0, 1, 2,
        1, 2, 3,
        0, 1, 3,
        0, 2, 3
    ]);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}
