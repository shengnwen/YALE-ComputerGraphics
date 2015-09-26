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
        var r = Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2) + Math.pow(p[2], 2));
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
        for (var triIndex = 0; triIndex < this.triangles.length / 3; triIndex++) {
            var triPoints = this.triangles.slice(triIndex * 3, triIndex * 3 + 3);//[0, 1, 2]
            var splitVerValues = [];
            for(var i = 0; i < 3; i++) {
                // vertex index in this.verValue
                var pIndex = triPoints[i];
                var pValue = this.verValue.slice(pIndex * 3, pIndex * 3 + 3);
                splitVerValues.push(pValue); //[[p0],[p1],[p2]]
            }
            var mid1 = this.getMid(splitVerValues[0], splitVerValues[1]);
            var mid2 = this.getMid(splitVerValues[2], splitVerValues[1]);
            var mid3 = this.getMid(splitVerValues[0], splitVerValues[2]);
            splitVerValues.push(mid1);
            splitVerValues.push(mid2);
            splitVerValues.push(mid3);
            if (splitVerValues.length != 6) {
                alert("split vertex wrong here!");
            }
            for(var i = 0; i < 6; i++) {
                newVerValue = newVerValue.concat(splitVerValues[i]);
            }
            newTriangles = newTriangles.concat(this.calPoints(6 * triIndex,[0,3,5]));
            newTriangles = newTriangles.concat(this.calPoints(6 * triIndex,[1,3,4]));
            newTriangles = newTriangles.concat(this.calPoints(6 * triIndex,[2,4,5]));
            newTriangles = newTriangles.concat(this.calPoints(6 * triIndex,[4,3,5]));
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

