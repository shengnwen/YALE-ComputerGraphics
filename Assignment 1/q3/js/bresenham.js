/**
 * Created by shengwen on 9/13/15.
 */
function check(e) {
    if (e.value > 1) {
        e.value = 1.00;
    } else if (e.value < 0) {
        e.value = 0.00;
    }
    e.value = parseFloat(e.value).toFixed(2);
};
// make sure image has a default value 50 * 50
function changeImgSize(e) {
    if (!e.value) {
        e.value = 50;
    }
}

function drawLine() {
    //alert("draw line!");
    // step1: round coordinates of P1, P2
    var width = document.getElementById("canvasWidth").value;
    var height = document.getElementById("canvasHeight").value;
    var startX = document.getElementById("x1").value * width;
    var startY = document.getElementById("y1").value * height;
    startX = (startX - 1 < 0) ? 0 : startX - 1;
    startY = (startY - 1 < 0) ? 0 : startY - 1;

    var endX = document.getElementById("x2").value * width;
    var endY = document.getElementById("y2").value * height;
    endX = (endX - 1 < 0) ? 0 : endX - 1;
    endY = (endY - 1 < 0) ? 0 : endY - 1;

    document.getElementById("info").textContent = "From (" + startX + "," + startY + ")" + " to (" + endX + "," + endY + ").";
    //set up canvas and background color
    var myCanvas = document.getElementById("myCanvas");
    var myCanvasContext = myCanvas.getContext("2d");
    // clear previous canvas
    myCanvas.clear;
    myCanvas.width = width;
    myCanvas.height = height;
    myCanvasContext.fillStyle = "#eeeeee";
    myCanvas.style.border = "blue 1px solid";
    myCanvasContext.fillRect(0,0,width,height);


    // step2: specific lines: same point || vertical ||  horizontal
    var imoutData = myCanvasContext.getImageData(0, 0, width, height);
    var index;
    var pCount = 0;
    var calIndex = function(x, y) {
        return ((height - 1 - y) * width + x) * 4;
    }
    if (startX == endX && startY == endY) {
        document.getElementById("info").textContent += " Identical Points!";
        index = calIndex(startX, startY);

        // sourding i +/- 3 pixel has the same value;
        var xMin = Math.max(0, startX - 1);
        var xMax = Math.min(width - 1, startX + 1);
        var yMin = Math.max(0, startY - 1);
        var yMax = Math.min(height - 1, startY + 1);

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                var vIndex = calIndex(x, y);
                imoutData.data[vIndex] = 255;
                imoutData.data[vIndex + 1] = 0;
                imoutData.data[vIndex + 2] = 0;
                imoutData.data[vIndex + 3] = 255;
            }
        }
    } else if (startX == endX) {
        document.getElementById("info").textContent += " A Vertical Line!";
        for (y = startY; y <= endY; y++) {
            var vIndex = calIndex(startX, y);
            // 2 pixels as one unit to change color, so that user can see the difference clearly
            pCount ++;
            if (pCount % 4 == 0 || pCount % 4 == 1) {
                imoutData.data[vIndex] = 255;
                imoutData.data[vIndex + 2] = 0;
            } else {
                imoutData.data[vIndex] = 0;
                imoutData.data[vIndex + 2] = 255;
            }
            imoutData.data[vIndex + 1] = 0;
            imoutData.data[vIndex + 3] = 255;
        }
    } else if (startY == endY) {
        document.getElementById("info").textContent += " A Horizontal Line!";
        // 2 pixels as one unit to change color, so that user can see the difference clearly
        for (x = startX; x <= endX; x++) {
            var vIndex = calIndex(x, startY);
            pCount ++;
            if (pCount % 4 == 0 || pCount % 4 == 1) {
                imoutData.data[vIndex] = 255;
                imoutData.data[vIndex + 2] = 0;
            } else {
                imoutData.data[vIndex] = 0;
                imoutData.data[vIndex + 2] = 255;
            }
            imoutData.data[vIndex + 1] = 0;
            imoutData.data[vIndex + 3] = 255;
        }
    } else {
        document.getElementById("info").textContent += " An Oblique Line!";
        var writePixel = function (x, y, key, calF) {
            var index = calF(x, y);
            switch (key) {
                case 0:
                case 1:
                    imoutData.data[index] = 0;
                    imoutData.data[index + 2] = 255;
                    break;
                default:
                    imoutData.data[index] = 255;
                    imoutData.data[index + 2] = 0;
            }
            imoutData.data[index + 1] = 0;
            imoutData.data[index + 3] = 255;
        }
        var calF;
        var slope = (endY - startY) / (endX - startX);
        if (slope > 0 && slope <= 1) {
            // slope > 0
            document.getElementById("info").textContent += " 1 >= Slope > 0!";
            calF = calIndex;
        } else if (slope < 0 && slope >= -1){
            //slope < 0, need to switch coordinates (0, 0) - > (0, height - 1 - 0)
            // eg. height = 50, width = 50 => (0, 0) -> (0, 49)
            document.getElementById("info").textContent += " -1 <= Slope < 0, so switch coordinates!";
            calF = function(x, y) {
                return (y * width + x) * 4;
            }
            startY = height - 1 - startY;
            endY = height - 1 - endY;
        } else if (slope > 1) {
            document.getElementById("info").textContent += " Slope > 1, so switch (x, y) to (y, x)!";
            calF = function(y, x) {
                //
                return ((height - 1 - y) * width + x) * 4;
            }
            var tmp;
            tmp = startX;
            startX = startY;
            startY = tmp;
            tmp = endY;
            endY = endX;
            endX = tmp;
        } else {
            document.getElementById("info").textContent += " Slope < - 1, so switch from (x, y) to (-y, x)!";
            calF = function(x, y) {
                return calIndex(y, -x);
            }
            var tmp= startX;
            startX = - startY;
            startY = tmp;
            tmp = endX;
            endX = - endY;
            endY = tmp;
        }
        if (startX > endX) {
            var tmp = endX;
            endX = startX;
            startX = tmp;
            tmp = endY;
            endY = startY;
            startY = tmp;
        }
        var dx = endX - startX;
        var dy = Math.abs(endY - startY);
        var d = 2 * dy - dx;
        var incrE = 2 * dy;
        var incrNE = 2 * (dy - dx);
        // make 2 pixel as a unit in same color, so that color change visible
        writePixel(startX, startY, startX % 4, calF);
        var x= startX;
        var y = startY;
        while(x < endX) {
            if (d <= 0) {
                d += incrE; // M above the line, so choose East position
            } else {
                d += incrNE;
                y++;
            }
            x++;
            pCount ++;
            writePixel(x, y, pCount % 4, calF);
        }
    }

    // put data into canvas;
    myCanvasContext.putImageData(imoutData, 0, 0, 0, 0, width, height);


}