var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var imgWidth = 600;
var imgHeight = 400;
var imgData = ctx.createImageData(imgWidth, imgHeight);
var ii;
var jj;


for (jj = 0; jj < imgWidth; jj++)
{ var qq = jj*4;
	for(ii = 0; ii < imgHeight; ii += 1)
{
  var pp = (ii*imgWidth*4)+qq;
if (jj < 256) {imgData.data[pp] = jj; }else {imgData.data[pp] = 0;}
if (ii < 256) {imgData.data[pp +1 ] = ii; }else {imgData.data[pp +1] = 0;}
if ((ii > 255) && (jj > 255) ) {imgData.data[pp + 2] = 255;} else {imgData.data[pp+2]=0;}
    imgData.data[pp + 3] = 255;
  
}
}


ctx.putImageData(imgData, 20, 20);