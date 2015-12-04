// Basic canvas stuff.

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");
var W = 600, H = W*0.3;
canvas.height = H; canvas.width = W;
var rad1, rad2, v1, v2;
var isElastic;
var energyLost;
var bigest_k = 0;
var together = false;
var ball1, ball2;

// Defining the balls that will collide. This will be one dimensional, so the ball only has an x position and x velocity. Each ball has a radius and color, and a method to draw it on the canvas

function Ball(locx, radius, color, velx) {
	
		this.x = locx;
		this.vx = velx;
		this.rad = radius;
		this.c = color;
		this.draw = function() {
		// Here, we'll first begin drawing the path and then use the arc() function to draw a circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
		ctx.beginPath();
		ctx.arc(this.x, 100, this.rad, 0, Math.PI*2, false);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.closePath();
		} // draw function end
	} // Ball function end




// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
// So, lets create a function that will do it for us.

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}


// We want balls to change direction when they hit the edge of the canvas

function checkbounce(ball,end) {
	if (ball.x + ball.rad > end - ball.vx || ball.x - ball.rad < 0 - ball.vx) {

        ball.vx *= -1.0;
        if (!isElastic) {
            ball.vx *= Math.sqrt(1 - energyLost);
        }
        //ball.vx *= Math.sqrt(1 - energyLost);
    }
    //if (ball.x - ball.rad < 0) {
    //    ball.vx *= -1.0;
    //}
}

function checkCollision(ball1, ball2) {
	//if (Math.abs(ball1.x - ball2.x) < ball1.rad + ball2.rad + Math.abs(ball1.vx) + Math.abs(ball2.vx)) {
    if (Math.abs(ball1.x - ball2.x) <= ball1.rad + ball2.rad) {
        //alert("ball1x:" + ball1.x + ", ball2x:" + ball2.x + ",rad1:" + ball1.rad + ", rad2:" + ball2.rad);
        //alert("pre:" + ball1.vx + "," + ball2.vx);
        var v1 = ball1.vx;
        var v2 = ball2.vx;
        var m1 = Math.pow(ball1.rad, 2);
        var m2 = Math.pow(ball2.rad, 2);
        if (isElastic) {
            ball1.vx = (v1 * (m1 - m2) + 2 * m2 * v2)/(m1 + m2);
            ball2.vx = (v2 * (m2 - m1) + 2 * m1 * v1)/(m1 + m2);
        } else {
            ball1.vx = (v1 * (m1 - m2) + 2 * m2 * v2)/(m1 + m2) * Math.sqrt(1 - energyLost);
            ball2.vx = (v2 * (m2 - m1) + 2 * m1 * v1)/(m1 + m2)* Math.sqrt(1 - energyLost);
            //if (together) {
            //    return;
            //}
            //var old_2E = m1 * Math.pow(v1, 2) + m2 * Math.pow(v2, 2);
            //var to_v = (m1 * v1 + m2 * v2) / (m1 + m2);
            //var to_2E = (m1 + m2) * Math.pow(to_v, 2);
            //var bigest_k = 1.0 - to_2E / old_2E;
            //if (energyLost >= bigest_k) {
            //    alert("bigest enery lost:(2_ball_together)" + bigest_k);
            //    ball1.vx = to_v;
            //    ball2.vx = to_v;
            //    together = true;
            //}
            //var to_2E = (1.0 - energyLost) * (m1 * Math.pow(v1, 2) + m2 * Math.pow(v2, 2));
            //var Q = m1 * v1 + m2 * v2;
            //// x = m1 * v1
            //var a = m1 + m2;
            //var b = - 2*m1 * Q;
            //var c = m1 * Math.pow(Q, 2) - m1 * m2 * to_2E;
            //var m1_v1 = (-b + Math.sqrt(b * b - 4 * a * c))/(2 * a);
            //var v1_new = m1_v1 / m1;
            //var v2_new = (Q - v1_new) / m2;
            //ball1.vx = v1_new;
            //ball2.vx = v2_new;
            //var a = ball1.vx + ball2.vx;
            //var b = ball1.vx * ball2.vx;
            //var Q = a * a - (a * a - 2 * b)*(1 - energyLost);
            ////if(a*a - 2*Q)
            //var x1 = (a + Math.sqrt(a * a + 2 * Q))/2;
            //var x2 = (a - Math.sqrt(a * a + 2 * Q))/2;
            //if (x1 * ball1.vx > 0) {
            //    ball1.vx = x2;
            //    ball2.vx = x1;
            //} else {
            //    ball1.vx = x1;
            //    ball2.vx = x2;
            //}
        }
        //alert("after:" + ball1.vx + "," + ball2.vx);
	}
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
	checkCollision(ball1, ball2);
    //if (Math.abs(ball1.vx) <= 0.001) {
    //    ball1.vx = 0;
    //}
    //if (Math.abs(ball2.vx) <= 0.001) {
    //    ball2.vx = 0;
    //}
}

// Now, the animation time!
// In setInterval, 1000/x depicts x fps! So, in this case, we are aiming for 60fps for smoother animations.
var intervalID = null;
function startAnimation() {
	if (intervalID != null) {
		clearInterval(intervalID);
        //alert("close intervel");
	}
    together = false;
    rad1 = parseFloat(document.getElementById("ball1radius").value);
    rad2 = parseFloat(document.getElementById("ball2radius").value);
    v1 = parseFloat(document.getElementById("ball1v").value);
    v2 = parseFloat(document.getElementById("ball2v").value);
    energyLost = parseFloat(document.getElementById("energyLost").value);
    isElastic = document.getElementById("isElastic").value == "Elastic";
    ball1 = new Ball(rad1*0.1*W,rad1*0.1*W, "red", 1.*v1);
    ball2 = new Ball (W-rad2*0.1*W, rad2*0.1*W, "blue", -v2);
	intervalID = setInterval(update, 1000/60);
}

