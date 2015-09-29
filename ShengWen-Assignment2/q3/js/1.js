// Global NVMC Client
// ID 4.1
/***********************************************************************/
var NVMCClient = NVMCClient || {};
/***********************************************************************/

function PhotographerCamera() {//line 7, Listing 4.6
	this.position = [0, 0, 0];
	this.orientation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	this.t_V = [0, 0, 0];
	this.orienting_view = false;
	this.lockToCar = false;
	this.start_x = 0;
	this.start_y = 0;

	var me = this;
	this.handleKey = {};
	this.handleKey["Q"] = function () {me.t_V = [0, 0.1, 0];};
	this.handleKey["E"] = function () {me.t_V = [0, -0.1, 0];};
	this.handleKey["L"] = function () {me.lockToCar= true;};
	this.handleKey["U"] = function () {me.lockToCar= false;};

	this.keyDown = function (keyCode) {
		if (this.handleKey[keyCode])
			this.handleKey[keyCode](true);
	}

	this.keyUp = function (keyCode) {
		this.delta = [0, 0, 0];
	}

	this.mouseMove = function (x,y) {
		if (!this.orienting_view) return;

		var alpha	= (x - this.start_x)/10.0;
		var beta	= -(y - this.start_y)/10.0;
		this.start_x = x;
		this.start_y = y;

		var R_alpha = SglMat4.rotationAngleAxis(sglDegToRad( alpha  ), [0, 1, 0]);
		var R_beta = SglMat4.rotationAngleAxis(sglDegToRad (beta  ), [1, 0, 0]);
		this.orientation = SglMat4.mul(SglMat4.mul(R_alpha, this.orientation), R_beta);
	};

	this.mouseButtonDown = function (x,y) {
		if (!this.lock_to_car) {
			this.orienting_view = true;
			this.start_x = x;
			this.start_y = y;
		}
	};

	this.mouseButtonUp = function () {
		this.orienting_view = false;
	}

	this.updatePosition = function ( t_V ){
		this.position = SglVec3.add(this.position, SglMat4.mul3(this.orientation,  t_V));
		if (this.position[1] > 1.8) this.position[1] = 1.8;
		if (this.position[1] < 0.5) this.position[1] = 0.5;
	}

	this.setView = function (stack, carFrame) {
		this.updatePosition (this.t_V )
		var car_position = SglMat4.col(carFrame,3);
		if (this.lockToCar)
			var invV = SglMat4.lookAt(this.position, car_position, [0, 1, 0]);
		else
			var invV = SglMat4.lookAt(this.position, SglVec3.sub(this.position, SglMat4.col(this.orientation, 2)), SglMat4.col(this.orientation, 1));
		stack.multiply(invV);
	};
};//line 42}

//function FrontView() {//line 74, Listnig 4.5{
//	alert("Changed to Front View!");
//	this.position 				= [0.0,0.0,0.0];
//	this.keyDown 					= function (keyCode) {}
//	this.keyUp						= function (keyCode) {}
//	this.mouseMove				= function (event) {};
//	this.mouseButtonDown	= function (event) {};
//	this.mouseButtonUp 		= function () {}
//	this.setView 					= function ( stack, F_0) {
//		var Rx = SglMat4.rotationAngleAxis(sglDegToRad(-15), [1.0, 0.0, 0.0]);
//		var T = SglMat4.translation([0.0, 2.5, 0.5]);
//		var Vc_0 = SglMat4.mul(T, Rx);
//		var V_0 = SglMat4.mul(F_0, Vc_0);
//		this.position = SglMat4.col(V_0,3);
//		var invV = SglMat4.inverse(V_0);
//		stack.multiply(invV);
//	};
//};//line 90}


function ChaseCamera() {//line 74, Listnig 4.5{
	this.position 				= [0.0,0.0,0.0];
	this.keyDown 					= function (keyCode) {}
	this.keyUp						= function (keyCode) {}
	this.mouseMove				= function (event) {};
	this.mouseButtonDown	= function (event) {};
	this.mouseButtonUp 		= function () {}
	this.setView 					= function ( stack, F_0) {
		var Rx = SglMat4.rotationAngleAxis(sglDegToRad(-15), [1.0, 0.0, 0.0]);
		var T = SglMat4.translation([0.0, 2.5, 4.5]);
		var Vc_0 = SglMat4.mul(T, Rx);
		var V_0 = SglMat4.mul(F_0, Vc_0);
		this.position = SglMat4.col(V_0,3);
		var invV = SglMat4.inverse(V_0);
		stack.multiply(invV);
	};
};//l

NVMCClient.cameras = [];
NVMCClient.cameras[0] = new ChaseCamera();
NVMCClient.cameras[1] = new PhotographerCamera();
//NVMCClient.cameras[2] = new FrontView();
NVMCClient.n_cameras = 2;
//NVMCClient.n_cameras = 3;
NVMCClient.currentCamera = 0;

NVMCClient.nextCamera = function () {
	if (this.n_cameras - 1 > this.currentCamera)
		this.currentCamera++;
};
NVMCClient.prevCamera = function () {
	if (0 < this.currentCamera)
		this.currentCamera--;
};

NVMCClient.drawLda = function(gl) {
	var stack = this.stack;
	this.drawLdaSeat(gl);

	//draw body stomache

	stack.push();
	stack.multiply(SglMat4.translation([2, 16, 0]));
	this.drawLdaBody(gl);
	stack.pop();

	// 16 + 13.6 + 4
	// draw head(head(outer face and eye) + mouth)
	stack.push();
	stack.multiply(SglMat4.translation([2, 42, 0]));
	this.drawLdaHead(gl);
	stack.pop();

	// draw legs

	// draw legs
	stack.push();
	var M_2_sca = SglMat4.scaling([0.8,1,1]);
	stack.multiply(M_2_sca);
	var M_2_tra = SglMat4.translation([7, 18.5, 9]);
	stack.multiply(M_2_tra);
	var M_2_rot = SglMat4.rotationAngleAxis(sglDegToRad(-90), [0, 1, 0]);
	stack.multiply(M_2_rot);
	this.drawLdaLeg(gl);
	stack.pop();

	stack.push();
	var M_3_tra = SglMat4.translation([8, 18.5, -3]);
	stack.multiply(M_3_tra);
	this.drawLdaLeg(gl);
	stack.pop();


}

NVMCClient.drawLdaSeat = function(gl) {
	var stack = this.stack;

	stack.push();
	var M_0_sca = SglMat4.scaling([8, 8, 8]);
	stack.multiply(M_0_sca);
	var M_0_tra1 = SglMat4.translation([0, 1.0, 0]);
	stack.multiply(M_0_tra1);

	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaSeat, [0.4, 0.5, 0.5, 0.6],[0.4, 0.5, 0.5, 0.6] );
	stack.pop();


};

NVMCClient.drawLdaBody = function(gl) {
	var stack = this.stack;

	stack.push();
	var M_0_sca = SglMat4.scaling([7.5, 11, 7.5]);
	stack.multiply(M_0_sca);

	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaStomache, [0.1, 0.1, 0.1, 1.0], [0.1, 0.1, 0.1, 1.0]);
	stack.pop();

	// draw neck
	stack.push();
	var M_1_tra = SglMat4.translation([0, 13.6, 0])
	stack.multiply(M_1_tra);
	var M_1_sca = SglMat4.scaling([1.5, 4, 1.5]);
	stack.multiply(M_1_sca);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaNeck, [0.0, 0.0, 0.0, 1.0], [0, 0, 0, 1.0]);
	stack.pop();



};



NVMCClient.drawLdaHead = function(gl) {
	var stack = this.stack;

	// outer head
	stack.push();
	var M_0_sca = SglMat4.scaling([1.5, 1.5, 4]);
	stack.multiply(M_0_sca);
	var M_0_rot = SglMat4.rotationAngleAxis(sglDegToRad(-90), [1, 0, 0]);
	stack.multiply(M_0_rot);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaHead, [1.0, 1.0, 1.0, 0.1], [0, 0, 0, 0.05]);
	stack.pop();

	stack.push();
	var M_1_sca = SglMat4.scaling([5.5, 6, 4]);
	stack.multiply(M_1_sca);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaEye, [0.0, 0.0, 0.0, 1.0], [0, 0,0.0 , 1.0]);
	stack.pop();

	// draw mouth
	stack.push();
	var M_2_tra = SglMat4.translation([4.78, 0.2, 0]);
	stack.multiply(M_2_tra);
	var M_2_sca = SglMat4.scaling([7, 4, 4]);
	stack.multiply(M_2_sca);
	var M_2_rot = SglMat4.rotationAngleAxis(sglDegToRad(-80), [0, 0, 1]);
	stack.multiply(M_2_rot);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaMouth, [0.0, 0.0, 0.0, 1.0], [0, 0, 0, 1.0]);
	stack.pop();
}

NVMCClient.drawLdaLeg = function(gl) {
	// draw knee
	var stack = this.stack;

	stack.push();
	var M_0_sca = SglMat4.scaling([2.5, 3, 2.5]);
	stack.multiply(M_0_sca);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaKnee, [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0]);
	stack.pop();

	//draw leg
	stack.push();
	var M_1_tra = SglMat4.translation([0, -8,0])
	stack.multiply(M_1_tra);
	var M_1_sca = SglMat4.scaling([2, 3, 2]);
	stack.multiply(M_1_sca);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaLeg, [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0]);
	stack.pop();

	//draw foot 1

	stack.push();
	var M_2_tra = SglMat4.translation([-6, -8,0])
	stack.multiply(M_2_tra);
	var M_2_sca = SglMat4.scaling([12, 2, 2.5]);
	stack.multiply(M_2_sca);
	var M_2_rot = SglMat4.rotationAngleAxis(sglDegToRad(-100), [0, 0, 1]);
	stack.multiply(M_2_rot);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaFoot, [0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0]);
	stack.pop();



}

NVMCClient.drawScene = function (gl) {
	var width = this.ui.width;
	var height = this.ui.height
	var ratio = width / height;

	gl.viewport(0, 0, width, height);

	// Clear the framebuffer
	gl.clearColor(0.8, 0.6, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(this.uniformShader);

	var stack = this.stack;
	stack.loadIdentity();

	// Setup projection matrix
	gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, SglMat4.perspective(3.14 / 4, ratio, 1, 200));

	var pos = this.myPos();
	this.cameras[this.currentCamera].setView(this.stack, this.myFrame());

	var tra = SglMat4.translation([20, 0, 0]);
	stack.multiply(tra);

	tra = SglMat4.translation([-20, 0, 0]);
	stack.multiply(tra);

	//stack.push();
	//var M_9 = this.myFrame();
	//stack.multiply(M_9);
	//this.drawCar(gl);
	//stack.pop();

	//var trees = this.game.race.trees;
	//for (var t in trees) {
	//	stack.push();
	//	var M_8 = SglMat4.translation(trees[t].position);
	//	stack.multiply(M_8);
	//	this.drawTree(gl);
	//	stack.pop();
	//}

	stack.push();
	var M_Ida_tra = SglMat4.translation([4, 8 * 4, 0]);
	stack.multiply(M_Ida_tra);
	var M_Ida_rot = SglMat4.rotationAngleAxis(sglDegToRad(-30), [-0.0, 1, 0])
	stack.multiply(M_Ida_rot);
	this.drawLda(gl);
	stack.pop();

	stack.push();
	M_Ida_tra = SglMat4.translation([0, 8 * 2, 0]);
	stack.multiply(M_Ida_tra);
	stack.multiply(M_Ida_rot);
	var M_3_sca = SglMat4.scaling([8, 8, 8]);
	stack.multiply(M_3_sca);
	var M_3_tra1 = SglMat4.translation([0, 1.0, 0]);
	stack.multiply(M_3_tra1);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaSeat, [1.0, 1.0, 0.6, 0.6],[1.0, 1.0, 0.6, 0.6] );
	stack.pop();

	stack.push();
	M_Ida_tra = SglMat4.translation([-4, 0, 0]);
	stack.multiply(M_Ida_tra);
	stack.multiply(M_Ida_rot);
	var M_3_sca = SglMat4.scaling([8, 8, 8]);
	stack.multiply(M_3_sca);
	var M_3_tra1 = SglMat4.translation([0, 1.0, 0]);
	stack.multiply(M_3_tra1);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaSeat, [1.0, 1.0, 0.0, 0.9],[1.0, 1.0, 0.0, 0.9] );
	stack.pop();

	stack.push();
	M_Ida_tra = SglMat4.translation([40, 80, 18]);
	stack.multiply(M_Ida_tra);
	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.LdaEye, [1, 1, 0, 1.0], [1, 0.3, 0.3, 0.0]);
	stack.pop();


	gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.track, [0.9, 0.8, 0.7, 1.0], [0.9, 0.8, 0.7, 1.0]);
	this.drawObject(gl, this.ground, [0.9, 0.9, 0.9, 1.0], [0.9, 0.9, 0.9, 1.0]);


	//for (var i in this.buildings) {
	//	this.drawObject(gl, this.buildings[i], [0.8, 0.8, 0.8, 1.0], [0, 0, 0, 1.0]);
	//}

	gl.useProgram(null);
	gl.disable(gl.DEPTH_TEST);
};
/***********************************************************************/
NVMCClient.initializeCameras = function () {
	this.cameras[1].position = this.game.race.photoPosition;
};

// NVMC Client Events
/***********************************************************************/
NVMCClient.onInitialize = function () {
	var gl = this.ui.gl;

	/*************************************************************/
	NVMC.log("SpiderGL Version : " + SGL_VERSION_STRING + "\n");
	/*************************************************************/

	/*************************************************************/
	this.game.player.color = [1.0, 0.0, 0.0, 1.0];
	/*************************************************************/

	/*************************************************************/
	this.initMotionKeyHandlers();
	/*************************************************************/

	/*************************************************************/
	this.stack = new SglMatrixStack();

	this.initializeObjects(gl);
	this.initializeCameras();
	this.uniformShader = new uniformShader(gl);
	/*************************************************************/
};

NVMCClient.onKeyUp = function (keyCode, event) {
	if (keyCode == "2") {
		this.nextCamera();
		return;
	}
	if (keyCode == "1") {
		this.prevCamera();
		return;
	}

	if (this.carMotionKey[keyCode])
		this.carMotionKey[keyCode](false);

	this.cameras[this.currentCamera].keyUp(keyCode);
};
NVMCClient.onKeyDown = function (keyCode, event) {

	if (this.carMotionKey[keyCode])
		this.carMotionKey[keyCode](true);

	this.cameras[this.currentCamera].keyDown(keyCode);
};

NVMCClient.onMouseButtonDown = function (button, x, y, event) {
	this.cameras[this.currentCamera].mouseButtonDown(x,y);
};

NVMCClient.onMouseButtonUp = function (button, x, y, event) {
	this.cameras[this.currentCamera].mouseButtonUp();
};

NVMCClient.onMouseMove = function (x, y, event) {
	this.cameras[this.currentCamera].mouseMove(x,y);
};
