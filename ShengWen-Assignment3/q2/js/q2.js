/**
 * Created by shengwen on 10/5/15.
 */

function checkRGB(e) {
    if (e.value == "") {
        e.value = 102;
    }
    var val = parseInt(e.value);
    if (val < 0) {
        val = 0;
        document.getElementById('info').innerHTML = "RGB value should be in 0 - 255!";
    } else if (val > 255) {
        val = 255;
        document.getElementById('info').innerHTML = "RGB value should be in 0 - 255!";
    } else {
        document.getElementById('info').innerHTML = "";
    }
    e.value = val;
}

function checkDir(e) {
    if (e.value == "") {
        e.value = 1;
    }
}
