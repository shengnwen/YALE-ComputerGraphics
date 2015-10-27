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

    for (var iter = 1; iter <= this.loopN; iter++) {
        var adjacentPoints = [];
        var allTriangles = this.triangleIndices.slice(0);
        var allPoints = this.vertices.slice(0);
        calAdjacentPoints(iter,adjacentPoints, allTriangles);
        var newTriangles = [];
        // using adjacent point to calculate newPoints and new Triangles
        allPoints = calNewIteration(newTriangles,allTriangles,allPoints, adjacentPoints);
        this.triangleIndices = newTriangles.slice(0);
        this.vertices = allPoints.slice(0);
    }
    this.triangleIndices = new Uint16Array(this.triangleIndices);
    this.vertices = new Float32Array(this.vertices);

    this.numVertices = this.vertices.length / 3;
    this.numTriangles = this.triangleIndices.length / 3;

}

function calNewPoint(index1, index2, triangels, vertices) {
    var result2Index = [];
    for (var i = 0; i < triangels.length/3 && result2Index.length < 2; i++) {
        if (triangels[i * 3 + 0] == index1 && triangels[i * 3 + 1] == index2 ||
            triangels[i * 3 + 1] == index1 && triangels[i * 3 + 0] == index2) {
            result2Index.push(triangels[i*3 + 2]);
        } else if (triangels[i * 3 + 0] == index1 && triangels[i * 3 + 2] == index2 ||
            triangels[i * 3 + 2] == index1 && triangels[i * 3 + 0] == index2) {
            result2Index.push(triangels[i*3 + 1]);
        } else if (triangels[i * 3 + 2] == index1 && triangels[i * 3 + 1] == index2 ||
            triangels[i * 3 + 1] == index1 && triangels[i * 3 + 2] == index2) {
            result2Index.push(triangels[i*3 + 0]);
        }
    }
    var newPoint = [];
    for (var i = 0; i < 3; i++) {
        newPoint.push(3 / 8 * (vertices[3 * index1 + i] + vertices[3 * index2 + i]) + 1/8 * (vertices[3 * result2Index[0] + i] + vertices[3 * result2Index[1] + i]));
    }
    return newPoint;
}

function calNewIteration(newTriangles, allTriangles, allPoints, adjacentPoint) {
    var oldTriNum = allTriangles.length / 3;
    var startPoint = allPoints.length;
    var new_allPoints = allPoints.slice(0);
    for (var tri = 0; tri < oldTriNum; tri++) {

        // cal new points
        var newPoints = [];
        newPoints.push(calNewPoint(allTriangles[tri * 3 + 0],allTriangles[tri*3 + 1],allTriangles, allPoints));
        newPoints.push(calNewPoint(allTriangles[tri * 3 + 1],allTriangles[tri*3 + 2],allTriangles, allPoints));
        newPoints.push(calNewPoint(allTriangles[tri * 3 + 0],allTriangles[tri*3 + 2],allTriangles, allPoints));
        // cal old points
        for (var v = 0; v < 3; v++) {
            var old_point_cal = [0, 0, 0];
            var oldIndex = allTriangles[tri * 3 + v];
            var adjacentK = adjacentPoint[oldIndex].size;
            for (var i = 0; i < 3; i++) {
                //for (var adj = 0; adj < adjacentK; adj++) {
                //    var adjIndex = adjacentPoint[oldIndex][adj];
                //    old_point_cal[i] += allPoints[adjIndex * 3 + i];
                //}
                adjacentPoint[oldIndex].forEach(function(value){
                    old_point_cal[i] += allPoints[value * 3 + i];
                });
            }
            var alpha = Math.pow(3 / 8 + Math.cos(2 * Math.PI / adjacentK) / 4, 2) + 3 / 8;
            var beta = (1 - alpha) / adjacentK;
            for (var i = 0; i < 3; i++) {
                old_point_cal[i] = old_point_cal[i]*beta + allPoints[oldIndex * 3 + i]*alpha;
                new_allPoints[oldIndex * 3 + i] = old_point_cal[i];
            }
        }
        var newPointIndex = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            var index = checkNewPoint(new_allPoints,startPoint,newPoints[i]);
            if (index != -1) {
                newPointIndex[i] = index / 3;
            } else {
                newPointIndex[i] = new_allPoints.length/3;
                for (var j = 0; j < 3; j++) {
                    new_allPoints.push(newPoints[i][j]);
                }
            }
        }
        newTriangles.push(newPointIndex[0]);
        newTriangles.push(newPointIndex[1]);
        newTriangles.push(newPointIndex[2]);

        newTriangles.push(newPointIndex[0]);
        newTriangles.push(newPointIndex[1]);
        newTriangles.push(allTriangles[tri*3 + 1]);

        newTriangles.push(newPointIndex[0]);
        newTriangles.push(allTriangles[tri*3 + 0]);
        newTriangles.push(newPointIndex[2]);

        newTriangles.push(allTriangles[tri*3 + 2]);
        newTriangles.push(newPointIndex[1]);
        newTriangles.push(newPointIndex[2]);

    }
    return new_allPoints;
}
function checkNewPoint(allPoints, startPoint, newPoint) {
    for (var i = startPoint; i < allPoints.length;i = i + 3) {
        if (allPoints[i] == newPoint[0] && allPoints[i + 1] == newPoint[1] && allPoints[i + 2] == newPoint[2]) {
            return i;
        }
    }
    return -1;

}
function calAdjacentPoints(iter,adjacentPoints, allTriangles) {
    for (var i = 0; i < 2 * (Math.pow(4, iter) + 1); i++) {
        adjacentPoints.push(new Set());
    }
    for (var i = 0; i < allTriangles.length / 3; i++) {
        adjacentPoints[allTriangles[i * 3 + 0]].add(allTriangles[i * 3 + 1]);
        adjacentPoints[allTriangles[i * 3 + 0]].add(allTriangles[i * 3 + 2]);
        adjacentPoints[allTriangles[i * 3 + 1]].add(allTriangles[i * 3 + 0]);
        adjacentPoints[allTriangles[i * 3 + 1]].add(allTriangles[i * 3 + 2]);
        adjacentPoints[allTriangles[i * 3 + 2]].add(allTriangles[i * 3 + 1]);
        adjacentPoints[allTriangles[i * 3 + 2]].add(allTriangles[i * 3 + 0]);
    }
}

