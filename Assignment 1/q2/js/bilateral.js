function createCanvas(image) {
    var myCanvas = document.createElement("canvas");
    var myCanvasContext = myCanvas.getContext("2d");
    var imgWidth = image.width;
    var imgHeight = image.height;

    myCanvas.width = 2 * imgWidth + 10;
    myCanvas.height = imgHeight;

    myCanvasContext.drawImage(image, 0, 0);
    var imageData = myCanvasContext.getImageData(0,0,imgWidth,imgHeight)
    var imoutData = myCanvasContext.getImageData(0,0,imgWidth,imgHeight)
    var intensityMap = [];
    var calIntensity = function(x,y) {
        var index = x * imgWidth * 4 + (y * 4);
        return imageData.data[index] * 0.3 + imageData.data[index + 1] * 0.5 + imageData.data[index + 2] * 0.2;
    };

    for (x = 0; x < imgHeight; x++) {
        for (y = 0; y < imgWidth; y++) {
            intensityMap.push(calIntensity(x, y));
        }
    }

    // filter
    var n = Number(document.getElementById("filterSize").value);
    var m = Number(document.getElementById("filterIntensity").value);

    //scan surrounding pixels
    for (x = 0; x < imgHeight; x++) {
        for (y = 0; y < imgWidth; y++) {
            var index = x * imgWidth + y;
            var xMin = Math.max(0, x - n);
            var xMax = Math.min(imgHeight - 1, x + n);
            var yMin = Math.max(0, y - n);
            var yMax = Math.min(imgWidth - 1, y + n);
            pxCount = 0;
            sumR = 0, sumG = 0, sumB = 0;
            for (ajX = xMin; ajX <= xMax; ajX ++) {
                for (ajY = yMin; ajY <= yMax; ajY ++) {
                    var ajIndex = ajX * imgWidth + ajY;
                    if (Math.abs(intensityMap[index] - intensityMap[ajIndex]) <= m + 0.01) {
                        sumR += imageData.data[4 * ajIndex];
                        sumG += imageData.data[4 * ajIndex + 1];
                        sumB += imageData.data[4 * ajIndex + 2];
                        pxCount ++;
                    }
                }
            }
            imoutData.data[4 * index] = sumR / pxCount;
            imoutData.data[4 * index + 1] = sumG / pxCount;
            imoutData.data[4 * index + 2] = sumB / pxCount;
            imoutData.data[4 * index + 3] = imageData.data[4 * index + 3]
        }
    }
    myCanvasContext.putImageData(imoutData, imgWidth + 10, 0, 0, 0, imgWidth, imgHeight);

    document.body.appendChild(myCanvas);
}


function loadImage() {
    var img = new Image();
    img.onload = function() {
        createCanvas(img);
    }
    img.src = document.getElementById("imagefilename").value;
}
