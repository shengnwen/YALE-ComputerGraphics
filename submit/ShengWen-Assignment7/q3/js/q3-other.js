/**
 * Created by shengwen on 11/16/15.
 */
function loadBumpImage() {
    //var imgFileName = document.getElementById("bumpMapImg").value.replace(/^.*(\\|\/|\:)/, '');
    var imgFileName = document.getElementById("bumpMapImg").value.replace(/^.*(\\|\/|\:)/, '');
    var img2FileName = document.getElementById("backgroundImg").value.replace(/^.*(\\|\/|\:)/, '');
    //alert(imgFileName);
    return [imgFileName, img2FileName];
}
function createCanvas(image1, image2) {
    var myCanvas = document.getElementById("bumpImgCanvas");
    var myCanvasContext = myCanvas.getContext("2d");
    var imgWidth = image1.width;
    var imgHeight = image1.height;
    var backImgHeight = image2.height;
    var backImgWidth = image2.width;

    myCanvas.width =  Math.max(image1.width, image2.width) * 2 + 10;
    myCanvas.height = image1.height +  image2.height + 10;

    myCanvasContext.drawImage(image1, 0, 0);
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
    var intensityMap = [];
    for (var x = 0; x < imgHeight; x++) {
        for (var y = 0; y < imgWidth; y++) {
            if (x == 0 || x == imgHeight - 1 || y == 0 || y == imgWidth - 1) {
                imgBumpData.data[index++] = 255;
                imgBumpData.data[index++] = 0;
                imgBumpData.data[index++] = 0;
                imgBumpData.data[index++] = 255;
                intensityMap.push(0.8);
            } else {
                var Bu = (calIntensity(x - 1, y) - calIntensity(x + 1, y)) / 2.0;
                var Bv = (calIntensity(x, y - 1) - calIntensity(x, y + 1)) / 2.0;
                var D = Vector.add(Vector.scale(U, Bu), Vector.scale(V, Bv));
                var adjustedNormal = Vector.unitVector(Vector.add(normal, D));
                intensityMap.push(Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = Math.floor(255.0 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = Math.floor(255.0 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = Math.floor(255.0 * Vector.dotProduct(adjustedNormal, light));
                imgBumpData.data[index++] = 255;
            }
        }
    }
    myCanvasContext.putImageData(imgBumpData, imgWidth + 10, 0, 0, 0, imgWidth, imgHeight);

    //myCanvasContext.putImageData(imgBumpData, 0, 0, 0, 0, imgWidth, imgHeight);
    myCanvasContext.drawImage(image2, 0, imgHeight + 10);
    var backImgOrigData = myCanvasContext.getImageData(0,imgHeight + 10,backImgWidth,backImgHeight);
    var backImgBumpData = myCanvasContext.getImageData(0,imgHeight + 10,backImgWidth,backImgHeight);
    index = 0;
    for (var x = 0; x < backImgHeight; x++) {
        for (var y = 0; y < backImgWidth; y++) {
            var adjustedIntensity = intensityMap[(x % (imgHeight-1))*imgWidth + (y%imgWidth)];
            backImgBumpData.data[index] = Math.floor(backImgOrigData.data[index] * adjustedIntensity);
            backImgBumpData.data[index+1] = Math.floor(backImgOrigData.data[index + 1] * adjustedIntensity);
            backImgBumpData.data[index+2] = Math.floor(backImgOrigData.data[index + 2] * adjustedIntensity);
            backImgBumpData.data[index+3] = 255;
            index += 4;
        }
    }
    myCanvasContext.clearRect(0,imgHeight  + 10, backImgWidth, backImgHeight);
    myCanvasContext.putImageData(backImgBumpData,0, imgHeight + 10, 0, 0, backImgWidth, backImgHeight);

    //myCanvasContext.putImageData(imgBumpData, imgWidth + 10, 0, 0, 0, imgWidth, imgHeight);
    document.body.appendChild(myCanvas);
}
function drawBumpImg() {
    var imgs =loadBumpImage();
    var img1 = new Image();
    var img2 = new Image();
    img1.src =  "./img/" + imgs[0];
    img2.src = "./img/" + imgs[1];
    //createCanvas(img1, img2);
    img1.onload = function() {
        //createCanvas(img1, img2);
    }
    img2.onload = function() {
        createCanvas(img1, img2);
    }
}
