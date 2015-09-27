/**
 * Created by shengwen on 9/26/15.
 */
var currentAngle = 0;
var incAngle = 0.3;
function Character() {

    this.createObjectBuffers = function (gl, obj) {
        obj.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        obj.indexBufferTriangles = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // create edges
        var edges = new Uint16Array(obj.numTriangles * 3 * 2);
        for (var i = 0; i < obj.numTriangles; ++i) {
            edges[i * 6 + 0] = obj.triangleIndices[i * 3 + 0];
            edges[i * 6 + 1] = obj.triangleIndices[i * 3 + 1];
            edges[i * 6 + 2] = obj.triangleIndices[i * 3 + 0];
            edges[i * 6 + 3] = obj.triangleIndices[i * 3 + 2];
            edges[i * 6 + 4] = obj.triangleIndices[i * 3 + 1];
            edges[i * 6 + 5] = obj.triangleIndices[i * 3 + 2];
        }

        obj.indexBufferEdges = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);



    };





    this.drawTree = function (gl) {
        var stack = this.stack;

        stack.push();
        var M_0_tra1 = SglMat4.translation([0, 0.8, 0]);
        stack.multiply(M_0_tra1);

        var M_0_sca = SglMat4.scaling([0.6, 1.65, 0.6]);
        stack.multiply(M_0_sca);

        gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
        this.drawObject(gl, this.cone, [0.13, 0.62, 0.39, 1.0], [0, 0, 0, 1.0]);
        stack.pop();

        stack.push();
        var M_1_sca = SglMat4.scaling([0.25, 0.4, 0.25]);
        stack.multiply(M_1_sca);

        gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
        this.drawObject(gl, this.cylinder, [0.70, 0.56, 0.35, 1.0], [0, 0, 0, 1.0]);
        stack.pop();
    };
    this.drawObject = function (gl, obj, fillColor, lineColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
        gl.enableVertexAttribArray(this.uniformShader.aPositionIndex);
        gl.vertexAttribPointer(this.uniformShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0);

        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
        gl.uniform4fv(this.uniformShader.uColorLocation, fillColor);
        gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);

        gl.disable(gl.POLYGON_OFFSET_FILL);

        gl.uniform4fv(this.uniformShader.uColorLocation, lineColor);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
        gl.drawElements(gl.LINES, obj.numTriangles * 3 * 2, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.disableVertexAttribArray(this.uniformShader.aPositionIndex);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };

    this.createObjects = function () {
        this.cone = new Cone(10);
        this.cylinder = new Cylinder(20);
    };

    this.createBuffers = function (gl) {
        this.createObjectBuffers(gl, this.cone);
        this.createObjectBuffers(gl, this.cylinder);
    };

    this.initializeObjects = function (gl) {
        this.createObjects();
        this.createBuffers(gl);
    };
    //this.stack;
    this.onInitialize = function (gl) {// line 290, Listing 4.2{
        this.stack = new SglMatrixStack();
        this.initializeObjects(gl); //LINE 297}
        this.uniformShader = new uniformShader(gl);
    };

    this.drawScene = function (gl) {

        var canvas = document.getElementById("my_canvas");
        var width = canvas.width;
        var height = canvas.height;

        gl.viewport(0, 0, width, height);

        // Clear the framebuffer
        gl.clearColor(0.4, 0.6, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(this.uniformShader);


        // Setup projection matrix
        var ratio = width / height; //line 229, Listing 4.1{
        //var bbox = this.game.race.bbox;
        var winW = 10
        var winH = 10
        winW = winW * ratio * (winH / winW);
        var P = SglMat4.ortho([-winW / 2, -winH / 2, 0.0], [winW / 2, winH / 2, 21.0]);
        gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, P);

        var stack = this.stack;
        stack.loadIdentity(); //line 238}
        // create the inverse of V //line 239, Listing 4.2{
        //var invV = SglMat4.lookAt([0, 20, 0], [0, 0, 0], [1, 0, 0]);
        var invV = SglMat4.lookAt([0, 12, 0], [12, 0, 0], [1, 0, 0]);
        //stack.multiply(invV);
        //stack.push();//line 242
        //var M_9 = this.myFrame();
        //stack.multiply(M_9);
        //this.drawCar(gl);
        //stack.pop();

        //var trees = this.game.race.trees;
        //for (var t in trees) {
        //    stack.push();
        //    var M_8 = SglMat4.translation(trees[t].position);
        //    stack.multiply(M_8);
        //    this.drawTree(gl);
        //    stack.pop();
        //}

        this.drawTree(gl);


        gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);

        gl.useProgram(null);
        gl.disable(gl.DEPTH_TEST);

        currentAngle += incAngle;
        if (currentAngle > 360)
            currentAngle -= 360;
    };

}

