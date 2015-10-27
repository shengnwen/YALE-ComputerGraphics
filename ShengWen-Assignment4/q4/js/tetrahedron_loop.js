/**
 * Created by shengwen on 9/22/15.
 */

function Tetrahedron_Loop(n) {
    this.name = "tetrahedron_loop";
    this.loopN = n;

    this.vertices = new Float32Array(3 * 4);
    var sideLength = 2.0;
    var originPoints = [];
    var x0 = parseFloat(document.getElementById('x0').value);
    var x1 = parseFloat(document.getElementById('x1').value);
    var x2 = parseFloat(document.getElementById('x2').value);
    var x3 = parseFloat(document.getElementById('x3').value);

    var y0 = parseFloat(document.getElementById('y0').value);
    var y1 = parseFloat(document.getElementById('y1').value);
    var y2 = parseFloat(document.getElementById('y2').value);
    var y3 = parseFloat(document.getElementById('y3').value);

    var z0 = parseFloat(document.getElementById('z0').value);
    var z1 = parseFloat(document.getElementById('z1').value);
    var z2 = parseFloat(document.getElementById('z2').value);
    var z3 = parseFloat(document.getElementById('z3').value);

    originPoints.push([x0, y0, z0]);
    originPoints.push([x1, y1, z1]);
    originPoints.push([x2, y2, z2]);
    originPoints.push([x3, y3, z3]);
    // 3 points in the bottom layer
    var angle = Math.PI * 2 / 3;
    for (var i = 0; i < 3; i++) {
        this.vertices[i * 3 + 0] = originPoints[i + 1][0];
        this.vertices[i * 3 + 1] = originPoints[i + 1][1];
        this.vertices[i * 3 + 2] = originPoints[i + 1][2];
    }

    //apex of tetrahedron
    this.vertices[3 * 3 + 0] = originPoints[0][0];
    this.vertices[3 * 3 + 1] = originPoints[0][1];
    this.vertices[3 * 3 + 2] = originPoints[0][2];

    this.triangleIndices = new Uint16Array([
        0, 1, 2,
        1, 2, 3,
        0, 1, 3,
        0, 2, 3
    ]);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}
