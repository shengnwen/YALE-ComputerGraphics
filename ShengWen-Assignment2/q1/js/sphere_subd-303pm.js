/**
 * Created by shengwen on 9/22/15.
 */
/**
 * Created by shengwen on 9/22/15.
 */


function Sphere_Helper(vertex, triangles) {
    this.vertex = vertex;
    this.triangles = triangles;
    this.getMid = function(v1, v2) {
        var p = [];
        for (var i = 0; i < 3; i++) {
            p.push((v1[i] + v2[i])/2);
        }
        var r = Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2) + Math.pow(p[2], 2));
        for (var i = 0; i < 3; i++) {
            p[i] /= r;
        }
        return p;
    }
    this.calVerIndex = function(triOffset, v) {
        for (var i = 0; i < v.length; i++) {
            v[i] = triOffset + v[i];
        }
        return v;
    }
    this.nextIteration = function() {
        var newVertex = []
        var newTriangles = []
        var ver;
        var triVertices;
        for (var triOffset = 0; triOffset < triangles.length/3; triOffset ++) {
            // slice each triangle
            var triVertices = this.triangles.slice(triOffset * 3, triOffset * 3 + 3);
            var ver = [];
            for (var i = 0; i < 3; i++) {
                ver = ver.concat(this.vertex.slice(triVertices[i] * 3, triVertices[i] * 3 + 3));
            }
            var v1, v2, mid;
            for (var i = 0; i < ver.length / 3; i++) {
                if (i < 2) {
                    v1 = ver.slice(i * 3, i * 3 + 3)
                    v2 = ver.slice((i + 1) * 3, (i + 2) * 3);
                } else {
                    v1 = ver.slice(0, 3);
                    v2 = ver.slice(6, 9);
                }
                mid = this.getMid(v1, v2);
                newVertex = newVertex.concat(mid);
            }

            newVertex = newVertex.concat(ver);
            newTriangles = newTriangles.concat(this.calVerIndex(triOffset * 6, [0, 3, 2]));
            newTriangles = newTriangles.concat(this.calVerIndex(triOffset * 6, [0, 1, 4]));
            newTriangles = newTriangles.concat(this.calVerIndex(triOffset * 6, [1, 5, 2]));
            newTriangles = newTriangles.concat(this.calVerIndex(triOffset * 6, [0, 1, 2]));
        }
        this.vertex = newVertex;
        this.triangles = newTriangles;
    }

}

function Sphere_Subd(divNum) {
    this.name = "sphere_subd";

    var radius = 1.0;
    this.divNum = divNum;
    var initialVertex = [
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        -1.0, 0.0, 0.0,
        0.0, 0.0, -1.0,
        0.0, -1.0, 0.0
    ];

    var initialTriangles = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 1,
        5, 1, 2,
        5, 2, 3,
        5, 3, 4,
        5, 4, 1
    ];

    var helper = new Sphere_Helper(initialVertex, initialTriangles);

    // initial state - octrahedron
    for (var iter = 1; iter <= divNum; iter++) {
        helper.nextIteration();
    }
    this.vertices = new Float32Array(helper.vertex);
    this.triangleIndices = new Uint16Array(helper.triangles);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;

}

