// Global NVMC Client
// ID 10.0
/***********************************************************************/
var NVMCClient = NVMCClient || {};
/***********************************************************************/

NVMCClient.depth_of_field_enabled = false;
NVMCClient.firstPassTextureTarget = null;
NVMCClient.depthOfFieldShader = null;

NVMCClient.texture_facade = [];
NVMCClient.texture_roof = null;
NVMCClient.texture_crystal = null;

NVMCClient.shadowMapTextureTarget = null;
NVMCClient.shadowMatrix = null;
NVMCClient.viewMatrix = null;

NVMCClient.playerJump = null;
NVMCClient.playerJumpCount = null;
NVMCClient.billboardCloudTree = null;
NVMCClient.billboardCloudTreeBody = null;

NVMCClient.billboardRenderer = null;
NVMCClient.billboardRendererBody = null;
NVMCClient.billboardTechnique = null;

//4.1
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
};//line 90}

NVMCClient.cameras = [];
NVMCClient.cameras[0] = new ChaseCamera();
NVMCClient.cameras[1] = new PhotographerCamera();
NVMCClient.currentCamera = 0;

NVMCClient.nextCamera = function () {
	if (this.n_cameras - 1 > this.currentCamera)
		this.currentCamera++;
};
NVMCClient.prevCamera = function () {
	if (0 < this.currentCamera)
		this.currentCamera--;
};


//4.2
function ObserverCamera() {
	//this.modes=		{wasd=0,trackball=1};
	this.currentMode = 0;
	this.V = SglMat4.identity();
	SglMat4.col$(this.V,3,[ 0.0, 20.0, 100.0, 1]);
	this.position =[];
	// variables for the wasd mode
	this.t_V = [0, 0, 0,0.0];
	this.alpha = 0;
	this.beta = 0;

	// variables for the trackball mode
	this.height = 0;
	this.width = 0;
	this.start_x = 0;
	this.start_y = 0;
	this.currX = 0;
	this.currY = 0;
	this.rad = 5;
	this.orbiting = false,
		this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	this.rotMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	this.tbMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	this.computeVector = function (x, y) {
		// in this implementation the trackball is supposed
		// to be centered 2*rad along -z
		D = 2 * this.rad;

		//find the intersection with the trackball surface
		// 1. find the vector leaving from the point of view and passing through the pixel x,y
		// 1.1 convert x and y in view coordinates
		xf = (x - this.width / 2) / this.width * 2.0;
		yf = (y - this.height / 2) / this.height * 2.0;

		invProjection = SglMat4.inverse(this.projectionMatrix);
		v = SglMat4.mul4(invProjection, [xf, yf, -1, 1]);
		v = SglVec3.muls(v, 1 / v[3]);

		h = Math.sqrt(v[0] * v[0] + v[1] * v[1]);

		// compute the intersection with the sphere
		a = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
		b = 2 * D * v[2];
		c = D * D - this.rad * this.rad;

		discriminant = b * b - 4 * a * c;
		if (discriminant > 0) {
			t = (-b - Math.sqrt(discriminant)) / (2 * a);
			t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
			if (t < 0) t = 100 * this.rad;
			if (t1 < 0) t1 = 100 * this.rad;
			if (t1 < t) t = t1;

			//check if th sphere must be used
			if (t * v[0] * t * v[0] + t * v[1] * t * v[1] < this.rad * this.rad / 2)
				return [t * v[0], t * v[1], t * v[2] + D];
		}

		// compute the intersection with the hyperboloid
		a = 2 * v[2] * h;
		b = 2 * D * h;
		c = -this.rad * this.rad;

		discriminant = b * b - 4 * a * c;
		t = (-b - Math.sqrt(discriminant)) / (2 * a);
		t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
		if (t < 0) t = 0;
		if (t1 < 0) t1 = 0;
		if (t < t1) t = t1;

		return [t * v[0], t * v[1], t * v[2] + D];

	};

	this.updateCamera = function () {
		if (this.currentMode == 1)
			return;

		var dir_world = SglMat4.mul4(this.V, this.t_V);
		var newPosition = [];
		newPosition = SglMat4.col(this.V,3);
		newPosition = SglVec4.add(newPosition, dir_world);

		SglMat4.col$(this.V,3,[0.0,0.0,0.0,1.0]);
		var R_alpha = SglMat4.rotationAngleAxis(sglDegToRad(this.alpha/10), [0, 1, 0]);
		var R_beta = SglMat4.rotationAngleAxis(sglDegToRad(this.beta/10), [1, 0, 0]);
		this.V = SglMat4.mul(SglMat4.mul(R_alpha, this.V), R_beta);
		SglMat4.col$(this.V,3,newPosition);
		this.position = newPosition;
		this.alpha = 0;
		this.beta = 0;
	};

	this.forward 		= function (on) {this.t_V = [0, 0, -on / 1.0,0.0]	;};
	this.backward 	    = function (on) {this.t_V = [0, 0, on / 1.0,0.0]	;};
	this.left 			= function (on) {this.t_V = [-on / 1.0, 0, 0,0.0]	;};
	this.right 			= function (on) {this.t_V = [on / 1.0, 0, 0,0.0]	;};
	this.up 			= function (on) {this.t_V = [ 0.0, on/3.0, 0,0.0]	;};
	this.down 			= function (on) {this.t_V = [0.0, -on/3.0, 0,0.0]	;};

	me = this;
	this.handleKeyObserver = {};
	this.handleKeyObserver["W"] = function (on) {me.forward(on)	;	};
	this.handleKeyObserver["S"] = function (on) {me.backward(on);	};
	this.handleKeyObserver["A"] = function (on) {me.left(on);		};
	this.handleKeyObserver["D"] = function (on) {me.right(on);		};
	this.handleKeyObserver["Q"] = function (on) {me.up(on);			};
	this.handleKeyObserver["E"] = function (on) {me.down(on);		};

	this.handleKeyObserver["M"] = function (on) {
		me.currentMode = 1;
	};
	this.handleKeyObserver["N"] = function (on) {
		me.currentMode = 0;
	};

	this.keyDown = function (keyCode) {
		this.handleKeyObserver[keyCode] && this.handleKeyObserver[keyCode](true);
	};
	this.keyUp = function (keyCode) {
		this.handleKeyObserver[keyCode] && this.handleKeyObserver[keyCode](false);
	};

	this.mouseButtonDown = function (x,y) {


		if (this.currentMode == 0) {
			this.aiming = true;
			this.start_x = x;
			this.start_y = y;
		} else {
			this.currX = x;
			this.currY = y;
			this.orbiting = true;
		}
	};
	this.mouseButtonUp = function (event) {//line 144,Listing pag 137{
		if (this.orbiting) {
			var invTbMatrix = SglMat4.inverse(this.tbMatrix);
			this.V	= SglMat4.mul(invTbMatrix, this.V);
			this.tbMatrix = SglMat4.identity();
			this.rotMatrix = SglMat4.identity();
			this.orbiting = false;
		}else
			this.aiming = false;
	};
	this.mouseMove = function (x,y) {



		if (this.currentMode == 0) {
			if (this.aiming) {
				this.alpha = x - this.start_x;
				this.beta = -(y - this.start_y);
				this.start_x = x;
				this.start_y = y;
				this.updateCamera();
			}
			return;
		}

		if (!this.orbiting) return;

		var newX = x;
		var newY = y;

		var p0_prime = this.computeVector(this.currX, this.currY);
		var p1_prime = this.computeVector(newX, newY);

		var axis = SglVec3.cross(p0_prime, p1_prime);
		var axis_length = SglVec3.length(SglVec3.sub(p0_prime, p1_prime));
		var angle = axis_length / this.rad;
		angle= Math.acos(SglVec3.dot(p0_prime,p1_prime)/(SglVec3.length(p0_prime)*SglVec3.length(p1_prime)));
		if (angle > 0.00001) {
			this.rotMatrix = SglMat4.mul(SglMat4.rotationAngleAxis(angle, SglMat4.mul3(this.V, axis,0.0)), this.rotMatrix);
		}

		var cz = SglVec3.length(SglMat4.col(this.V, 2));
		var dir_world = SglVec3.muls(SglMat4.col(this.V, 2), -2 * this.rad);
		var tbCenter = SglVec3.add(SglMat4.col(this.V,3), dir_world);

		var tMatrixInv = SglMat4.translation(tbCenter);
		var tMatrix = SglMat4.translation(SglVec3.neg(tbCenter));

		this.tbMatrix = SglMat4.mul(tMatrixInv, SglMat4.mul(this.rotMatrix, tMatrix));

		this.currX = newX;
		this.currY = newY;
	}
	this.setView = function (stack) {
		this.updateCamera();
		var invV = SglMat4.inverse(this.V);
		stack.multiply(invV);
		stack.multiply(this.tbMatrix);
	}
};
NVMCClient.cameras[2] = new ObserverCamera();
//NVMCClient.n_cameras = 3;
NVMCClient.initializeCameras = function () {
	this.cameras[1].position = this.game.race.photoPosition;
	this.cameras[2].position = this.game.race.observerPosition;
}
//5.0
NVMCClient.cabin = null;
NVMCClient.windshield = null;
NVMCClient.rearmirror = null;
NVMCClient.createColoredObjectBuffers = function (gl, obj) {
	obj.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	obj.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, obj.vertex_color, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	obj.indexBufferTriangles = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

};
NVMCClient.drawColoredObject = function (gl, obj, lineColor) {
	// Draw the primitive
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.enableVertexAttribArray(this.perVertexColorShader.aPositionIndex);
	gl.vertexAttribPointer(this.perVertexColorShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
	gl.enableVertexAttribArray(this.perVertexColorShader.aColorIndex);
	gl.vertexAttribPointer(this.perVertexColorShader.aColorIndex, 4, gl.FLOAT, false, 0, 0);

	gl.enable(gl.POLYGON_OFFSET_FILL);

	gl.polygonOffset(1.0, 1.0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
	gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
};


function DriverCamera() {
	this.position = [];
	this.keyDown = function (keyCode) {}
	this.keyUp = function (keyCode) {}

	this.mouseMove = function (event) {};

	this.mouseButtonDown = function (event) {};

	this.mouseButtonUp = function () {}

	this.setView = function (stack, frame) {
		var driverFrame = SglMat4.dup(frame);
		var pos = SglMat4.col(driverFrame, 3);
		SglMat4.col$(driverFrame, 3, SglVec4.add(pos, [0, 1.5, 0, 0]));
		var invV = SglMat4.inverse(driverFrame);
		stack.multiply(invV);
	};
};
NVMCClient.cameras[3] = new DriverCamera();
NVMCClient.n_cameras = 4;


//6.0
NVMCClient.sgl_car_model = null;
NVMCClient.sgl_renderer = null;
NVMCClient.sunLightDirection = SglVec4.normalize([1, -0.5, 0, 0,0.0]);
NVMCClient.loadCarModel = function (gl, data) {//line 158, Listing 6.5{
	if (!data)
	//data = NVMC.resource_path+"geometry/cars/eclipse/eclipse.obj";
		data = NVMC.resource_path+"hero/jibunnoibasyo.obj";
	var that = this;
	this.sgl_car_model = null;
	//sglRequestObj(data, function (modelDescriptor) {
	sglRequestObj(data, function (modelDescriptor) {
		that.sgl_car_model = new SglModel(that.ui.gl, modelDescriptor);
		//that.sgl_car_model.texture = that.createTexture(gl,NVMC.resource_path+'Clefairy/pippidoll.png'	);
		//that.sgl_car_model.textureSgl = null;
		that.ui.postDrawEvent();
	});
	//sglRequestObj(data, function (modelDescriptor) {
	//	that.sgl_car_model = new SglModel(gl, modelDescriptor);
	//	//me.billboardCloudTree.texture = me.createTexture(gl,NVMC.resource_path+'geometry/tree/leaves.png'	);
	//	that.sgl_car_model.texture = me.createTexture(gl,NVMC.resource_path+'Clefairy/pippidoll.png'	);
	//	that.sgl_car_model.textureSgl = null;
	//
	//});
};//line 167}


//7.1
NVMCClient.rearMirrorTextureTarget = null;//line 6, Listing 7.5{
TextureTarget = function () {
	this.framebuffer = null;
	this.texture = null;
};
NVMCClient.prepareRenderToTextureFrameBuffer = function (gl, generateMipmap, w, h) {
	var textureTarget = new TextureTarget();
	textureTarget.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, textureTarget.framebuffer);

	if (w) textureTarget.framebuffer.width = w;
	else textureTarget.framebuffer.width = 512;
	if (h) textureTarget.framebuffer.height = h;
	else textureTarget.framebuffer.height = 512;;

	textureTarget.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, textureTarget.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureTarget.framebuffer.width, textureTarget.framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	if (generateMipmap) gl.generateMipmap(gl.TEXTURE_2D);

	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureTarget.framebuffer.width, textureTarget.framebuffer.height);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureTarget.texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	return textureTarget;
}//line 44}

NVMCClient.createTexture = function (gl, data, nomipmap) {
	var texture = gl.createTexture();
	texture.image = new Image();
	texture.image.crossOrigin = "anonymous"; // this line is needed only in local-noserv mode (not in the book)
	NVMCClient.n_resources_to_wait_for++;
	var that = texture;
	texture.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, that);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		if (nomipmap) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		if (!nomipmap) gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		NVMCClient.n_resources_to_wait_for--;
	};

	texture.image.src = data;
	return texture;
}
NVMCClient.createObjectBuffers = function (gl, obj, createColorBuffer, createNormalBuffer, createTexCoordBuffer) {
	obj.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	if (createColorBuffer) {
		obj.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, obj.vertex_color, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	if (createNormalBuffer) {
		obj.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, obj.vertex_normal, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	if (createTexCoordBuffer) {
		obj.textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, obj.textureCoord, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

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
NVMCClient.drawObject = function (gl, obj, shader, fillColor, drawWire) {
	// Draw the primitive
	gl.useProgram(shader);
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.enableVertexAttribArray(shader.aPositionIndex);
	gl.vertexAttribPointer(shader.aPositionIndex, 3, gl.FLOAT, false, 0, 0);


	if (shader.aColorIndex && obj.colorBuffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
		gl.enableVertexAttribArray(shader.aColorIndex);
		gl.vertexAttribPointer(shader.aColorIndex, 4, gl.FLOAT, false, 0, 0);
	}

	if (shader.aNormalIndex && obj.normalBuffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
		gl.enableVertexAttribArray(shader.aNormalIndex);
		gl.vertexAttribPointer(shader.aNormalIndex, 3, gl.FLOAT, false, 0, 0);
	}

	if (shader.aTextureCoordIndex && obj.textureCoordBuffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.textureCoordBuffer);
		gl.enableVertexAttribArray(shader.aTextureCoordIndex);
		gl.vertexAttribPointer(shader.aTextureCoordIndex, 2, gl.FLOAT, false, 0, 0);
	}

	if (fillColor && shader.uColorLocation) gl.uniform4fv(shader.uColorLocation, fillColor);

	gl.enable(gl.POLYGON_OFFSET_FILL);

	gl.polygonOffset(1.0, 1.0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
	gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	if (drawWire) {
		gl.disable(gl.POLYGON_OFFSET_FILL);

		gl.useProgram(this.uniformShader);
		gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixMatrixLocation, false, this.stack.matrix);

		gl.uniform4fv(this.uniformShader.uColorLocation, [0, 0, 1, 1]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
		gl.drawElements(gl.LINES, obj.numTriangles * 3 * 2, gl.UNSIGNED_SHORT, 0);
		gl.useProgram(shader);
	}

};

NVMCClient.createObjects = function () {
	this.cube = new Cube(10);
	this.cylinder = new Cylinder(10);
	this.cone = new Cone(10);

	this.track = new TexturedTrack(this.game.race.track, 0.2);

	var bbox = this.game.race.bbox;
	var quad = [bbox[0], bbox[1] - 0.01, bbox[2], bbox[3], bbox[1] - 0.01, bbox[2], bbox[3], bbox[1] - 0.01, bbox[5], bbox[0], bbox[1] - 0.01, bbox[5]];
	var text_coords = [-200, -200, 200, -200, 200, 200, -200, 200];
	this.ground = new TexturedQuadrilateral(quad, text_coords);
	this.cabin = new CabinNoMirror();
	this.windshield = new Windshield();
	this.rearMirror = new RearMirror();

	var gameBuildings = this.game.race.buildings;
	this.buildings = new Array(gameBuildings.length);
	for (var i = 0; i < gameBuildings.length; ++i) {
		this.buildings[i] = new TexturedFacades(gameBuildings[i], 1);
		this.buildings[i].roof = new TexturedRoof(gameBuildings[i], 5);
	}
	this.crystals = []
	for (var i = 0; i < 50; i++) {
		var xyz = [];
		xyz.push(Math.random() * 200 - 100);
		xyz.push(Math.random() * 5 + 0.6);
		xyz.push(Math.random() * 200 - 100);
		this.crystals.push(new TexturedCrystal(xyz, text_coords));
	}
};

NVMCClient.createBuffers = function (gl) {
	this.createObjectBuffers(gl, this.cube, false, false, false);

	ComputeNormals(this.cylinder);
	this.createObjectBuffers(gl, this.cylinder, false, true, false);


	ComputeNormals(this.cone);
	this.createObjectBuffers(gl, this.cone, false, true, false);


	this.createObjectBuffers(gl, this.track, false, false, true);
	this.createObjectBuffers(gl, this.ground, false, false, true);

	this.createObjectBuffers(gl, this.cabin, true, false, false);
	this.createObjectBuffers(gl, this.windshield, true, false, false);

	this.createObjectBuffers(gl, this.rearMirror, false, false, true);

	for (var i = 0; i < this.buildings.length; ++i) {
		this.createObjectBuffers(gl, this.buildings[i], false, false, true);
		this.createObjectBuffers(gl, this.buildings[i].roof, false, false, true);
	}
	for (var i = 0; i < this.crystals.length; ++i) {
		this.createObjectBuffers(gl, this.crystals[i], false, false, true);
	}
};

NVMCClient.initializeObjects = function (gl) {
	this.createObjects();
	this.createBuffers(gl);
};



//7.2
NVMCClient.normal_map_street;

//7.3
NVMCClient.cubeMap = null;
NVMCClient.skyBoxShader = null;
NVMCClient.setCubeFace = function (gl, texture, face, imgdata) {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	//
	gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgdata);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}
NVMCClient.loadCubeFace = function (gl, texture, face, path) {
	NVMCClient.n_resources_to_wait_for++;
	var imgdata = new Image();
	imgdata.crossOrigin = "anonymous"; // this line is needed only in local-noserv mode (not in the book)
	var that = this;
	imgdata.onload = function () {
		that.setCubeFace(gl, texture, face, imgdata);
		NVMCClient.n_resources_to_wait_for--;
	}
	imgdata.src = path;
}
NVMCClient.createCubeMap = function (gl, posx, negx, posy, negy, posz, negz) {
	var texture = gl.createTexture();
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_X, posx);
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, negx);
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, posy);
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, negy);
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, posz);
	this.loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, negz);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

	return texture;
}

NVMCClient.drawSkyBox = function (gl) {//line 47, Listnig 7.6
	gl.useProgram(this.skyBoxShader);
	gl.uniformMatrix4fv(this.skyBoxShader.uProjectionMatrixLocation, false, this.projectionMatrix);
	var orientationOnly = this.stack.matrix;
	SglMat4.col$(orientationOnly, 3, [0.0, 0.0, 0.0, 1.0]);

	gl.uniformMatrix4fv(this.skyBoxShader.uModelViewMatrixLocation, false, orientationOnly);
	gl.uniform1i(this.skyBoxShader.uCubeMapLocation, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMap);
	gl.disable(gl.DEPTH_TEST);
	gl.depthMask(false);
	this.drawObject(gl, this.cube, this.skyBoxShader);
	gl.enable(gl.DEPTH_TEST);
	gl.depthMask(true);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}//line 64}

//7.4
NVMCClient.reflectionMap = null;
NVMCClient.reflectionMapShader = null;
NVMCClient.cubeMapFrameBuffers = [];
NVMCClient.prepareRenderToCubeMapFrameBuffer= function (gl) {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.reflectionMap);
	var faces = [ 	gl.TEXTURE_CUBE_MAP_POSITIVE_X,gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
		gl.TEXTURE_CUBE_MAP_POSITIVE_Y,gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
		gl.TEXTURE_CUBE_MAP_POSITIVE_Z,gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];

	for(var f = 0; f < 6; ++f){
		var newframebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, newframebuffer);
		newframebuffer.width = 512;
		newframebuffer.height = 512;

		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, newframebuffer.width, newframebuffer.height);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, faces[f], this.reflectionMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

		var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status != gl.FRAMEBUFFER_COMPLETE) {
			throw("gl.checkFramebufferStatus() returned " + WebGLDebugUtils.glEnumToString(status));
		}
		this.cubeMapFrameBuffers [f] = newframebuffer;

	}

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
NVMCClient.createTechniqueReflection = function (gl){

	this.sgl_renderer = new SglModelRenderer(gl);
	this.sgl_technique = new SglTechnique( gl,
		{	vertexShader	:this.reflectionMapShader.vertexShaderSource,
			fragmentShader	:this.reflectionMapShader.fragmentShaderSource,
			vertexStreams 		:
			{
				"aPosition"		: [ 0.0,0.0,0.0],
				"aDiffuse"		: [ 0.0,0.0,0.0,1.0],
				"aSpecular"		: [ 0.0,0.0,0.0,1.0],
				"aNormal" 		: [ 0.0,1.0,1.0],
				"aAmbient" 		: [ 0.0,1.0,1.0,1.0]
			},
			globals : {
				"uProjectionMatrix" : { semantic : "PROJECTION_MATRIX", value : this.projectionMatrix },
				"uModelViewMatrix":{semantic:"WORLD_VIEW_MATRIX",value : this.stack.matrix },
				"uViewSpaceNormalMatrix"     : { semantic : "VIEW_SPACE_NORMAL_MATRIX",     value :SglMat4.to33(this.stack.matrix) },
				"uViewToWorldMatrix": { semantic : "VIEW_TO_WORLD_MATRIX",     value :SglMat4.identity()},
				"uCubeMap":						{semantic: "CUBE_MAP", value:2},
				"uLightDirection": 		{semantic: "LIGHTS_GEOMETRY",value: this.sunLightDirectionViewSpace},
				"uLightColor": 				{semantic: "LIGHT_COLOR",value: [0.4,0.4,0.4]},
			}
		});
};


NVMCClient.createReflectionMap = function(gl){
	this.reflectionMap = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP,  this.reflectionMap);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X,		0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 	0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 	0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 	0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 	0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 	0, 	gl.RGBA, 512,512,0,	gl.RGBA, 	gl.UNSIGNED_BYTE,null);

	gl.texParameteri(	gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(	gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(	gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(	gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

NVMCClient.drawOnReflectionMap = function (gl, position){//line61, Listing 7.9{
	this.projectionMatrix = SglMat4.perspective(Math.PI/2.0,1.0,0.1,300);
	gl.viewport(0,0,this.cubeMapFrameBuffers[0].width,this.cubeMapFrameBuffers[0].height);
	gl.clearColor(0,0,0,1);
	// +x
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[1.0,0.0,0.0]),[0.0,-1.0,0.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[0]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[0]);

	// -x
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[-1.0,0.0,0.0]),[0.0,-1.0,0.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[1]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);//line 76}
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[1]);

	// +z
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[0.0,0.0,1.0]),[0.0,-1.0,0.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[4]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[2]);

	// -z
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[0.0,0.0,-1.0]),[0.0,-1.0,0.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[5]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[3]);

	// +y
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[0.0,1.0,0.0]),[0.0,0.0,1.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[2]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[4]);

	// -y
	this.stack.load(SglMat4.lookAt(position,SglVec3.add(position,[ 0.0,-1.0,1.0]),[0.0,0.0,-1.0]));
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.cubeMapFrameBuffers[3]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.drawSkyBox(gl);
	this.drawEverything(gl,true, this.cubeMapFrameBuffers[5]);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

//
NVMCClient.createFullScreenQuad = function (gl) {
	var quad = [	-1.0,-1,0,
		1.0,-1,0,
		1.0,1,0,
		-1.0,1,0];
	var text_coords = 	[ 0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0];
	this.quad = new TexturedQuadrilateral(quad,text_coords);
	this.createObjectBuffers(gl, this.quad,false,false,true);
};


// billboard
function AxisAlignedBillboard(gl, pos, s) {
	this.s = s;
	this.pos = pos;
	this.orientation = [];
};

function TreesBillboards() {
	this.billboards = [];
	this.texture = null;
	this.order = [];
};

NVMCClient.createTreesBillboards = function (gl) {
	var quad_geo = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];
	var text_coords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
	this.billboard_quad = new TexturedQuadrilateral(quad_geo, text_coords);
	this.createObjectBuffers(gl, this.billboard_quad, false, false, true);

	this.billboard_trees = new TreesBillboards();
	this.billboard_trees.texture = this.createTexture(gl, NVMC.resource_path+'textures/tree.png');
	var trees = this.game.race.trees;
	for (var i in trees) {
		this.billboard_trees.billboards[i] = new AxisAlignedBillboard(gl, trees[i].position, [1.0, 1.6]);
		this.billboard_trees.order[i] = i;
	}
};

NVMCClient.loadBillboardCloud = function (gl){
	var stack = this.stack;
	var me = this;

	sglRequestObj(NVMC.resource_path+"geometry/tree/tree-leaves-only.obj", function (modelDescriptor) {
		//sglRequestObj(NVMC.resource_path+"Clefairy/pippidoll.obj", function (modelDescriptor) {
		me.billboardCloudTree = new SglModel(gl, modelDescriptor);
		me.billboardCloudTree.order = [];
		for(var i in me.game.race.trees)
			me.billboardCloudTree.order[i] = i;
		me.billboardCloudTree.texture = me.createTexture(gl,NVMC.resource_path+'geometry/tree/leaves.png'	);
		//me.billboardCloudTree.texture = me.createTexture(gl,NVMC.resource_path+'Clefairy/pippidoll.png'	);
		me.billboardCloudTree.textureSgl = null;

	});

	sglRequestObj(NVMC.resource_path+"geometry/tree/tree-body-only.obj", function (modelDescriptor) {
		me.billboardCloudTreeBody = new SglModel(gl, modelDescriptor);
	});


	this.billboardRenderer = new SglModelRenderer(gl);
	this.billboardTechnique = new SglTechnique( gl,
		{	vertexShader	:this.billboardShader.vertex_shader,
			fragmentShader	:this.billboardShader.fragment_shader,
			vertexStreams 		:
			{
				"aPosition"	    : [ 0.0,0.0,0.0,0.0],
				"aTexCoord" 	: [ 0.25,0.25,0.0,1.0]
			},
			globals : {
				"uProjectionMatrix" :   {   semantic:   "PROJECTION_MATRIX" ,value  : this.projectionMatrix },
				"uModelViewMatrix"  :   {   semantic:   "WORLD_VIEW_MATRIX" ,value  : this.stack.matrix     },
				"uTexture"          :   {   semantic:   "TEXTURE"           ,value  : 0                     }
			}
		});
	this.billboardRendererBody = new SglModelRenderer(gl);
	this.billboardTechniqueBody = new SglTechnique( gl,{
		vertexShader	:this.lambertianSingleColorShader.vertex_shader,
		fragmentShader	:this.lambertianSingleColorShader.fragment_shader,
		vertexStreams 		:
		{
			"aPosition"	    : [ 0.0,0.0,0.0,0.0],
			"aColor"		: [ 0.0,0.0,0.0,0.0],
			"Normal"		: [ 0.0,0.0,0.0,0.0]
		},
		globals : {
			"uProjectionMatrix" : { semantic : "PROJECTION_MATRIX", value : this.projectionMatrix },
			"uModelViewMatrix":{semantic:"WORLD_VIEW_MATRIX",value : this.stack.matrix },
			"uViewSpaceNormalMatrix":{semantic:"VIEWSPACE_NORMAL_MATRIX",value: SglMat4.to33(this.stack.matrix)},
			"uColor":{semantic:"COLOR",value : [0.2,0.0,0.0] },
			"uLightColor":{semantic:"LIGHT_COLOR",value : [0.8,0.8,0.8] },
			"uLightDirection":{semantic:"LIGHT_DIRECTION",value:[1,0,0]},
		}
	});

};
NVMCClient.drawTrees = function (gl,framebuffer){
	if(!this.billboardCloudTree) return;
	if(framebuffer)
		var fb = new SglFramebuffer(gl, {handle: framebuffer,autoViewport:false});

	var ma = this.stack.matrix;
	var pos  = this.cameras[this.currentCamera].position;

	var bbt = this.billboardCloudTree;
	var trees = this.game.race.trees;
	bbt.order.sort(function(a,b) {
		return SglVec3.length(SglVec3.sub(trees[b].position,pos)) - SglVec3.length(SglVec3.sub(trees[a].position,pos))
	});

	this.billboardRendererBody.begin();
	if(framebuffer)
		this.billboardRendererBody.setFramebuffer(fb);

	this.billboardRendererBody.setTechnique(this.billboardTechniqueBody);

	this.billboardRendererBody.setGlobals({
		"PROJECTION_MATRIX": this.projectionMatrix,
		"WORLD_VIEW_MATRIX": this.stack.matrix,
		"VIEWSPACE_NORMAL_MATRIX":SglMat4.to33(this.stack.matrix),
		"COLOR":[100.0/255,70.0/255,0.0,1.0],
		"LIGHT_COLOR":[0.8,0.8,0.8],
		"LIGHT_DIRECTION":this.sunLightDirectionViewSpace
	});

	this.billboardRendererBody.setPrimitiveMode("FILL");
	this.billboardRendererBody.setModel(this.billboardCloudTreeBody);

	for(var i in trees){
		var tpos = trees[bbt.order[i]].position;
		this.stack.push();
		this.stack.multiply(SglMat4.translation(tpos));
		this.stack.multiply(SglMat4.scaling([0.5,0.5,0.5]));
		this.billboardRendererBody.setGlobals({
			"WORLD_VIEW_MATRIX": this.stack.matrix,
		});
		this.billboardRendererBody.renderModel();
		this.stack.pop();
	}

	this.billboardRendererBody.end();

	if( !this.billboardCloudTree.textureSgl)
		this.billboardCloudTree.textureSgl = new SglTexture2D(gl,this.billboardCloudTree.texture );
	gl.depthMask(false);
	gl.enable(gl.BLEND);
	gl.blendFunc( gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
	this.billboardRenderer.begin();
	if(framebuffer)
		this.billboardRenderer.setFramebuffer(fb);
	this.billboardRenderer.setTechnique(this.billboardTechnique);


	this.billboardRenderer.setGlobals({
		"PROJECTION_MATRIX": this.projectionMatrix,
		"WORLD_VIEW_MATRIX": this.stack.matrix,
		"TEXTURE": 0,
	});

	this.billboardRenderer.setPrimitiveMode("FILL");
	this.billboardRenderer.setTexture(0,this.billboardCloudTree.textureSgl);
	this.billboardRenderer.setModel(this.billboardCloudTree);

	for(var i in trees){
		var tpos = trees[bbt.order[i]].position;
		this.stack.push();
		this.stack.multiply(SglMat4.translation(tpos));
		this.stack.multiply(SglMat4.scaling([0.5,0.5,0.5]));
		this.billboardRenderer.setGlobals({
			"WORLD_VIEW_MATRIX": this.stack.matrix,
		});
		this.billboardRenderer.renderModel();

		this.stack.pop();
	}
	this.billboardRenderer.end();

	gl.disable(gl.BLEND);
	gl.depthMask(true);

};
NVMCClient.drawTreeDepthOnly = function (gl) {
	var stack = this.stack;

	stack.push();
	var M_0_tra1 = SglMat4.translation([0, 0.8, 0]);
	stack.multiply(M_0_tra1);

	var M_0_sca = SglMat4.scaling([0.6, 1.65, 0.6]);
	stack.multiply(M_0_sca);

	gl.uniformMatrix4fv(this.shadowMapCreateShader.uShadowMatrixLocation, false, stack.matrix);
	var InvT = SglMat4.inverse(this.stack.matrix)
	InvT = SglMat4.transpose(InvT);
	this.drawObject(gl, this.cone, this.shadowMapCreateShader);
	stack.pop();

	stack.push();
	var M_1_sca = SglMat4.scaling([0.25, 0.4, 0.25]);
	stack.multiply(M_1_sca);

	gl.uniformMatrix4fv(this.shadowMapCreateShader.uShadowMatrixLocation, false, stack.matrix);
	this.drawObject(gl, this.cylinder, this.shadowMapCreateShader);
	stack.pop();
};
NVMCClient.drawCarDepthOnly = function (gl) {
	var fb = new SglFramebuffer(gl, {handle: this.shadowMapTextureTarget.framebuffer,autoViewport:false});

	this.depthOnlyRenderer.begin();
	this.depthOnlyRenderer.setFramebuffer(fb);

	this.depthOnlyRenderer.setTechnique(this.depthOnlyTechnique);

	this.depthOnlyRenderer.setGlobals({
		"SHADOW_MATRIX": this.stack.matrix
	});

	this.depthOnlyRenderer.setPrimitiveMode("FILL");

	this.depthOnlyRenderer.setModel(this.sgl_car_model);
	this.depthOnlyRenderer.renderModel();
	this.depthOnlyRenderer.end();
};
NVMCClient.drawShadowCastersDepthOnly = function (gl) {

	var pos  = this.game.state.players.me.dynamicState.position;

	for (var i in this.buildings){
		this.drawObject(gl, this.buildings[i],this.shadowMapCreateShader);
	}
	for (var i in this.buildings){
		this.drawObject(gl, this.buildings[i].roof,this.shadowMapCreateShader);
	}
	for (var i in this.crystals){
		this.drawObject(gl, this.crystals[i],this.shadowMapCreateShader);
	}

	var trees = this.game.race.trees;
	for (var t in trees) {
		this.stack.push();
		var M_8 = SglMat4.translation(trees[t].position);
		this.stack.multiply(M_8);
		this.drawTreeDepthOnly(gl,this.shadowMapCreateShader);
		this.stack.pop();
	}

	var M_9 = SglMat4.translation(pos);
	this.stack.multiply(M_9);

	var M_9bis = SglMat4.rotationAngleAxis(this.game.state.players.me.dynamicState.orientation, [0, 1, 0]);
	this.stack.multiply(M_9bis);

	this.drawCarDepthOnly(gl);
};

NVMCClient.createTechniqueShadow = function (gl){
	this.sgl_renderer = new SglModelRenderer(gl);
	this.sgl_technique = new SglTechnique( gl,
		{	vertexShader	:this.reflectionMapShadowShader.vertex_shader,
			fragmentShader	:this.reflectionMapShadowShader.fragment_shader,
			vertexStreams 		:
			{
				"aPosition"		: [ 0.0,0.0,0.0],
				"aDiffuse"		: [ 0.0,0.0,0.0,1.0],
				"aSpecular"		: [ 0.0,0.0,0.0,1.0],
				"aNormal" 		: [ 0.0,1.0,1.0 ],
				"aAmbient"		: [ 0.0,0.0,0.0,1.0]
			},
			globals : {
				"uProjectionMatrix" : { semantic : "PROJECTION_MATRIX", value : this.projectionMatrix },
				"uModelViewMatrix":{semantic:"WORLD_VIEW_MATRIX",value : this.stack.matrix },
				"uViewSpaceNormalMatrix"     : { semantic : "VIEW_SPACE_NORMAL_MATRIX",     value :SglMat4.to33(this.stack.matrix) },
				"uViewToWorldMatrix"     : { semantic : "VIEW_TO_WORLD_MATRIX",     value :SglMat4.identity()},
				"uShadowMatrix"     : { semantic : "SHADOW_MATRIX",     value :SglMat4.identity()},
				"uCubeMap":{semantic: "CUBE_MAP", value:2},
				"uShadowMap":{semantic:"SHADOW_MAP",value:1},
				"uLightDirection": 		{semantic: "LIGHTS_GEOMETRY",value: this.sunLightDirectionViewSpace},
				"uLightColor": 				{semantic: "LIGHT_COLOR",value: [0.9,0.9,0.9]},
				"uAmbient": 					{semantic: "AMBIENT",value: [0.4,0.4,0.4]},			}
		});

};
NVMCClient.createDepthOnlyTechnique = function (gl) {
	this.depthOnlyRenderer = new SglModelRenderer(gl);
	this.depthOnlyTechnique = new SglTechnique(gl, {
		vertexShader: this.shadowMapCreateShader.vertex_shader,
		fragmentShader: this.shadowMapCreateShader.fragment_shader,
		vertexStreams: {
			"a_position": [0.0, 0.0, 0.0, 1.0]
		},
		globals: {
			"uShadowMatrix": {
				semantic: "SHADOW_MATRIX",
				value: this.stack.matrix
			}
		}

	});

};


updateBBox = function ( bbox, newpoint){
	if(newpoint[0] < bbox[0]) bbox[0] = newpoint[0];
	else
	if(newpoint[0] > bbox[3]) bbox[3] = newpoint[0];

	if(newpoint[1] < bbox[1]) bbox[1] = newpoint[1];
	else
	if(newpoint[1] > bbox[4]) bbox[4] = newpoint[1];

	if(newpoint[2] < bbox[2]) bbox[2] = newpoint[2];
	else
	if(newpoint[2] > bbox[5]) bbox[5] = newpoint[2];

	return bbox;

};

enlargeBBox = function (bbox,perc){
	var center =[];
	center[0] =  (bbox[0]+bbox[3])*0.5;
	center[1] =  (bbox[1]+bbox[4])*0.5;
	center[2] =  (bbox[2]+bbox[5])*0.5;

	bbox[0] += (bbox[0] - center[0]) * perc;
	bbox[1] += (bbox[1] - center[1]) * perc;
	bbox[2] += (bbox[2] - center[2]) * perc;
	bbox[3] += (bbox[3] - center[0]) * perc;
	bbox[4] += (bbox[4] - center[1]) * perc;
	bbox[5] += (bbox[5] - center[2]) * perc;
	return bbox;
}

NVMCClient.findMinimumViewWindow = function (bbox, projMatrix){
	var bbox_vs = [];

	// corner 0,0,0
	var p = SglMat4.mul4(projMatrix,[bbox[0],bbox[1],bbox[2],1.0]) ;
	p = SglVec4.divs(p,p[3]);
	bbox_vs = [p[0],p[1],p[2],p[0],p[1],p[2]];

	// corner 1,0,0
	p = SglMat4.mul4(projMatrix,[bbox[3],bbox[1],bbox[2],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);

	// corner 1,1,0
	p = SglMat4.mul4(projMatrix,[bbox[3],bbox[4],bbox[2],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);


	// corner 0,1,0
	p = SglMat4.mul4(projMatrix,[bbox[0],bbox[4],bbox[2],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);


	// corner 0,0,1
	var p = SglMat4.mul4(projMatrix,[bbox[0],bbox[1],bbox[5],1.0]) ;
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);

	// corner 1,0,1
	p = SglMat4.mul4(projMatrix,[bbox[3],bbox[1],bbox[5],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);

	// corner 1,1,1
	p = SglMat4.mul4(projMatrix,[bbox[3],bbox[4],bbox[5],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);


	// corner 0,1,1
	p = SglMat4.mul4(projMatrix,[bbox[0],bbox[4],bbox[5],1]);
	p = SglVec4.divs(p,p[3]);
	bbox_vs = updateBBox(bbox_vs,[p[0],p[1],p[2]]);

	return bbox_vs;
};


NVMCClient.drawDepthOnly = function (gl) {
	var pos = this.game.state.players.me.dynamicState.position;

	for (var i in this.buildings) {
		this.drawObject(gl, this.buildings[i], this.shadowMapCreateShader);
	}
	for (var i in this.buildings) {
		this.drawObject(gl, this.buildings[i].roof, this.shadowMapCreateShader);
	}
	for (var i in this.crystals) {
		this.drawObject(gl, this.crystals[i], this.shadowMapCreateShader);
	}

	this.drawObject(gl, this.ground, this.shadowMapCreateShader);

	var trees = this.game.race.trees;
	for (var t in trees) {
		this.stack.push();
		var M_8 = SglMat4.translation(trees[t].position);
		this.stack.multiply(M_8);
		this.drawTreeDepthOnly(gl, this.shadowMapCreateShader);
		this.stack.pop();
	}

	var M_9 = SglMat4.translation(pos);
	this.stack.multiply(M_9);

	var M_9bis = SglMat4.rotationAngleAxis(this.game.state.players.me.dynamicState.orientation, [0, 1, 0]);
	this.stack.multiply(M_9bis);

	this.drawCarDepthOnly(gl);
};

NVMCClient.drawCar = function (gl, framebuffer){
	if (!this.sgl_car_model) return;
	var fb;
	if (framebuffer) fb = new SglFramebuffer(gl, {handle: framebuffer,autoViewport: false});
 	this.sgl_renderer.begin();

  if (framebuffer) this.sgl_renderer.setFramebuffer(fb);

	 	this.sgl_renderer.setTechnique(this.sgl_technique);
  	this.sgl_renderer.setGlobals({
 				"PROJECTION_MATRIX":this.projectionMatrix,
				"WORLD_VIEW_MATRIX":this.stack.matrix,
				"VIEW_SPACE_NORMAL_MATRIX" : SglMat4.to33(this.stack.matrix) ,
				"CUBE_MAP"            : 2,
				"VIEW_TO_WORLD_MATRIX": this.viewFrame,
				"LIGHTS_GEOMETRY":		this.sunLightDirectionViewSpace,
				"LIGHT_COLOR":	[0.9,0.9,0.9],
				"AMBIENT": [0.3,0.3,0.3]
		});
   
   	this.sgl_renderer.setPrimitiveMode("FILL");
   	
  	this.sgl_renderer.setModel(this.sgl_car_model);
 	this.sgl_renderer.setTexture(2,new SglTextureCubeMap(gl,this.reflectionMap));
	this.sgl_renderer.renderModel();
	this.sgl_renderer.end();
};

NVMCClient.drawEverything = function (gl, excludeCar, framebuffer) {
	var stack = this.stack;
	this.sunLightDirectionViewSpace = SglMat4.mul4(this.stack.matrix, this.sunLightDirection);
	var pos = this.game.state.players.me.dynamicState.position;

	// Setup projection matrix
	gl.useProgram(this.uniformShader);
	gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, this.projectionMatrix);

	gl.useProgram(this.phongShader);
	gl.uniformMatrix4fv(this.phongShader.uProjectionMatrixLocation, false, this.projectionMatrix);
	gl.uniformMatrix4fv(this.phongShader.uModelViewMatrixLocation, false, stack.matrix);
	gl.uniformMatrix3fv(this.phongShader.uViewSpaceNormalMatrixLocation, false, SglMat4.to33(this.stack.matrix));
	gl.uniform4fv(this.phongShader.uLightDirectionLocation, this.sunLightDirectionViewSpace);

	gl.uniform3fv(this.phongShader.uLightColorLocation, [0.9, 0.9, 0.9]);
	gl.uniform1f(this.phongShader.uShininessLocation, 0.2);
	gl.uniform1f(this.phongShader.uKaLocation, 0.5);
	gl.uniform1f(this.phongShader.uKdLocation, 0.5);
	gl.uniform1f(this.phongShader.uKsLocation, 1.0);

	gl.useProgram(this.textureNormalMapShader);
	gl.uniformMatrix4fv(this.textureNormalMapShader.uProjectionMatrixLocation, false, this.projectionMatrix);
	gl.uniformMatrix4fv(this.textureNormalMapShader.uModelViewMatrixLocation, false, stack.matrix);
	gl.uniform1i(this.textureNormalMapShader.uTextureLocation, 0);
	gl.uniform1i(this.textureNormalMapShader.uNormalMapLocation, 1);
	gl.uniform4fv(this.textureNormalMapShader.uLightDirectionLocation, this.sunLightDirection);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture_street);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.normal_map_street);
	this.drawObject(gl, this.track, this.textureNormalMapShader, [0.9, 0.8, 0.7, 1.0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture_ground);

	gl.useProgram(this.textureShader);
	gl.uniformMatrix4fv(this.textureShader.uProjectionMatrixLocation, false, this.projectionMatrix);
	gl.uniformMatrix4fv(this.textureShader.uModelViewMatrixLocation, false, stack.matrix);
	gl.uniform1i(this.textureShader.uTextureLocation, 0);
	this.drawObject(gl, this.ground, this.textureShader, [0.3, 0.7, 0.2, 1.0], [0, 0, 0, 1.0]);

	for (var i in this.buildings) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture_facade[i%this.texture_facade.length]);
		this.drawObject(gl, this.buildings[i], this.textureShader, [0.2, 0.2, 0.2, 1.0], [0, 0, 0, 1.0]);
	}

	gl.bindTexture(gl.TEXTURE_2D, this.texture_roof);
	for (var i in this.buildings) {
		this.drawObject(gl, this.buildings[i].roof, this.textureShader, [0.2, 0.2, 0.2, 1.0], [0, 0, 0, 1.0]);
	}
	//gl.useProgram(this.textureShadowShader);
	//gl.activeTexture(gl.TEXTURE0);
	//gl.uniformMatrix4fv(this.textureShadowShader.uModelViewMatrixLocation, false, this.stack.matrix);
	for (var i in this.crystals) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture_crystal);
		this.drawObject(gl, this.crystals[i], this.textureShader);
	}

	if (!excludeCar && this.currentCamera != 3) {
		stack.push();
		var M_9 = SglMat4.translation(pos);
		if (this.playerJump && this.playerJumpCount > 0) {
			var M_JMP = SglMat4.translation([0, 0.8 * Math.sin((20.0 - this.playerJumpCount) * Math.PI/20.0), 0]);
			this.playerJumpCount -= 1;
			if (this.playerJumpCount == 0) {
				this.playerJump = false;
			}
			stack.multiply(M_JMP);
		}
		stack.multiply(M_9);

		var M_9bis = SglMat4.rotationAngleAxis(this.game.state.players.me.dynamicState.orientation, [0, 1, 0]);
		stack.multiply(M_9bis);

		this.drawCar(gl, framebuffer);
		stack.pop();
	}
	this.drawTrees(gl, framebuffer);
}

NVMCClient.drawScene = function (gl) {
    if(NVMCClient.n_resources_to_wait_for>0)return;
    var width = this.ui.width;
	var height = this.ui.height
	var ratio = width / height;

	this.drawOnReflectionMap(gl, SglVec3.add(this.game.state.players.me.dynamicState.position, [0.0, 1.5, 0.0]));
	gl.viewport(0, 0, width, height);

	// Clear the framebuffer
	var stack = this.stack;
	gl.clearColor(0.4, 0.6, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var near = 0.1;
	var far = 1000.0;
	this.projectionMatrix = SglMat4.perspective(3.14 / 4, ratio, near, far);
	this.cameras[2].projectionMatrix = this.projectionMatrix;

	stack.loadIdentity();
	var pos = this.game.state.players.me.dynamicState.position;
	var orientation = this.game.state.players.me.dynamicState.orientation;
	this.cameras[this.currentCamera].setView(this.stack, this.myFrame());
	this.viewFrame = SglMat4.inverse(this.stack.matrix);
	this.drawSkyBox(gl);

	gl.enable(gl.DEPTH_TEST);

	if (this.currentCamera == 3) {
		gl.useProgram(this.perVertexColorShader);
		gl.enable(gl.STENCIL_TEST);
		gl.clearStencil(0);
		gl.stencilMask(~0);
		gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
		gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

		gl.uniformMatrix4fv(this.perVertexColorShader.uModelViewMatrixLocation, false, SglMat4.identity());
		gl.uniformMatrix4fv(this.perVertexColorShader.uProjectionMatrixLocation, false, SglMat4.identity());
		this.drawObject(gl, this.cabin, this.perVertexColorShader, [0.4, 0.8, 0.9, 1.0]);

		gl.stencilFunc(gl.GREATER, 1, 0xFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
		gl.stencilMask(0);
	} else
		gl.disable(gl.STENCIL_TEST);

	if (this.depth_of_field_enabled) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowMapTextureTarget.framebuffer);
	
		this.shadowMatrix = SglMat4.mul(this.projectionMatrix, this.stack.matrix);
		this.stack.push();
		this.stack.load(this.shadowMatrix);

		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.shadowMapTextureTarget.framebuffer.width, this.shadowMapTextureTarget.framebuffer.height);
		gl.useProgram(this.shadowMapCreateShader);
		gl.uniformMatrix4fv(this.shadowMapCreateShader.uShadowMatrixLocation, false, this.stack.matrix);
		this.drawDepthOnly(gl); 
		this.stack.pop();

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.firstPassTextureTarget.framebuffer);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.firstPassTextureTarget.framebuffer.width, this.firstPassTextureTarget.framebuffer.height);
		this.drawSkyBox(gl);
		this.drawEverything(gl, false, this.firstPassTextureTarget.framebuffer);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.viewport(0, 0, width, height);
		gl.disable(gl.DEPTH_TEST);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.firstPassTextureTarget.texture);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.shadowMapTextureTarget.texture);

		gl.useProgram(this.depthOfFieldShader);
		gl.uniform1i(this.depthOfFieldShader.uTextureLocation, 0);
		gl.uniform1i(this.depthOfFieldShader.uDepthTextureLocation, 1);
		var dof = [1.0, 16.0];
		var A = (far + near) / (far - near);
		var B = 2 * far * near / (far - near);
		gl.uniform2fv(this.depthOfFieldShader.uDofLocation, dof);
		gl.uniform1f(this.depthOfFieldShader.uALocation, A);
		gl.uniform1f(this.depthOfFieldShader.uBLocation, B);

		var pxs = [1.0 / this.firstPassTextureTarget.framebuffer.width, 1.0 / 		this.firstPassTextureTarget.framebuffer.width];
		gl.uniform2fv(this.depthOfFieldShader.uPxsLocation, pxs);

		this.drawObject(gl, this.quad, this.depthOfFieldShader);
		gl.enable(gl.DEPTH_TEST);
	}
		else
	this.drawEverything(gl, false);

	if (this.currentCamera == 3) {

		// draw the scene for the back mirror
		this.stack.loadIdentity();
		gl.useProgram(this.lambertianSingleColorShader);
		var invPositionMatrix = SglMat4.translation(SglVec3.neg(SglVec3.add(this.game.state.players.me.dynamicState.position, [0, 1.8, 0])));
		var xMatrix = SglMat4.rotationAngleAxis(-0.2, [1, 0, 0]);
		var invOrientationMatrix = SglMat4.rotationAngleAxis(-this.game.state.players.me.dynamicState.orientation, [0, 1, 0]);
		var invV = SglMat4.mul(SglMat4.mul(xMatrix, invOrientationMatrix), invPositionMatrix);
		this.stack.multiply(invV);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.rearMirrorTextureTarget.framebuffer);
		gl.disable(gl.STENCIL_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.drawEverything(gl);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.useProgram(this.textureShader);
		gl.bindTexture(gl.TEXTURE_2D, this.rearMirrorTextureTarget.texture);
		gl.uniformMatrix4fv(this.textureShader.uModelViewMatrixLocation, false, SglMat4.identity());
		gl.uniformMatrix4fv(this.textureShader.uProjectionMatrixLocation, false, SglMat4.identity());
		this.drawObject(gl, this.rearMirror, this.textureShader, [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0]);

		gl.useProgram(this.perVertexColorShader);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.useProgram(this.perVertexColorShader);
		gl.uniformMatrix4fv(this.perVertexColorShader.uModelViewMatrixLocation, false, SglMat4.identity());
		gl.uniformMatrix4fv(this.perVertexColorShader.uProjectionLocation, false, SglMat4.identity());
		this.drawObject(gl, this.windshield, this.perVertexColorShader);
		gl.disable(gl.BLEND);
	}

};
NVMCClient.initMotionKeyHandlers = function () {
	var game = this.game;

	var carMotionKey = {};
	carMotionKey["W"] = function (on) {
		game.playerAccelerate = on;
	};
	carMotionKey["S"] = function (on) {
		game.playerBrake = on;
	};
	carMotionKey["A"] = function (on) {
		game.playerSteerLeft = on;
	};
	carMotionKey["D"] = function (on) {
		game.playerSteerRight = on;
	};
	carMotionKey["J"] = function(on) {
		//jump
		//alert("jump" + NVMCClient.myPos()[1]);
		NVMCClient.playerJump = true;
		NVMCClient.playerJumpCount = 20;
	};
	this.carMotionKey = carMotionKey;
};

/***********************************************************************/

// NVMC Client Events
/***********************************************************************/

