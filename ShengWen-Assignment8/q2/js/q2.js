/**
 * Created by shengwen on 11/23/15.
 */
function calVelocity(x, y) {
    var vxy = [];
    vxy.push((y - 5.0) + (5.0 - x) / 2.0);
    vxy.push((5.0 - y) / 2.0 + (5.0 - x));
    return vxy;
}
function eulerMethod(curX, curY, timeUnit) {
    var velocity = calVelocity(curX, curY);
    var nextPos = [];
    nextPos.push(curX + timeUnit * velocity[0]);
    nextPos.push(curY + timeUnit * velocity[1]);
    return nextPos;
}

function midpointMethod(curX, curY, timeUnit) {
    var velocity = calVelocity(curX, curY);
    var deltaX = velocity[0] * timeUnit;
    var deltaY = velocity[1] * timeUnit;
    var midVelocity = calVelocity(curX + deltaX / 2.0, curY + deltaY / 2.0);
    var nextPos = [];
    nextPos.push(curX + midVelocity[0] * timeUnit);
    nextPos.push(curY + midVelocity[1] * timeUnit);
    return nextPos;
}

function draw() {
    var isEuler = document.getElementById("method").value == "Euler(red)";
    var timeUnit = document.getElementById("speed").value == "1.0s" ? 1.0 : 0.1;
    //alert("Euler:" + isEuler + ", Speed 1.0:" + isPerSecond);
    var curX = 4.0;
    var curY = 6.0;
    var unitSpan = 80;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var height = canvas.height;

    //ctx.clearRect(0, 0, height, height);
    // start to draw
    for (var t = 0; t < 5.0; t += timeUnit) {
        ctx.beginPath();
        ctx.moveTo(Math.floor(curX * unitSpan), Math.floor(height - curY * unitSpan));
        var nextPos;
        if (isEuler) {
            nextPos = eulerMethod(curX, curY, timeUnit);
        } else {
            nextPos = midpointMethod(curX, curY, timeUnit);
        }
        curX = nextPos[0];
        curY = nextPos[1];
        ctx.lineTo(Math.floor(curX * unitSpan), Math.floor(height - curY * unitSpan));
        ctx.strokeStyle = isEuler ? '#ff0000' : "#0000ff";
        ctx.stroke();
    }

}
function clearDraw(){
    //alert("clear!");
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var height = canvas.height;
    ctx.clearRect(0, 0, height, height);
}
