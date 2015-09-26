/**
 * Created by shengwen on 9/22/15.
 */
/**
 * Created by shengwen on 9/22/15.
 */


function Sphere_Helper(vertex, triangles) {
    this.verValue = vertex;
    this.triangles = triangles;
    this.getMid = function(v1, v2) {
        var p = [];
        for (var i = 0; i < 3; i++) {
            p.push((v1[i] + v2[i])/2);
        }
        var r = Math.sqrt(p[1] * p[1] + p[2] * p[2] + p[0]*p[0]);
        for (var i = 0; i < 3; i++) {
            p[i] /= r;
        }
        return p;
    }
    this.calPoints = function(offset, p) {
        for (var i = 0; i < p.length; i++) {
            p[i] += offset;
        }
        return p;
    }
    this.nextIteration = function() {
        // find each triangle
        var newTriangles = [];
        var newVerValue = [];
        var splitVerValues = [];
        var offset = 0;
        var triOffset = 0;
        for (var triIndex = 0; triIndex < this.triangles.length / 3; triIndex++) {
            var triPoints = this.triangles.slice(triOffset, triOffset + 3);//[0, 1, 2]
            triOffset+= 3;
            for(var i = 0; i < 3; i++) {
                var pIndex = triPoints[i];
                var pValue = this.verValue.slice(pIndex * 3, pIndex * 3 + 3);
                splitVerValues.push(pValue); //[[p0],[p1],[p2]]
            }
            var mid1 = this.getMid(splitVerValues[offset + 0], splitVerValues[offset + 1]);
            var mid2 = this.getMid(splitVerValues[offset + 2], splitVerValues[offset + 1]);
            var mid3 = this.getMid(splitVerValues[offset + 0], splitVerValues[offset + 2]);
            splitVerValues.push(mid1, mid2, mid3);
            offset += 6;
        }

        for(var i = 0; i < splitVerValues.length; i++) {
            //newVerValue = newVerValue.concat(splitVerValues[i]);
            newVerValue.push.apply(newVerValue, splitVerValues[i]);
        }
        var oldTriNum = this.triangles.length / 3;
        offset = 0;
        for (var i = 0; i < oldTriNum; i++) {
            newTriangles.push(offset + 0);
            newTriangles.push(offset + 3);
            newTriangles.push(offset+ 5);

            newTriangles.push(offset + 1);
            newTriangles.push(offset + 3);
            newTriangles.push(offset + 4);

            newTriangles.push(offset + 2);
            newTriangles.push(offset + 4);
            newTriangles.push(offset + 5);

            newTriangles.push(offset + 4);
            newTriangles.push(offset + 3);
            newTriangles.push(offset + 5);
            offset += 6;
        }

        this.verValue = newVerValue;
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
    this.vertices = new Float32Array(helper.verValue);
    this.triangleIndices = new Uint16Array(helper.triangles);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;

}
