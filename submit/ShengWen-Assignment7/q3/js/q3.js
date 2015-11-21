/**
 * Created by shengwen on 11/16/15.
 */
function loadBumpImage() {
    var imgFileName = document.getElementById("bumpMapImg").value.replace(/^.*(\\|\/|\:)/, '');
    //img.src = "./" + document.getElementById("imagefilename").value.replace(/^.*(\\|\/|\:)/, '');
    //alert(imgFileName);
    return imgFileName;
}
function createCanvas(image) {
    var myCanvas = document.getElementById("bumpImgCanvas");
    var myCanvasContext = myCanvas.getContext("2d");
    var imgWidth = image.width;
    var imgHeight = image.height;

    //myCanvas.width = 2 * imgWidth + 10;
    myCanvas.width = 3 * imgWidth + 10 * 2;
    myCanvas.height = imgHeight;

    myCanvasContext.drawImage(image, 0, 0);
    var imgOrigData = myCanvasContext.getImageData(0,0,imgWidth,imgHeight);
    var imgBumpData = myCanvasContext.getImageData(0,0,imgWidth,imgHeight);


    // text material:
    var normal = {x:0, y:0, z:1};
    var lx = parseFloat(document.getElementById('lX').value);
    var ly = parseFloat(document.getElementById('lY').value);
    var lz = parseFloat(document.getElementById('lZ').value);
    var light = Vector.unitVector({x:lx, y:ly, z:lz});
    //alert("light:" + light.x.toString() + "," + light.y.toString() + "," + light.z.toString());
    var calIntensity = function(x, y) {
        var intensity = 0;
        var index = 4 * (x * imgWidth + y);
        for (var i = 0; i < 3; i++) {
            intensity += imgOrigData.data[index + i];
        }
        intensity /= 255.0;
        intensity /= 3.0;
        return intensity;
    };
    var index = 0;
    var U = {x:1, y:0, z:0};
    var V = {x:0, y:1, z:0};
    for (var x = 0; x < imgHeight; x++) {
        for (var y = 0; y < imgWidth; y++) {
            if (x == 0 || x == imgHeight - 1 || y == 0 || y == imgWidth - 1) {
                imgBumpData.data[index++] = 255;
                imgBumpData.data[index++] = 0;
                imgBumpData.data[index++] = 0;
                imgBumpData.data[index++] = 255;
            } else {
                var Bu = (calIntensity(x - 1, y) - calIntensity(x + 1, y)) / 2.0;
                var Bv = (calIntensity(x, y - 1) - calIntensity(x, y + 1)) / 2.0;
                var D = Vector.add(Vector.scale(U, Bu), Vector.scale(V, Bv));
                var adjustedNormal = Vector.unitVector(Vector.add(normal, D));
                imgBumpData.data[index++] = Math.floor(255 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = Math.floor(255 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = Math.floor(255 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = 255;
            }
        }
    }
    myCanvasContext.putImageData(imgBumpData, imgWidth + 10, 0, 0, 0, imgWidth, imgHeight);
    document.body.appendChild(myCanvas);
}
function drawBumpImg() {
    var bmpImg = "./img/" + loadBumpImage();
    var img = new Image();
    img.onload = function() {
        createCanvas(img);
    }
    img.src = bmpImg;
}
