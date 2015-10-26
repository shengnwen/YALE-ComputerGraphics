/**
 * Created by shengwen on 9/22/15.
 */


function B_Spline_NURB(aziNum, eleNum, crystal) {



    this.name = "nurb";

    var radius = 1.0;
    this.aziNum = aziNum;
    this.eleNum = eleNum;
    this.crystal = crystal;

    var points = [];
    for(var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            points.push([col, row, Number(document.getElementById('z' + (row * 4 + col).toString()).value), Number(document.getElementById('w' + (row * 4 + col).toString()).value)]);
        }
    }
    //var sigWeight = 0;
    //for(var i = 0; i < 16; i++) {
    //    sigWeight += points[i][3];
    //}
    var bspline_matrix = [[0, 0, 0, 1/6],
                        [1/6, 1/2, 1/2, -1/2],
                        [2/3, 0, -1, 1/2],
                        [1/6, -1/2, 1/2, -1/6]];
    //var text;
    //for (var i = 0; i < points.length; i++) {
    //    text += '(' + points[i][0] + "," + points[i][1] + "," + points[i][2] + ")";
    //}
    //alert(text);

    this.vertices = new Float32Array(3 * 5 * 5);
    this.getBU = function(i,u) {
        return bspline_matrix[i][0] + bspline_matrix[i][1] * u
            + bspline_matrix[i][2]*u*u + bspline_matrix[i][3]*u*u*u;
    }
    var vertexOffset = 0, u, v;
    for (var lat = 0; lat < 5; lat++) {
        for (var lon = 0; lon < 5; lon++) {
            u = lat * 0.25, v = lon * 0.25;
            this.vertices[vertexOffset] = 0;
            this.vertices[vertexOffset + 1] = 0;
            this.vertices[vertexOffset + 2] = 0;
            var sigWeight = 0;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    sigWeight += this.getBU(i,u) * this.getBU(j, v) * points[i*4 + j][3];
                }
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var weight = this.getBU(i,u) * this.getBU(j, v) * points[i*4 + j][3];
                    this.vertices[vertexOffset] += weight/sigWeight * points[i * 4 + j][0];
                    this.vertices[vertexOffset + 1] += weight/sigWeight * points[i * 4 + j][1];
                    this.vertices[vertexOffset + 2] += weight/sigWeight * points[i * 4 + j][2];
                }
            }
            vertexOffset += 3;
        }
    }

    this.triangleIndices = new Uint16Array(3 * 2 * 4 * 4);
    this.calculateVerticeIndex = function (lat, lon) {
        return lat * 5 + lon;
    };

    var triangleOffset = 0;
    for (var lat = 0; lat < 4; lat++) {
        for (var lon = 0; lon < 4; lon++) {

                this.triangleIndices[triangleOffset] = this.calculateVerticeIndex(lat, lon);
                this.triangleIndices[triangleOffset + 1] = this.calculateVerticeIndex(lat + 1, lon);
                this.triangleIndices[triangleOffset + 2] = this.calculateVerticeIndex(lat + 1, (lon + 1));
                this.triangleIndices[triangleOffset + 3] = this.calculateVerticeIndex(lat, (lon + 1));
                this.triangleIndices[triangleOffset + 4] = this.calculateVerticeIndex(lat, lon);
                this.triangleIndices[triangleOffset + 5] = this.calculateVerticeIndex((lat + 1), (lon + 1));
            triangleOffset += 6;
        }
    }
    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}

function checkNumber(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "You must enter a valid integer!";
        e.value = 10;
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
