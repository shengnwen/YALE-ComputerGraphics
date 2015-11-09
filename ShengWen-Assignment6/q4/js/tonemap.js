// scaling for display

function tone_map(img) {
    var maxI = 0;
    var L = [];
    var val;
    var intensities = [];
//for (var x=0; x< width;x++){
//	for (var y = 0; y< height; y++){
//                index = (x * 3) + (y * width * 3);
//		 L[index] = .3*img[index]+.5*img[index+1]+.2*img[index+2];
//		if (L[index] > maxI) {maxI= L[index]};
//	}}
// find median
    var obj = {}
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = (x * 3) + (y * width * 3);
            val = .3 * img[index] + .5 * img[index + 1] + .2 * img[index + 2];
            if (! (val in obj)) {
                intensities.push(val);
                obj[val] = true;
            }
        }
    }
    intensities = intensities.sort();
    var median = intensities[Number(intensities.length / 2)];
//for ( var x=0;x< width;x++){
//	for (var y = 0; y< height; y++){
//                index = (x  * 3) + (y * width * 3);
//		for (k=0;k<3;k++){
//			 img[index+k] *= (255./maxI);
//                        if (img[index+k] > 255){ img[index+k] = 255;};
//		}
//	}}
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            index = (x * 3) + (y * width * 3);
            for (k = 0; k < 3; k++) {
                img[index + k] *= (128.0 / median);
                if (img[index + k] > 255) {
                    img[index + k] = 255;
                }
                ;
            }
        }
    }

    return (img);
}


