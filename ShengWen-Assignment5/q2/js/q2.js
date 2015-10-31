// check to make sure cycle > 0, at least 1
function checkArg(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "#You must enter a positive int for a, b!!!";
        e.value = 1;
        return;

    }
    var n = parseInt(e.value);

    if (n < 1) {
        document.getElementById("info").innerHTML = "#You must enter a positive int for a, b!!!";
        e.value = 1;
        return;
    }
    e.value = n;

}

// check to make sure r, g, b value in [0, 255] and get rid of float values
function checkColor(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "#You must enter an int between 0 and 255 for color!!!";
        e.value = 255;
        return;
    }
    var n = parseInt(e.value);
    if (n < 0 || n > 255) {
        document.getElementById("info").innerHTML = "#You must enter an int between 0 and 255 for color!!!";
        e.value = 255;
        return;
    }
    e.value = n;

}
function cal_ri2(x, y, xi, yi) {
    return (x - xi)*(x - xi) + (y - yi)*(y - yi);
}
function Fi(x, y, Ri, ri2){
    var t2 = ri2/(Ri*Ri);
    if (t2 <= 1) {
        return -4/9*t2*t2*t2 + 17/9*t2*t2 - 22/9*t2 + 1;
    } else {
        return 0;
    }
}
function C(x, y, xi, yi, Ri) {
    var sumF = 0;
    for (var i = 0; i < 3; i++) {
        var ri2 = cal_ri2(x, y, xi[i], yi[i]);
        sumF += Fi(x, y, Ri[i], ri2);
    }
    return Math.max(sumF - 0.1, 0);
}
function doStuff() {

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgWidth = Number(c.width);
    var imgHeight = Number(c.height);
    var xi = [];
    var yi = [];
    var Ri = [];
    for (var i = 0; i < 3; i++) {
        xi.push(Number(document.getElementById("x" + (i + 1).toString()).value)/imgWidth);
        yi.push(Number(document.getElementById("y" + (i + 1).toString()).value)/imgHeight);
        Ri.push(Number(document.getElementById("R" + (i + 1).toString()).value)/imgWidth/Math.sqrt(2));

    }
    var imgData = ctx.createImageData(imgWidth, imgHeight);
    // start to draw
    var skyColor = [50, 150, 255];
    var cloudColor = [255, 255, 255];
    var maxC = 0;

    //computer Max C
    for (var i = 0; i < imgHeight; i++) {
        for (var j = 0; j < imgWidth; j++) {
            var cValue = C(i/imgHeight, j/imgWidth, xi, yi, Ri);
            maxC = Math.max(maxC, cValue);
        }
    }

    for (var i = 0; i < imgHeight; i++) {
        for (var j = 0; j < imgWidth; j++) {
            var index = (i * imgWidth + j) * 4;
            var cValue = C(i/imgHeight, j/imgWidth, xi, yi, Ri);
            for (var k = 0; k < 3; k++) {
                imgData.data[index + k] = cValue/maxC * (cloudColor[k] - skyColor[k]) + skyColor[k];
            }
            imgData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 20, 20);
}
