//// adapted from http://stackoverflow.com/questions/3914203/javascript-filter-image-color
//function createCanvas(image) {
//
//    // create a new canvas element
//    var myCanvas = document.createElement("canvas");
//    var myCanvasContext = myCanvas.getContext("2d");
//
//
//    var imgWidth = image.width;
//    var imgHeight = image.height;
//
//
//    // set the width and height to show two copies of the image
//    myCanvas.width = 2 * imgWidth + 10;
//    myCanvas.height = imgHeight;
//
//    // draw the image
//    myCanvasContext.drawImage(image, 0, 0);
//
//    // get all the input and output image data into arrays
//    var imageData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);
//    var imoutData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);
//
//    var filterSizeN = document.getElementById("filterSize").value;
//    var filterIntensityM = document.getElementById("filterIntensity").value;
//
//    //set up filters
//    function Filter(n, m){
//        this.n = n;
//        this.m = m;
//        this.calIntensity =  function(r, g, b) {
//            return 0.3 * r + 0.5 * g + 0.2 * b;
//        }
//        this.isSimilar = function(intensity1, intensity2) {
//            if (m != 0) {
//                if (Math.abs(intensity1 - intensity2) <= m) {
//                    return true;
//                } else {
//                    return false;
//                }
//            } else {
//                if (Math.abs(intensity1 - intensity2) <= 0.01) {
//                    return true;
//                } else {
//                    return false;
//                }
//            }
//        }
//
//    }
//
//    var filter = new Filter(filterSizeN, filterIntensityM);
//    // save intensity result in alpha array
//    for (j = 0; j < imageData.width; j++) {
//        for (i = 0; i < imageData.height; i++) {
//            var index = (i * 4) * imageData.width + (j * 4);
//            var red = imageData.data[index];
//            var green = imageData.data[index + 1];
//            var blue = imageData.data[index + 2];
//            imoutData.data[index + 3] = filter.calIntensity(red, green, blue);
//        }
//    }
//
//    for (j = 0; j < imageData.width; j++) {
//        for (i = 0; i < imageData.height; i++) {
//            // index: red, green, blue, alpha, red, green, blue, alpha..etc.
//            var index = (i * 4) * imageData.width + (j * 4);
//            var red = imageData.data[index];
//            var green = imageData.data[index + 1];
//            var blue = imageData.data[index + 2];
//            var intensity = imoutData.data[index + 3];
//
//            // calculate intensity
//            var vxmin = Math.max(0, i - filter.n), vxmax = Math.min(imageData.height - 1, i + filter.n);
//            var vymin = Math.max(0, j - filter.n), vymax = Math.min(imageData.width - 1, j + filter.n);
//            var pxCount = 0;
//            var sumR = 0, sumG = 0, sumB = 0, sumAlpha = 0;
//
//                for (var vx = vxmin; vx <= vxmax; vx++) {
//                    for (var vy = vymin; vy <= vymax;vy++) {
//                        var vIndex = (vx * 4) * imageData.width + (vy * 4);
//                        var intensity2 = imoutData.data[vIndex + 3];
//                        if (filter.isSimilar(intensity, intensity2)) {
//                            sumR += imageData.data[vIndex];
//                            sumG += imageData.data[vIndex + 1];
//                            sumB += imageData.data[vIndex + 2];
//                            pxCount ++;
//                        }
//                    }
//                }
//
//            //console.log("count:" + pxCount);
//            if (pxCount == 0) {
//                imoutData.data[index] = red;
//                imoutData.data[index + 1] = green;
//                imoutData.data[index + 2] = blue;
//            } else {
//                imoutData.data[index] = sumR / pxCount;
//                imoutData.data[index + 1] = sumG / pxCount;
//                imoutData.data[index + 2] = sumB / pxCount;
//            }
//            imoutData.data[index + 3] = 255;
//        }
//    }
//
//    // put the image data back into the canvas
//    myCanvasContext.putImageData(imoutData, imageData.width + 10, 0, 0, 0, imageData.width, imageData.height);
//
//    // append it to the body
//    document.body.appendChild(myCanvas);
//}
//function loadImage() {
//    var img = new Image();
//    img.onload = function () {
//        createCanvas(img);
//    }
//    img.src = document.getElementById("imagefilename").value;
//}
