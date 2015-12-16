/**
 * Created by shengwen on 12/15/15.
 */
/**
 * Created by shengwen on 12/15/15.
 */
function TexturedCrystal(center, scale){
    var nv = 6;
    this.name = "TexturedCrystal";
    var c_x = center[0];
    var c_y = center[1];
    var c_z = center[2];
    this.vertices = new Float32Array(6 * 3);

    var radius = 0.5;
    //v1
    this.vertices[0] = c_x;
    this.vertices[1] = c_y + radius;
    this.vertices[2] = c_z;
    //v2
    this.vertices[3] = c_x + radius;
    this.vertices[4] = c_y;
    this.vertices[5] = c_z - radius ;
    //v3
    this.vertices[6] = c_x - radius;
    this.vertices[7] = c_y;
    this.vertices[8] = c_z - radius;
    //v4
    this.vertices[9] = c_x + radius;
    this.vertices[10] = c_y;
    this.vertices[11] = c_z + radius;
    //v5
    this.vertices[12] = c_x - radius;
    this.vertices[13] = c_y;
    this.vertices[14] = c_z + radius;
    //v6
    this.vertices[15] = c_x;
    this.vertices[16] = c_y - radius;
    this.vertices[17] = c_z;

    this.triangleIndices = new Uint16Array(3 * 2 * 4);

    //t1
    this.triangleIndices[0] = 0;
    this.triangleIndices[1] = 3;
    this.triangleIndices[2] = 1;

    //t2
    this.triangleIndices[3] = 0;
    this.triangleIndices[4] = 3;
    this.triangleIndices[5] = 4;

    //t3
    this.triangleIndices[6] = 0;
    this.triangleIndices[7] = 1;
    this.triangleIndices[8] = 2;

    //t4
    this.triangleIndices[9] = 0;
    this.triangleIndices[10] = 4;
    this.triangleIndices[11] = 2;

    //t5
    this.triangleIndices[12] = 5;
    this.triangleIndices[13] = 3;
    this.triangleIndices[14] = 1;

    //t6
    this.triangleIndices[15] = 5;
    this.triangleIndices[16] = 3;
    this.triangleIndices[17] = 4;

    //t7
    this.triangleIndices[18] = 5;
    this.triangleIndices[19] = 1;
    this.triangleIndices[20] = 2;

    //t8
    this.triangleIndices[21] = 5;
    this.triangleIndices[22] = 4;
    this.triangleIndices[23] = 2;

    this.numVertices = 6;
    this.numTriangles = 8;

    this.textureCoord = new Float32Array(nv  * 2);
    for(var i = 0; i < nv;++i) {
        this.textureCoord[i * 2] = 0;
        this.textureCoord[i * 2 + 1] = i * 5;
    }
    for(var i = 0; i < nv;++i) {
        this.textureCoord[i * 2] = 1;
        this.textureCoord[i * 2 + 1] = i * 5;
    }

}