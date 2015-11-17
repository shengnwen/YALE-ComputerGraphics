/**
 * Created by shengwen on 11/16/15.
 */
function loadBumpImage() {
    var imgFile = document.getElementById("bumpMapImg").files[0];
    var previewImg = document.getElementById("previewImg");
    var reader = new FileReader();
    reader.onloadend = function() {
        previewImg.src = reader.result;
        //alert("" + reader.result);
        var canvas = document.getElementById('shadedImgCanvas');
        var imgObj = new Image();
        imgObj.src = reader.result;
        canvas.getContext('2d').drawImage(imgObj,0, 0, 300, 300);

    }
    if(imgFile) {
        reader.readAsDataURL(imgFile);

    }

}

function copyImg() {
    var previewImg = document.getElementById("previewImg");
    var canvas = document.getElementById('shadedImgCanvas');
    //canvas.getContext('2d').drawImage(previewImg,10, 10);
    //document.getElementById("shadedImg").src = document.getElementById("previewImg").src
}
