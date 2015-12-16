// Global NVMC Client
// ID 4.0
/***********************************************************************/
var NVMCClient = NVMCClient || {};
/***********************************************************************/

NVMCClient.myPos = function () {
	return this.game.state.players.me.dynamicState.position;
};
NVMCClient.setPos = function (xyz) {
	for (var i = 0; i < 3; i++) {
		this.game.state.players.me.dynamicState.position[i] = xyz[i];
	}
};
NVMCClient.myOri = function () {
	return this.game.state.players.me.dynamicState.orientation;
};

NVMCClient.myFrame = function () {
	return this.game.state.players.me.dynamicState.frame;
};

// NVMC Client Internals
/***********************************************************************/






NVMCClient.onTerminate = function () {};

NVMCClient.onConnectionOpen = function () {
	NVMC.log("[Connection Open]");
};

NVMCClient.onConnectionClosed = function () {
	NVMC.log("[Connection Closed]");
};

NVMCClient.onConnectionError = function (errData) {
	NVMC.log("[Connection Error] : " + errData);
};

NVMCClient.onLogIn = function () {
	NVMC.log("[Logged In]");
};

NVMCClient.onLogOut = function () {
	NVMC.log("[Logged Out]");
};

NVMCClient.onNewRace = function (race) {
	NVMC.log("[New Race]");
};

NVMCClient.onPlayerJoin = function (playerID) {
	NVMC.log("[Player Join] : " + playerID);
	this.game.opponents[playerID].color = [0.0, 1.0, 0.0, 1.0];
};

NVMCClient.onPlayerLeave = function (playerID) {
	NVMC.log("[Player Leave] : " + playerID);
};



NVMCClient.onKeyUp = function (keyCode, event) {
	if( keyCode == "2"){ this.nextCamera(); return;}
	if( keyCode == "1"){ this.prevCamera(); return;}
	if( keyCode == "3"){ this.motionblur_enabled = !this.motionblur_enabled;return;}
	if (keyCode == "J") {
		return;
	}
	if(this.carMotionKey[keyCode])
		this.carMotionKey[keyCode](false);

	this.cameras[this.currentCamera].keyUp(keyCode) ;

};
NVMCClient.onKeyDown = function (keyCode, event) {

	if (this.currentCamera != 2)
		(this.carMotionKey[keyCode]) && (this.carMotionKey[keyCode])(true);

	this.cameras[this.currentCamera].keyDown(keyCode);

	if (keyCode == "X")
	{
		if (!this.flagTrackWithNormalMap)
			this.flagTrackWithNormalMap = true;
		else
			this.flagTrackWithNormalMap = false;
	}
}

NVMCClient.onMouseButtonDown = function (button, x, y, event) {
	this.cameras[this.currentCamera].mouseButtonDown(x,y);
};

NVMCClient.onMouseButtonUp = function (button, x, y, event) {
	this.cameras[this.currentCamera].mouseButtonUp();
};

NVMCClient.onMouseMove = function (x, y, event) {
	this.cameras[this.currentCamera].mouseMove(x,y);
};


NVMCClient.onKeyPress = function (keyCode, event) {};

NVMCClient.onMouseWheel = function (delta, x, y, event) {};

NVMCClient.onClick = function (button, x, y, event) {};

NVMCClient.onDoubleClick = function (button, x, y, event) {};

NVMCClient.onDragStart = function (button, x, y) {};

NVMCClient.onDragEnd = function (button, x, y) {};

NVMCClient.onDrag = function (button, x, y) {};

NVMCClient.onResize = function (width, height, event) {};

NVMCClient.onAnimate = function (dt) {
	this.ui.postDrawEvent();
};

NVMCClient.onDraw = function () {
	var gl = this.ui.gl;
	this.drawScene(gl);
};
/***********************************************************************/
