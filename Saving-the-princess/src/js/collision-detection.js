/**
 * Created by shengwen on 12/15/15.
 */
function isInsideRectHelper(x, z, recX, recZ){
    var ax = recX[0];
    var bx = recX[1];
    var dx = recX[3];

    var az = recZ[0];
    var bz = recZ[1];
    var dz = recZ[3];
    var bax = (bx - ax);
    var baz = (bz - az);
    var dax = (dx - ax);
    var daz = (dz - az);

    if ((x - ax) * bax + (z - az) * baz < 0.0) return false
    if ((x - bx) * bax + (z - bz) * baz > 0.0) return false
    if ((x - ax) * dax + (z - az) * daz < 0.0) return false
    if ((x - dx) * dax + (z - dz) * daz > 0.0) return false

    return true
}
function princeDetection(pos, princess_pos) {
    if (Math.abs(pos[0] - princess_pos[0]) < 3.0) {
        if (Math.abs(pos[2] - princess_pos[2]) < 3.0) {
            return true;
        }
    }
    return false;
}
function coinDetection(pos, allCoins, crystals) {
    var x = pos[0];
    var z= pos[2];
    var y = pos[1];
    var delta = 0.8;
    for (var i = 0; i < allCoins.length; i++) {
        var coin = allCoins[i];
        if (y + 6.5 >= coin[1] && (coin[0] + delta >= x && coin[0] - delta <= x) && (coin[2] + delta >= z && coin[2] - delta <= z)) {
            // touch coin
            allCoins.splice(i, 1);
            crystals.splice(i, 1);
            return true;
        }
    }
    return false;
}
function planeCollisionDetection(pos) {
    var x = pos[0];
    var z = pos[2];
    if (x >= 96 || x <= -96 || z >= 96 || z <= -96) {
        return true;
    }
    return false;
}
function buildingCollisionDetection(pos, buildings) {
    var isCollide = false;
    var x = pos[0];
    var z = pos[2];
    for (var j = 0; j < buildings.length; j++) {
        var buildingX = [];
        var buildingZ = [];
        // get 4 point of building rectangle
        for (var i = 0; i < 4; i++) {
            buildingX.push(buildings[j]._outline[i * 4 + 0]);
            buildingZ.push(buildings[j]._outline[i * 4 + 2]);
        }
        if (isInsideRectHelper(x,z, buildingX, buildingZ)){
            return true;
        }
    }
    return isCollide;
}