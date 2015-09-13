/**
 * Created by shengwen on 9/13/15.
 */
function check(e) {
    if (e.value > 1) {
        e.value = 1.00;
    } else if (e.value < 0) {
        e.value = 0.00;
    }
    e.value = parseFloat(e.value).toFixed(2);
};
// make sure image has a default value 50 * 50
function changeImgSize(e) {
    if (!e.value) {
        e.value = 50;
    }
}

function drawTriangle() {
    alert("draw triangle!");
}