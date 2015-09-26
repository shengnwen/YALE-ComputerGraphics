///**
// * Created by shengwen on 9/22/15.
// */
///**
// * Created by shengwen on 9/22/15.
// */
//
//
//function Sphere_Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
//    this.vertices = new Float32Array(3 * 3);
//    this.addAll = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
//        this.addVertices(0, x1, y1, z1);
//        this.addVertices(1, x2, y2, z2);
//        this.addVertices(2, x3, y3, z3);
//    }
//    this.addVertices = function(index, x, y, z) {
//        this.vertices[3 * index] = x;
//        this.vertices[3 * index + 1] = y;
//        this.vertices[3 * index + 2] = z;
//    }
//    this.addAll(x1,y1,z1,x2,y2,z2,x3,y3,z3);
//}
//
//function Sphere_Subd(divNum) {
//    this.name = "sphere_subd";
//
//    var radius = 1.0;
//    this.divNum = divNum;
//
//
//    this.triangles = [];
//
//    // initial state - octrahedron
//
//    this.triangles.push(new Sphere_Triangle(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0));
//    this.triangles.push(new Sphere_Triangle(0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0));
//    this.triangles.push(new Sphere_Triangle(-1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0));
//    this.triangles.push(new Sphere_Triangle(0.0, 0.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0));
//
//    this.triangles.push(new Sphere_Triangle(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0));
//    this.triangles.push(new Sphere_Triangle(0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0));
//    this.triangles.push(new Sphere_Triangle(-1.00, 0.0, 0.0, 0.0, 0.0, -1.00, 0.0, -1.00, 0.0));
//    this.triangles.push(new Sphere_Triangle(0.0, 0.0, -1.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0));
//
//    this.calMid = function(x1, y1, z1, x2, y2, z2) {
//        p = [];
//        x0 = (x1 + x2)/2;
//        y0 = (y1 + y2)/2;
//        z0 = (z1 + z2)/2;
//        r0 = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0);
//        x0 /= r0;
//        y0 /= r0;
//        z0 /= r0;
//        p.push(x0);
//        p.push(y0);
//        p.push(z0);
//        return p;
//    }
//    for (var i = 1; i <= divNum; i++ ) {
//        // get all the triangles
//        new_triangles = [];
//        for (var j = 0; j < this.triangles.length; j++) {
//            vers = this.triangles[j].vertices;
//            p1 = this.calMid(vers[0], vers[1], vers[2],vers[3], vers[4], vers[5]);
//            p2 = this.calMid(vers[6], vers[7], vers[8],vers[3], vers[4], vers[5]);
//            p3 = this.calMid(vers[6], vers[7], vers[8],vers[0], vers[1], vers[2]);
//            new_triangles.push(new Sphere_Triangle(
//                p1[0],p1[1],p1[2],
//                vers[0], vers[1], vers[2],
//                p3[0],p3[1],p3[2]
//            ));
//            new_triangles.push(new Sphere_Triangle(
//                    p1[0],p1[1],p1[2],
//                    vers[3], vers[4], vers[5],
//                    p2[0],p2[1],p2[2]
//                )
//            );
//            new_triangles.push(new Sphere_Triangle(
//                    p1[0],p1[1],p1[2],
//                    p2[0],p2[1],p2[2],
//                    p3[0],p3[1],p3[2]
//                )
//            );
//            new_triangles.push(new Sphere_Triangle(
//                    p2[0],p2[1],p2[2],
//                    vers[6], vers[7], vers[8],
//                    p3[0],p3[1],p3[2]
//                )
//            );
//
//        }
//        this.triangles = new_triangles;
//    }
//
//    // get information from triangles into gl arrays
//    this.vertices = new Float32Array(3 * 3 * this.triangles.length);
//    this.triangleIndices = new Uint16Array(3 * this.triangles.length);
//    //for(var tri = 0; tri < 3; tri++) {
//    for (var tri = 0; tri < this.triangles.length; tri++) {
//        t = this.triangles[tri];
//
//        //vetices
//        this.vertices[tri * 9] = t.vertices[0];
//        this.vertices[tri * 9 + 1] = t.vertices[1];
//        this.vertices[tri * 9 + 2] = t.vertices[2];
//        this.vertices[tri * 9 + 3] = t.vertices[3];
//        this.vertices[tri * 9 + 4] = t.vertices[4];
//        this.vertices[tri * 9 + 5] = t.vertices[5];
//        this.vertices[tri * 9 + 6] = t.vertices[6];
//        this.vertices[tri * 9 + 7] = t.vertices[7];
//        this.vertices[tri * 9 + 8] = t.vertices[8];
//
//        //edges
//        this.triangleIndices[tri * 3 + 0] = 3 * tri;
//        this.triangleIndices[tri * 3 + 1] = 3 * tri + 1;
//        this.triangleIndices[tri * 3 + 2] = 3 * tri + 2;
//    }
//
//
//    this.numVertices = this.vertices.length / 3;
//    this.numTriangles = this.triangleIndices.length / 3;
//}
//
//function checkNumber(e) {
//    if (e.value == "") {
//        document.getElementById("info").innerHTML = "You must enter a valid integer!";
//        e.value = 0;
//        return;
//    }
//
//    var n = parseInt(e.value);
//    if (n < 0) {
//        document.getElementById("info").innerHTML = "You must enter a positive integer( > 1)!";
//        e.value = 0;
//        return;
//    }
//    else if (n > 5) {
//        document.getElementById("info").innerHTML = "The work load may break down the browser, bettern under 5!";
//        e.value = 5;
//        return;
//    }
//    e.value = n;
//    document.getElementById("info").innerHTML = "";
//}
