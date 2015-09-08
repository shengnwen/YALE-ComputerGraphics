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
    for (jj = 0; jj < imgWidth; jj++)
    { var qq = jj*4;
        for(ii = 0; ii < imgHeight; ii += 1)
    {
        var pp = (ii*imgWidth*4)+qq;
        var hsin = Math.sin(jj*hcy/imgWidth*2*Math.PI);
        var vsin = Math.sin(ii*vcy/imgHeight*2*Math.PI);
        imgData.data[pp] = vco[0]*vsin + hco[0]*hsin;
        imgData.data[pp+1] = vco[1]*vsin + hco[1]*hsin;
        imgData.data[pp+2] = vco[2]*vsin + hco[2]*hsin;
        if(imgData.data[pp] > 255) {
            imgData.data[pp] = 255
        }
        if(imgData.data[pp + 1] > 255) {
            imgData.data[pp + 1] = 255
        }
        if(imgData.data[pp + 2] > 255) {
            imgData.data[pp + 2] = 255
        }
        imgData.data[pp+3]=255;

    }
    }


    ctx.putImageData(imgData, 20, 20);
    }
