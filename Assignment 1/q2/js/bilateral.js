
  // adapted from http://stackoverflow.com/questions/3914203/javascript-filter-image-color
  function createCanvas(image){

    // create a new canvas element
    var myCanvas = document.createElement("canvas");
    var myCanvasContext = myCanvas.getContext("2d");


    var imgWidth=image.width;
    var imgHeight=image.height;

    // set the width and height to show two copies of the image
    myCanvas.width= 2*imgWidth+ 10;
    myCanvas.height = imgHeight;

    // draw the image
    myCanvasContext.drawImage(image,0,0);

    // get all the input and output image data into arrays 
    var imageData = myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
	 var imoutData = myCanvasContext.getImageData(0,0, imgWidth, imgHeight);


    // go through it all...
    for (j=0; j<imageData.width; j++)
    {
      for (i=0; i<imageData.height; i++)
      {
         // index: red, green, blue, alpha, red, green, blue, alpha..etc.
         var index=(i*4)*imageData.width+(j*4);
         var red=imageData.data[index];
		 var green=imageData.data[index+1];
		 var blue=imageData.data[index+2];
         var alpha=imageData.data[index+3];

         // set the red to the same
         imoutData.data[index]=red;

         // set the rest to black
         imoutData.data[index+1]=green*1.2;
         imoutData.data[index+2]=blue*.8;
         imoutData.data[index+3]=alpha;
       }
     }

     // put the image data back into the canvas
     myCanvasContext.putImageData(imoutData,imageData.width+10,0,0,0, imageData.width,   imageData.height);

    // append it to the body
  document.body.appendChild(myCanvas);
  }
  function loadImage(){
    var img = new Image();
    img.onload = function (){
      createCanvas(img);
    }
    img.src = document.getElementById("imagefilename").value;
  }
  