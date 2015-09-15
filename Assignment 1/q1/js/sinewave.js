// check to make sure cycle > 0, at least 1
function checkCycle(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "#You must enter a positive int for cycle!!!";
        e.value = 1;
        return;

    }
    var n = parseInt(e.value);

    if (n < 1) {
        document.getElementById("info").innerHTML = "#You must enter a positive int for cycle!!!";
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
function doStuff()
    {

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgWidth = 500;
    var imgHeight = 500;
    var vcy = document.getElementById("verticalcycles").value;
    var hcy = document.getElementById("horizontalcycles").value;
     var vco = [255, 255, 255];
     vco[0] = document.getElementById("verticalr").value;
     vco[1] = document.getElementById("verticalg").value;
     vco[2] = document.getElementById("verticalb").value;
     var hco = [255, 255, 255];
     hco[0] = document.getElementById("horizontalr").value;
     hco[1] = document.getElementById("horizontalg").value;
     hco[2] = document.getElementById("horizontalb").value;
    var imgData = ctx.createImageData(imgWidth, imgHeight);

    // modify this section to make colors varying with sine functions
    // imgWidth repeat hcy times
     //imgHeight repeart vcy times

        // start to draw
    for (var i = 0; i < imgHeight; i++) {
        for (var j = 0; j < imgWidth; j++) {
            var index = (i * imgWidth + j) * 4;
            var hsin = Math.sin(j * Math.PI * 2 * hcy / imgWidth );
            var vsin = Math.sin(i * Math.PI * 2 * vcy / imgHeight);
            imgData.data[index] = (vco[0]*vsin + hco[0]*hsin)/2;
            imgData.data[index + 1] = (vco[1]*vsin + hco[1]*hsin)/2;
            imgData.data[index + 2] = (vco[2]*vsin + hco[2]*hsin)/2;
            imgData.data[index + 3] = 255;
        }
    }
    //for (jj = 0; jj < imgWidth; jj++)
    //{ var qq = jj*4;
    //    for(ii = 0; ii < imgHeight; ii += 1)
    //{
    //    var pp = (ii*imgWidth*4)+qq;
    //    var hsin = Math.sin(jj*hcy/imgWidth*2*Math.PI);
    //    var vsin = Math.sin(ii*vcy/imgHeight*2*Math.PI);
    //    imgData.data[pp] = vco[0]*vsin + hco[0]*hsin;
    //    imgData.data[pp+1] = vco[1]*vsin + hco[1]*hsin;
    //    imgData.data[pp+2] = vco[2]*vsin + hco[2]*hsin;
    //    if(imgData.data[pp] > 255) {
    //        imgData.data[pp] = 255
    //    }
    //    if(imgData.data[pp + 1] > 255) {
    //        imgData.data[pp + 1] = 255
    //    }
    //    if(imgData.data[pp + 2] > 255) {
    //        imgData.data[pp + 2] = 255
    //    }
    //    imgData.data[pp+3]=255;
    //
    //}
    //}


    ctx.putImageData(imgData, 20, 20);
    }
