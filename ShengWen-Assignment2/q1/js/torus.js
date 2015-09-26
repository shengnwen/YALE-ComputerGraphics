/**
 * Created by shengwen on 9/22/15.
 */
/**
 * Created by shengwen on 9/22/15.
 */


function Torus(aziNum, eleNum) {
    this.name = "torus";

    var radius = 3.0;
    var cirRadius = 1.0;
    this.aziNum = aziNum;
    this.eleNum = eleNum;
    //this.crystal = crystal;

    // not use this ways to calculate
    //!x = r sinθ cosφ
    //!y = r cosθ
    //!z = r sinθ sinφ


    this.vertices = new Float32Array(3 * this.aziNum * (this.eleNum + 1));
    //var theta = Math.PI / this.eleNum;
    var theta = Math.PI * 2/ this.eleNum;
    var phi = Math.PI * 2 / this.aziNum;
    var vertexOffset = 0;
    //for (var lat = 0; lat <= this.eleNum; lat++) {
    //    var center = []
    //    center.push();
    //    for (var lon = 0; lon < this.aziNum; lon++) {
    //        this.vertices[vertexOffset] = radius * Math.sin(theta * lat) * Math.cos(phi * lon);
    //        this.vertices[vertexOffset + 1] = radius * Math.cos(theta * lat);
    //        this.vertices[vertexOffset + 2] = radius * Math.sin(theta * lat) * Math.sin(phi * lon);
    //        vertexOffset += 3;
    //    }
    //}
    var vertexOffset = 0;
    for (var lon = 0; lon <= this.aziNum; lon++) {
        //center = [];
        //certer.push(radius * Math.cos(lon * phi));
        //center.push(0.0);
        //center.push(radius * Math.sin(lon * phi));
        for (var cir = 0; cir <= this.eleNum; cir++) {
            this.vertices[vertexOffset] = (radius + cirRadius*Math.cos(cir * theta)) * Math.cos(lon * phi);
            this.vertices[vertexOffset + 1] = cirRadius * Math.sin(cir*theta);
            this.vertices[vertexOffset + 2] = (radius + cirRadius*Math.cos(cir * theta)) * Math.sin(lon * phi);
            vertexOffset += 3;
        }
    }
    this.triangleIndices = new Uint16Array(3 * 2 * aziNum * (eleNum + 1));
    this.calculateVerticeIndex = function (lat, lon) {
        return lat * this.aziNum + lon;
    };

    var triangleOffset = 0;
    //for (var lat = 0; lat < eleNum; lat++) {
    //    for (var lon = 0; lon < aziNum; lon++) {
    //        //if (this.crystal) {
    //        //    this.triangleIndices[triangleOffset] = this.calculateVerticeIndex(lat, lon);
    //        //    this.triangleIndices[triangleOffset + 1] = this.calculateVerticeIndex(lat + 1, lon);
    //        //    this.triangleIndices[triangleOffset + 2] = this.calculateVerticeIndex(lat + 1, (lon + 1) % aziNum);
    //        //    this.triangleIndices[triangleOffset + 3] = this.calculateVerticeIndex(lat, (lon + 1) % aziNum);
    //        //    this.triangleIndices[triangleOffset + 4] = this.calculateVerticeIndex(lat + 1, lon);
    //        //    this.triangleIndices[triangleOffset + 5] = this.calculateVerticeIndex(lat + 1, (lon + 1) % aziNum);
    //        //} else {
    //        this.triangleIndices[triangleOffset] = this.calculateVerticeIndex(lat, lon);
    //        this.triangleIndices[triangleOffset + 1] = this.calculateVerticeIndex(lat + 1, lon);
    //        this.triangleIndices[triangleOffset + 2] = this.calculateVerticeIndex(lat, (lon + 1) % aziNum);
    //        this.triangleIndices[triangleOffset + 3] = this.calculateVerticeIndex(lat, (lon + 1) % aziNum);
    //        this.triangleIndices[triangleOffset + 4] = this.calculateVerticeIndex(lat + 1, lon);
    //        this.triangleIndices[triangleOffset + 5] = this.calculateVerticeIndex(lat + 1, (lon + 1) % aziNum);
    //        //}
    //        triangleOffset += 6;
    //    }
    //}
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

