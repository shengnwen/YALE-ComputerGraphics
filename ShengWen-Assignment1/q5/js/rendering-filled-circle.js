
var gl = null;
var n = null;
var isSolid;

var colors = [];
var isRed =  null;
var isGreen = null;
var isBlue = null;
var isGrey = null;

var shaderProgram  = null;
var vertexBuffer = null;
var vertexColorBuffer = null;
var aPositionIndex = -1;
var aVertexColor = -1;
var pCount = 0;

function initBuffers(gl, n) {

    var vertexIndices = [];
    var colorVals = [];
    var theta = Math.PI * 2 / n;
    for(var i = 0; i < n; i++) {
        vertexIndices.push(0.0);
        vertexIndices.push(0.0);
        vertexIndices.push(0.0);
        vertexIndices.push(0.9 * Math.cos(theta * i));
        vertexIndices.push(0.9 * Math.sin(theta * i));
        vertexIndices.push(0.0);
        vertexIndices.push(0.9 * Math.cos(theta * (i + 1)));
        vertexIndices.push(0.9 * Math.sin(theta * (i + 1)));
        vertexIndices.push(0.0);
    }

    var length = colors.length;
    for(var i = 0; i < 3 * n; i++) {
       // if(isSolid) {}
       if (isSolid) {
           for (var j = 0; j < 3; j++) {
               colorVals.push(colors[pCount % length]);
               colorVals.push(colors[(pCount + 1) % length]);
               colorVals.push(colors[(pCount + 2) % length]);
           }
           pCount += 3;
       } else {
           for (var j = 0; j < 3; j++) {
               colorVals.push(colors[pCount % length]);
               colorVals.push(colors[(pCount + 1) % length]);
               colorVals.push(colors[(pCount + 2) % length]);
               pCount += 3;
           }
       }
    }
    triangleVertices =new Float32Array(vertexIndices);

    var triangleVerticesColor = new Float32Array(colorVals);


    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesColor, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);




}

///// Define and compile a very simple shader.
function initShaders(gl) {

    var vertexShaderSource = "\
	attribute vec3 a_position;                  \n\
	attribute vec3 a_color;                     \n\
	varying vec3 vertexcolor;                   \n\
	void main(void)                             \n\
	{                                           \n\
	    vertexcolor = a_color;                  \n\
		gl_Position = vec4(a_position, 1.0);    \n\
	}                                           \n\
	";

    var fragmentShaderSource = "\
	precision highp float;                      \n\
	varying vec3 vertexcolor;                   \n\
	void main(void)                             \n\
	{                                           \n\
		gl_FragColor = vec4(vertexcolor, 1.0);  \n\
	}                                           \n\
	";

    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, we show compilation and linking errors.
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
        var str = "";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }
}


function renderTriangle(gl, n) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // enable the current shader program
    gl.useProgram(shaderProgram);

    // connect the buffer containing the vertices of the triangle with the position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    aPositionIndex = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(aPositionIndex);
    gl.vertexAttribPointer(aPositionIndex, 3, gl.FLOAT, false, 0, 0);

    // connect the buffer containing the color of each vertex with the color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    aVertexColor = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(aVertexColor);
    gl.vertexAttribPointer(aVertexColor, 3, gl.FLOAT, false, 0, 0);

    // start to draw (!)
    //gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawArrays(gl.TRIANGLES, 0, n * 3);

    // disable the current shading program
    gl.useProgram(null);
}

function draw() {
    renderTriangle(gl, n);
}

function start() {
    document.getElementById("info").innerHTML = "";
    var canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("experimental-webgl");
    n = parseInt(document.getElementById("triNum").value);
    switch(document.getElementById("colorStyleSelect").value) {
        case "solid":
            isSolid = true;
            break;
        case "smooth":
            isSolid = false;
            break;
    }
    isRed = document.getElementById("cbRed").checked;
    isGreen = document.getElementById("cbGreen").checked;
    isBlue = document.getElementById("cbBlue").checked;
    isGrey = document.getElementById("cbGrey").checked;

    colors = [];
    if (!isRed && !isGreen && !isBlue && !isGrey) {
        //alert("You must choose at least one color!");
        document.getElementById("info").innerHTML ="You must choose at least one color!";
        return;
    }
    if (isRed) {
        colors.push(1.0);
        colors.push(0.0);
        colors.push(0.0);
    }
    if (isGreen) {
        colors.push(0.0);
        colors.push(1.0);
        colors.push(0.0);
    }
    if(isBlue) {
        colors.push(0.8);
        colors.push(1.0);
        colors.push(1.0);
    }
    if (isGrey) {
        colors.push(0.5);
        colors.push(0.5);
        colors.push(0.5);
    }
    if (n <= 2) {
        //alert("Number of Triangle is too less! Can't draw!");
        document.getElementById("info").innerHTML = "Number of Triangle is too less! Can't draw!";
        return;
    }

    if (gl)  {

        // initialize shader programs
        initShaders(gl);

        // initialize a very simple scene, a triangle
        initBuffers(gl, n);

        // call the draw() function every 20 milliseconds
        setInterval(draw, 20);
    }
    else {
        alert("WebGL initialization failed! Your browser does not support WebGL or it is not properly configured.");
    }
}
