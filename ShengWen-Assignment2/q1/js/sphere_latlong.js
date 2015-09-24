/**
 * Created by shengwen on 9/22/15.
 */
function Sphere_Latlong(resolution) {
    this.name = "sphere_latlong";

    var radius = 2.0;

    //x = r sinθ cosφ
    //y = r cosθ
    //z = r sinθ sinφ
    this.vertices = new Float32Array(3 * resolution );

}

function checkNumber(e) {
    if (e.value == "") {
        document.getElementById("info").innerHTML = "You must enter a valid integer for resolution!";
        e.value = 20;
        return;
    }
    var n = parseInt(e.value);
    if (n <= 1) {
        document.getElementById("info").innerHTML = "You must enter a positive integer( > 1) for resolution!";
        e.value = 20;
        return;
    }
    e.value = n;
    document.getElementById("info").innerHTML = "";
}
