// Basic canvas stuff.

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");
var W = 500, H = 100;
canvas.height = H; canvas.width = W;

var rad1 = document.getElementById("ball1radius").value;
var rad2 = document.getElementById("ball2radius").value;
var v1 = document.getElementById("ball1v").value;
var v2 = document.getElementById("ball2v").value;

// Defining the balls that will collide. This will be one dimensional, so the ball only has an x position and x velocity. Each ball has a radius and color, and a method to draw it on the canvas

function Ball(locx, radius, color, velx) {
	
		this.x = locx;
		this.vx = velx;
		this.rad = radius;
		this.c = color;
		this.draw = function() {
		// Here, we'll first begin drawing the path and then use the arc() function to draw a circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
		ctx.beginPath();
		ctx.arc(this.x, 50, this.rad, 0, Math.PI*2, false);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.closePath();
		} // draw function end
	} // Ball function end


ball1 = new Ball(rad1*50,rad1*50, "red", 1.*v1);
ball2 = new Ball (W-rad2*50, rad2*50, "blue", -v2);

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
// So, lets create a function that will do it for us.

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}


// We want balls to change direction when they hit the edge of the canvas

function checkbounce(ball,end) {
	if (ball.x + ball.rad > end) ball.vx *= -1;
	if (ball.x - ball.rad < 0) ball.vx *= -1;
}

// A function that will update the positions of the balls is needed
function update() {
	clearCanvas();
	ball1.draw();
        ball2.draw();
	
	// Now, lets make the ball move by adding the velocity vectors to its position
	ball1.x += ball1.vx;
        ball2.x += ball2.vx;	
	// We will bounce the balls against the edges of the canvas
	checkbounce(ball1,W);
	checkbounce(ball2,W);
}

// Now, the animation time!
// In setInterval, 1000/x depicts x fps! So, in this case, we are aiming for 60fps for smoother animations.
setInterval(update, 1000/60);
