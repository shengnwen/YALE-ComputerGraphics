function Tetrahedron_Loop(n) {
    this.name = "tetrahedron_loop";
    this.loopN = n;


    var sideLength = 2.0;
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

    this.vertices = [x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3];

    this.triangleIndices = [
        0, 2, 1,
        0, 3, 2,
        0, 1, 3,
        1, 2, 3
    ];

    var adjacentPoints = []

    for(var i = 0; i < 2 * (Math.pow(4, this.loopN) + 1); i ++) {
        adjacentPoints.push(new Set());
    }
    updateAdjacent(adjacentPoints, this.triangleIndices);

    for(var i = 0; i < this.loopN; i ++) {
        var oldLength = this.triangleIndices.length;
        var startPoint = this.vertices.length;

        var oldTriangles = this.triangleIndices.slice(0);
        var oldVertices = this.vertices.slice(0);

        for(var j = 0; j < oldLength; j += 3) { //Create new vertices & new Triangles; According to current triangle stack
            var triangle = [];
            triangle.push(this.triangleIndices.shift());
            triangle.push(this.triangleIndices.shift());
            triangle.push(this.triangleIndices.shift());
            var newIndexes = [];
            var newPoints = [];

            newPoints.push(oldPoint(triangle[0], triangle[1], oldTriangles, oldVertices));
            newPoints.push(oldPoint(triangle[2], triangle[0], oldTriangles, oldVertices));
            newPoints.push(oldPoint(triangle[2], triangle[1], oldTriangles, oldVertices));

            for(var l = 0; l < 3; l ++) {
                newPoint = newPoints[l];
                tempIndex = findThirdPoints(this.vertices, newPoint, startPoint);
                if(tempIndex == -1) {
                    this.vertices.push(newPoint[0], newPoint[1], newPoint[2]);
                    tempIndex = this.vertices.length / 3 - 1;
                }
                newIndexes.push(tempIndex);
            }

            this.triangleIndices.push(triangle[0], newIndexes[0], newIndexes[1]);
            this.triangleIndices.push(triangle[1], newIndexes[0], newIndexes[2]);
            this.triangleIndices.push(triangle[2], newIndexes[1], newIndexes[2]);
            this.triangleIndices.push(newIndexes[0], newIndexes[1], newIndexes[2]);
        }
        for(var j = 0; j < startPoint; j += 3) {
            var sum = [0, 0, 0];
            var adjacentSize = adjacentPoints[j / 3].size;
            adjacentPoints[j / 3].forEach(function(value) {
                index = value * 3;
                for(var l = 0; l < 3; l ++) {
                    sum[l] += oldVertices[index + l];
                }
            })

            var alpha = Math.pow(3 / 8 + Math.cos(2 * Math.PI / adjacentSize) / 4, 2) + 3 / 8;
            var beta = (1 - alpha) / adjacentSize;
            for(var l = 0; l < 3; l ++) {
                sum[l] *= beta;
                sum[l] += oldVertices[j + l] * alpha;
                this.vertices[j + l] = sum[l];
            }
        }
        for(var l in adjacentPoints) {
            adjacentPoints[i].clear();
        }
        updateAdjacent(adjacentPoints, this.triangleIndices);
    }

    this.triangleIndices = new Uint16Array(this.triangleIndices);
    this.vertices = new Float32Array(this.vertices);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;
}

function oldPoint(index1, index2, triangles, vertices) {
    var resultIndex = [];
    for(var i = 0; i < triangles.length && resultIndex.length < 2; i += 3) {
        var triangle = [triangles[i], triangles[i + 1], triangles[i + 2]];
        if(triangle.indexOf(index1) > -1) {
            if(triangle.indexOf(index2) > -1) {
                var tempIndex = triangle.filter(function(x) {
                    return x != index1 && x != index2;
                })[0];
                resultIndex.push(tempIndex);
            }
        }
    }

    var results = [];
    for(var i = 0; i < 3; i ++) {
        results.push(3 / 8 * (vertices[3 * index1 + i] + vertices[3 * index2 + i]) + 1 / 8 * (vertices[3 * resultIndex[0] + i] + vertices[3 * resultIndex[1] + i]));
    }

    return results;
}

function findThirdPoints(vertices, point, startPoint) {
    for(var i = startPoint; i < vertices.length; i += 3){
        for(var j = 0; j < 3; j ++) {
            if(vertices[i + j] != point[j]) {
                break;
            }
        }
        if(j == 3) {
            return i / 3;
        }
    }
    return -1;
}

function updateAdjacent(adjacentList, triangleIndices) {
    for(var i = 0; i < triangleIndices.length; i += 3) {
        adjacentList[triangleIndices[i]].add(triangleIndices[i + 1]);
        adjacentList[triangleIndices[i]].add(triangleIndices[i + 2]);
        adjacentList[triangleIndices[i + 1]].add(triangleIndices[i]);
        adjacentList[triangleIndices[i + 1]].add(triangleIndices[i + 2]);
        adjacentList[triangleIndices[i + 2]].add(triangleIndices[i]);
        adjacentList[triangleIndices[i + 2]].add(triangleIndices[i + 1]);
    }
}