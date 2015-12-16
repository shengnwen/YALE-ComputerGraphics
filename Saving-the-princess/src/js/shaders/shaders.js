uniformShader = function (gl) {//line 1, Listing 4.3{
	var vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;	\n\
		uniform   mat4 uProjectionMatrix;	\n\
		attribute vec3 aPosition;					\n\
		void main(void)										\n\
		{																	\n\
		gl_Position = uProjectionMatrix * uModelViewMatrix	\n\
			* vec4(aPosition, 1.0);  				\n\
		}";

	var fragmentShaderSource = "\
		precision highp float;					\n\
		uniform vec4 uColor;						\n\
		void main(void)									\n\
		{																\n\
			gl_FragColor = vec4(uColor);	\n\
		}	";//line}

	// create the vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	// create the fragment shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);

	// Create the shader program
	var aPositionIndex = 0;
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.bindAttribLocation(shaderProgram, aPositionIndex, "aPosition");
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var str = "Unable to initialize the shader program.\n\n";
		str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
		str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
		str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
		alert(str);
	}

	shaderProgram.aPositionIndex = aPositionIndex;
	shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	shaderProgram.uColorLocation               = gl.getUniformLocation(shaderProgram, "uColor");

	shaderProgram.vertex_shader = vertexShaderSource;
	shaderProgram.fragment_shader = fragmentShaderSource;

	return shaderProgram;
};
perVertexColorShader = function (gl) {
	var vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		attribute vec3 aPosition;                                       \n\
		attribute vec4 aColor;                                       \n\
		varying vec4 a_color;					 \n\
		void main(void)                                                 \n\
		{                                                               \n\
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);  \n\
			a_color=aColor; \n\
		}                                                               \n\
	";

	var fragmentShaderSource = "\
		precision highp float;                                          \n\
		varying vec4 a_color;			 \n\
		void main(void)                                                 \n\
		{                                                               \n\
 			gl_FragColor = a_color;                           \n\
		}                                                               \n\
	";

	// create the vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	// create the fragment shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);

	// Create the shader program
	var aPositionIndex = 0;
	var aColorIndex = 1;
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.bindAttribLocation(shaderProgram, aPositionIndex, "aPosition");
	gl.bindAttribLocation(shaderProgram, aColorIndex, "aColor");
	gl.linkProgram(shaderProgram);

	shaderProgram.vertex_shader = vertexShaderSource;
	shaderProgram.fragment_shader = fragmentShaderSource;

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var str = "Unable to initialize the shader program.\n\n";
		str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
		str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
		str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
		alert(str);
	}

	shaderProgram.aPositionIndex = aPositionIndex;
	shaderProgram.aColorIndex = aColorIndex;

	shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.aPositionIndex = 0;
	shaderProgram.aColorIndex = 1;

	return shaderProgram;
};
lambertianShader = function (gl) {

    var shaderProgram = gl.createProgram();
//line 4, Listing 6.3{
    shaderProgram.vertex_shader = "\
precision highp float;                                     \n\
                                                           \n\
uniform mat4 uProjectionMatrix;                            \n\
uniform mat4 uModelViewMatrix;                             \n\
uniform mat3 uViewSpaceNormalMatrix;                       \n\
attribute vec3 aPosition;                                  \n\
attribute vec3 aNormal;                                    \n\
attribute vec4 aDiffuse;                                   \n\
varying vec3 vpos;                                         \n\
varying vec3 vnormal;                                      \n\
varying vec4 vdiffuse;                                       \n\
                                                           \n\
void main()                                                \n\
{                                                          \n\
  // vertex normal (in view space)                         \n\
 vnormal = normalize(uViewSpaceNormalMatrix * aNormal);    \n\
                                                           \n\
  // color (in view space)                                 \n\
  vdiffuse = aDiffuse;                                     \n\
                                                           \n\
// vertex position (in view space)                         \n\
  vec4 position = vec4(aPosition, 1.0);                    \n\
  vpos = vec3(uModelViewMatrix * position);                \n\
                                                           \n\
  // output                                                \n\
  gl_Position = uProjectionMatrix *uModelViewMatrix *      \n\
    position;                                              \n\
}                                                          \n\
";
//line 35} line 35, listing 6.4{
    shaderProgram.fragment_shader = "\
precision highp float;                                     \n\
                                                           \n\
varying vec3 vnormal;                                      \n\
varying vec3 vpos;                                         \n\
varying vec4 vdiffuse;                                     \n\
uniform vec4 uLightDirection;                              \n\
                                                           \n\
// positional light: position and color                    \n\
uniform vec3 uLightColor;                                  \n\
                                                           \n\
void main()                                                \n\
{                                                          \n\
  // normalize interpolated normal                         \n\
  vec3 N = normalize(vnormal);                             \n\
                                                           \n\
  // light vector (positional light)                       \n\
  vec3 L = normalize(-uLightDirection.xyz);                \n\
                                                           \n\
  // diffuse component                                     \n\
  float NdotL = max(0.0, dot(N, L));                       \n\
  vec3 lambert = (vdiffuse.xyz * uLightColor) * NdotL;     \n\
                                                           \n\
  gl_FragColor  = vec4(lambert, 1.0);                      \n\
} ";



    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragment_shader);
    gl.compileShader(fragmentShader);


    // Create the shader program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    shaderProgram.aPositionIndex = 0;
    shaderProgram.aColorIndex = 1;
    shaderProgram.aNormalIndex = 2;
    gl.bindAttribLocation(shaderProgram, shaderProgram.aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aColorIndex, "aColor");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aNormalIndex, "aNormal");
    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
        var str = "";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }


    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uViewSpaceNormalMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewSpaceNormalMatrix");
    shaderProgram.uLightPositionLocation = gl.getUniformLocation(shaderProgram,"uLightDirection");
    shaderProgram.uLightColorLocation = gl.getUniformLocation(shaderProgram,"uLightColor");

    return shaderProgram;
};
textureShader = function (gl) {
    var vertex_shader = "\
		uniform   mat4 uModelViewMatrix;	\n\
		uniform   mat4 uProjectionMatrix;	\n\
		attribute vec3 aPosition;					\n\
		attribute vec2 aTextureCoords;		\n\
		varying vec2 vTextureCoords;			\n\
		void main(void)										\n\
		{																	\n\
			vTextureCoords = aTextureCoords;				\n\
			gl_Position = uProjectionMatrix *				\n\
 			uModelViewMatrix * vec4(aPosition, 1.0);\n\
		}";
    var fragment_shader = "\
		precision highp float;					\n\
		uniform sampler2D uTexture;			\n\
		uniform vec4 uColor;						\n\
		varying vec2 vTextureCoords;		\n\
		void main(void)									\n\
		{																\n\
			gl_FragColor = texture2D(uTexture, vTextureCoords);	\n\
		} ";


    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    gl.bindAttribLocation(shaderProgram, shaderProgram.aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
    shaderProgram.uTextureLocation = gl.getUniformLocation(shaderProgram, "uTexture");

    return shaderProgram;
};
textureNormalMapShader = function (gl) {
    var vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		attribute vec3 aPosition;                                       \n\
		attribute vec2 aTextureCoords;				\n\
		varying vec2 vTextureCoords;			\n\
		void main(void)                                                 \n\
		{                                                               \n\
			vTextureCoords = aTextureCoords; \n\
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);  \n\
		}                                                               \n\
	";

    var fragmentShaderSource = "\
		precision highp float;						\n\
		uniform sampler2D texture;				\n\
		uniform sampler2D normalMap;			\n\
		uniform vec4	uLightDirection;		\n\
		uniform vec4 uColor;							\n\
		varying vec2 vTextureCoords;			\n\
		void main(void)										\n\
		{  																							\n\
			vec4 n=texture2D(normalMap, vTextureCoords);	\n\
			n.x =n.x*2.0 -1.0; 														\n\
			n.y =n.y*2.0 -1.0;														\n\
			n.z =n.z*2.0 -1.0;														\n\
			vec3 N=normalize(vec3(n.x,n.z,n.y));					\n\
			float shade =  dot(-uLightDirection.xyz , N);	\n\
			vec4 color=texture2D(texture, vTextureCoords);\n\
		gl_FragColor = vec4(color.xyz*shade,1.0);			\n\
		}";


    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    gl.bindAttribLocation(shaderProgram, shaderProgram.aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
    shaderProgram.uNormalMapLocation = gl.getUniformLocation(shaderProgram, "normalMap");
    shaderProgram.uLightDirectionLocation = gl.getUniformLocation(shaderProgram, "uLightDirection");

    return shaderProgram;
};
skyBoxShader = function (gl) {
    var vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;	\n\
		uniform   mat4 uProjectionMatrix;	\n\
		attribute vec3 aPosition;					\n\
		varying vec3 vpos;								\n\
		void main(void)										\n\
		{																	\n\
			vpos = normalize(aPosition);		\n\
			gl_Position = uProjectionMatrix*uModelViewMatrix * vec4(aPosition, 1.0);\n\
		}";
    var fragmentShaderSource = "\
		precision highp float;					\n\
		uniform  samplerCube  uCubeMap;	\n\
		varying vec3 vpos;							\n\
		void main(void)									\n\
		{																\n\
 			gl_FragColor = textureCube (uCubeMap,normalize(vpos));\n\
		} ";
    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uCubeMapLocation		= gl.getUniformLocation(shaderProgram, "uCubeMap");



    return shaderProgram;
};
reflectionMapShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;   			\n\
		uniform   mat4 uProjectionMatrix;				\n\
		uniform   mat3 uViewSpaceNormalMatrix; \n\
		attribute vec3 aPosition;								\n\
		attribute vec4 aDiffuse;								\n\
		attribute vec4 aSpecular;								\n\
		attribute vec3 aNormal;									\n\
		attribute vec4 aAmbient;									\n\
		varying  vec3 vPos;											\n\
		varying  vec3 vNormal;									\n\
		varying  vec4 vdiffuse;									\n\
		varying  vec4 vspecular;								\n\
		varying  vec4 vambient;								\n\
		void main(void)													\n\
		{																				\n\
			vdiffuse = aDiffuse;										\n\
			vspecular = aSpecular;								\n\
			vambient = aAmbient; \n\
			vPos = vec3(uModelViewMatrix * vec4(aPosition, 1.0));	\n\
			vNormal =normalize( uViewSpaceNormalMatrix *  aNormal);\n\
			gl_Position = uProjectionMatrix*uModelViewMatrix * vec4(aPosition, 1.0);\n\
		}";
    shaderProgram.fragmentShaderSource = "\
		precision highp float;						\n\
		uniform vec4 uLightDirection;			\n\
		uniform vec3 uLightColor;					\n\
		uniform mat4 uViewToWorldMatrix;	\n\
		uniform  samplerCube uCubeMap;		\n\
		varying  vec3 vPos;								\n\
		varying vec4 vdiffuse;						\n\
		varying vec3 vNormal;							\n\
		varying vec4 vspecular;						\n\
		varying vec4 vambient;\n\
		void main(void)										\n\
		{																	\n\
		// normalize interpolated normal                         \n\
		vec3 N = normalize(vNormal);                             \n\
				                                                   \n\
		// light vector (positional light)                       \n\
		vec3 L = normalize(-uLightDirection.xyz);                \n\
				                                                   \n\
		// diffuse component                                     \n\
		float NdotL = max(0.0, dot(N, L));                       \n\
		vec3 lambert = (vdiffuse.xyz * uLightColor) * NdotL+vambient.xyz*uLightColor;     \n\
\n\
		vec3 reflected_ray 		= vec3(uViewToWorldMatrix* vec4(reflect(vPos,vNormal),0.0));\n\
		vec4 reflected_color 	= textureCube (uCubeMap,reflected_ray);\n\
		gl_FragColor = reflected_color*vspecular + vec4(lambert,1.0);		}";

    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aColorIndex = 1;
    shaderProgram.aNormalIndex = 2;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram,shaderProgram. aColorIndex, "aColor");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aNormalIndex, "aNormal");

    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uViewSpaceNormalMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewSpaceNormalMatrix");

    return shaderProgram;
};


// shadow shaders
shadowMapShader = function (gl){
    var shaderProgram = null;

    var vertex_shader = "\
	uniform   mat4 uModelViewMatrix;\n\
	uniform   mat4 uProjectionMatrix;\n\
	uniform   mat4 uShadowMatrix;\n\
	attribute vec3 aPosition;\n\
	varying   vec4 vShadowPosition;\n\
	void main(void)\n\
	{\n\
		vec4 position   = vec4(aPosition, 1.0);\n\
		vShadowPosition = uShadowMatrix    * position;\n\
		gl_Position     = uProjectionMatrix * uModelViewMatrix * position;\n\
	}";


    var fragment_shader = "\
	precision highp float;\n\
	uniform sampler2D uShadowMap;\n\
	varying vec4      vShadowPosition;\n\
	float Unpack(vec4 v){\n\
		return v.x   + v.y / (256.0) + v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);\n\
	}\n\
	bool IsInShadow(){\n\
		vec3  normShadowPos = vShadowPosition.xyz / vShadowPosition.w;\n\
		vec3  shadowPos     = normShadowPos * 0.5 + vec3(0.5);\n\
		float Fz = shadowPos.z;\n\
		float Sz = Unpack(texture2D(uShadowMap, shadowPos.xy));\n\
		bool  inShadow = (Sz < Fz);\n\
		return inShadow;\n\
	}\n\
	void main(void)\n\
	{\n\
		if (IsInShadow())\n\
			gl_FragColor=vec4(0.3,0.3,0.3,1.0);\n\
		else\n\
			gl_FragColor=vec4(0.6,0.6,0.6,1.0);\n\
	}";


    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program
    var aPositionIndex = 0;
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.bindAttribLocation(shaderProgram, aPositionIndex, "aPosition");
    gl.linkProgram(shaderProgram);

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.aPositionIndex = aPositionIndex;
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uShadowMatrixLocation = gl.getUniformLocation(shaderProgram, "uShadowMatrix");
    shaderProgram.uShadowMapLocation = gl.getUniformLocation(shaderProgram, "uShadowMap");
    return shaderProgram;

};

shadowMapCreateShader = function (gl){
    var shaderProgram = null;
//lie 83, Listing8.1{
    var vertex_shader = "\
	uniform   mat4 uShadowMatrix;\n\
	attribute vec3 aPosition;\n\
	void main(void)\n\
	{\n\
		gl_Position = uShadowMatrix * vec4(aPosition, 1.0);\n\
	}";
// line 91}, line 92 Listing 8,2{
    var fragment_shader = "\
	precision highp float;\n\
	float Unpack(vec4 v){\n\
		return v.x  + v.y / (256.0 ) + v.z/( 256.0*256.0)+v.w/ ( 256.0*256.0*256.0);\n\
//		return v.x;	\n\
	}\n\
	vec4 pack_depth(const in float d)\n\
	{	if(d==1.0) return vec4(1.0,1.0,1.0,1.0);\n\
		float a =d*1.001;\n\
		const vec4 bit_shift = vec4( 1.0	, 256.0		,256.0*256.0	,	256.0*256.0*256.0 );\n\
		const vec4 bit_mask  = vec4( 1.0/256.0	, 1.0/256.0	, 1.0/256.0	,	0.0);\n\
		vec4 res = fract(a * bit_shift);\n\
		res -= res.yzwx  * bit_mask;\n\
		return res;\n\
	}\n\
	void main(void)\n\
	{\n\
 		gl_FragColor = vec4(pack_depth(gl_FragCoord.z));\n\
	}";

    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program
    var aPositionIndex = 0;
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.bindAttribLocation(shaderProgram, aPositionIndex, "aPosition");
    gl.linkProgram(shaderProgram);

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.aPositionIndex = aPositionIndex;
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uShadowMatrixLocation = gl.getUniformLocation(shaderProgram, "uShadowMatrix");

    return shaderProgram;

};

textureShadowShader = function (gl) {
    var vertex_shader = "\
		uniform   mat4 uModelViewMatrix;                        \n\
		uniform   mat4 uProjectionMatrix;                       \n\
		uniform   mat4 uShadowMatrix;														\n\
		attribute vec3 aPosition;                               \n\
		attribute vec2 aTextureCoords;													\n\
		varying vec2 vTextureCoords;														\n\
		varying   vec4 vShadowPosition;													\n\
		void main(void)                                         \n\
		{                                                       \n\
			vTextureCoords 	= aTextureCoords; 										\n\
			vec4 position   = vec4(aPosition, 1.0);								\n\
			vShadowPosition = uShadowMatrix    * position;				\n\
			gl_Position 		= uProjectionMatrix * uModelViewMatrix\n\
			* vec4(aPosition, 1.0);  															\n\
		}";

    var fragment_shader = "\
		precision highp float;                            	\n\
		uniform sampler2D uTexture;													\n\
		uniform sampler2D uShadowMap;												\n\
		varying vec2 vTextureCoords;												\n\
		varying vec4 vShadowPosition;												\n\
		float Unpack(vec4 v){																\n\
			return v.x   + v.y / (256.0) + 										\n\
			v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);				\n\
		}																										\n\
		bool IsInShadow(){																	\n\
			vec3  normShadowPos = vShadowPosition.xyz / vShadowPosition.w;\n\
			vec3  shadowPos     = normShadowPos * 0.5 + vec3(0.5);				\n\
			float Fz = shadowPos.z;														\n\
			float Sz = Unpack(texture2D(uShadowMap, shadowPos.xy));				\n\
			bool  inShadow = (Sz +0.007< Fz);												\n\
			return inShadow;																	\n\
			}																									\n\
		void main(void){																		\n\
				vec4 color = texture2D(uTexture,vTextureCoords);\n\
				if(IsInShadow())																\n\
						color.xyz*=0.6;															\n\
				gl_FragColor = color;														\n\
			}";

    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uShadowMatrixLocation     = gl.getUniformLocation(shaderProgram, "uShadowMatrix");
    shaderProgram.uTextureLocation          = gl.getUniformLocation(shaderProgram, "uTexture");
    shaderProgram.uShadowMapLocation        = gl.getUniformLocation(shaderProgram, "uShadowMap");


    return shaderProgram;
};

textureNormalMapShadowShader = function (gl) {
    var vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		uniform   mat4 uShadowMatrix;\n\
		attribute vec3 aPosition;                                       \n\
		attribute vec2 aTextureCoords;				\n\
		varying vec2 vTextureCoords;			\n\
		varying   vec4 vShadowPosition;\n\
		void main(void)                                                 \n\
		{                                                               \n\
			vTextureCoords = aTextureCoords; \n\
			vec4 position   = vec4(aPosition, 1.0);\n\
			vShadowPosition = uShadowMatrix    * position;\n\
			gl_Position = uProjectionMatrix * uModelViewMatrix * position;  \n\
		}                                                               \n\
	";

    var fragmentShaderSource = "\
		precision highp float;                                          \n\
		uniform sampler2D texture; 				\n\
		uniform sampler2D normalMap; 				\n\
		uniform sampler2D uShadowMap;\n\
		uniform vec4	uLightDirection; \n\
		uniform vec4 uColor;                                            \n\
		varying vec2 vTextureCoords;			\n\
		varying vec4 vShadowPosition;\n\
		float Unpack(vec4 v){\n\
			return v.x   + v.y / (256.0) + v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);\n\
		}\n\
		bool IsInShadow(){\n\
			// perspective division:\n\
			// from clip space to normalized space [-1..+1]^3\n\
			vec3  normShadowPos = vShadowPosition.xyz / vShadowPosition.w;\n\
			\n\
			// from [-1..+1] to [0..+1] (for texture coordinates and stored depth)\n\
			vec3  shadowPos     = normShadowPos * 0.5 + vec3(0.5);\n\
			float Fz = shadowPos.z;\n\
			float Sz = Unpack(texture2D(uShadowMap, shadowPos.xy));\n\
			\n\
			// shadow test\n\
			bool  inShadow = (Sz +0.007< Fz);\n\
			return inShadow;\n\
			}\n\
		void main(void)                                                 \n\
		{                                                               \n\
			vec4 n=texture2D(normalMap, vTextureCoords);          \n\
			n.x =n.x*2.0 -1.0; \n\
			n.y =n.y*2.0 -1.0; \n\
			n.z =n.z*2.0 -1.0; \n\
			vec3 N=normalize(vec3(n.x,n.z,n.y));\n\
			float shade =  dot(-uLightDirection.xyz , N);         \n\
			vec4 color=texture2D(texture, vTextureCoords);          \n\
			if(IsInShadow()){\n\
				\n\
					color.x*=0.6;\n\
					color.y*=0.6;\n\
					color.z*=0.6;\n\
				}\n\
			gl_FragColor = vec4(color.xyz*shade,1.0);          \n\
		}                                                               \n\
	";




    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uShadowMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uShadowMatrix");
    shaderProgram.uColorLocation               		= gl.getUniformLocation(shaderProgram, "uColor");
    shaderProgram.uNormalMapLocation		= gl.getUniformLocation(shaderProgram, "normalMap");
    shaderProgram.uShadowMapLocation		= gl.getUniformLocation(shaderProgram, "uShadowMap");
    shaderProgram.uLightDirectionLocation		= gl.getUniformLocation(shaderProgram, "uLightDirection");



    return shaderProgram;
};



reflectionMapShadowShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertex_shader = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		uniform   mat3  uViewSpaceNormalMatrix; \n\
		uniform   mat4 uShadowMatrix;\n\
		attribute vec3 aPosition;                                       \n\
		attribute vec4 aDiffuse;                                       \n\
		attribute vec4 aSpecular;                                       \n\
		attribute vec3 aNormal;                                       \n\
		attribute vec4 aAmbient;                                       \n\
		varying  vec3 vPos;                                       \n\
		varying  vec3 vNormal;                                       \n\
		varying  vec4 vdiffuse;                                       \n\
		varying  vec4 vspecular;                                       \n\
		varying  vec4 vambient;                                       \n\
		varying vec4 vShadowPosition;\n\
		void main(void)                                                 \n\
		{                                                               \n\
			  // vertex normal (in view space)                                   \n\
			vec4 position   = vec4(aPosition, 1.0);\n\
			vShadowPosition = uShadowMatrix    * position;\n\
			vPos = vec3(uModelViewMatrix * position);\n\
			vspecular= aSpecular;\n\
			vdiffuse= aDiffuse;\n\
			vambient = aAmbient;\n\
			vNormal = normalize( uViewSpaceNormalMatrix *  aNormal);             \n\
			gl_Position = uProjectionMatrix*uModelViewMatrix * vec4(aPosition, 1.0)  ;                         \n\
		}";

    shaderProgram.fragment_shader = "\
		precision highp float;                                          \n\
		uniform vec4 uLightDirection;			\n\
		uniform vec3 uLightColor;					\n\
		uniform vec3 uAmbient;						\n\
		uniform mat4 uViewToWorldMatrix; \n\
		uniform  samplerCube uCubeMap; 				\n\
		uniform sampler2D uShadowMap;\n\
		varying  vec3 vPos;                                       \n\
		varying  vec4 vdiffuse;                                       \n\
		varying  vec4 vspecular;                                       \n\
		varying vec3 vNormal;\n\
		varying vec4 vambient;\n\
		varying vec4 vShadowPosition;\n\
		float Unpack(vec4 v){\n\
			return v.x   + v.y / (256.0) + v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);\n\
		}\n\
		bool IsInShadow(){\n\
			// perspective division:\n\
			// from clip space to normalized space [-1..+1]^3\n\
			vec3  normShadowPos = vShadowPosition.xyz / vShadowPosition.w;\n\
			\n\
			// from [-1..+1] to [0..+1] (for texture coordinates and stored depth)\n\
			vec3  shadowPos     = normShadowPos * 0.5 + vec3(0.5);\n\
			float Fz = shadowPos.z;\n\
			float Sz = Unpack(texture2D(uShadowMap, shadowPos.xy));\n\
			\n\
			// shadow test\n\
			bool  inShadow = (Sz +0.007< Fz);\n\
			return inShadow;\n\
			}\n\
		void main(void)                                                 \n\
		{                                                               \n\
		// normalize interpolated normal                         \n\
		vec3 N = normalize(vNormal);                             \n\
				                                                   \n\
		// light vector (positional light)                       \n\
		vec3 L = normalize(-uLightDirection.xyz);                \n\
				                                                   \n\
		// diffuse component                                     \n\
		float NdotL = max(0.0, dot(N, L));                       \n\
		vec3 lambert = (vdiffuse.xyz * uLightColor) * NdotL+vambient.xyz * uLightColor;     \n\
		vec3 reflected_ray = vec3(uViewToWorldMatrix* vec4(reflect(vPos,vNormal),0.0));\n\
		vec4 reflected_color 	= textureCube (uCubeMap,reflected_ray);\n\
		vec4 color = reflected_color*vspecular  + vec4(lambert,1.0);\n\
\n\
 			if(IsInShadow()){\n\
				\n\
					color.x*=0.6;\n\
					color.y*=0.6;\n\
					color.z*=0.6;\n\
					}\n\
			gl_FragColor = color;\n\
		}                                                               \n\
	";




    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aColorIndex = 1;
    shaderProgram.aNormalIndex = 2;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram,shaderProgram. aColorIndex, "aColor");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aNormalIndex, "aNormal");

    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uShadowMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uShadowMatrix");
    shaderProgram.uViewSpaceNormalMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewSpaceNormalMatrix");
    shaderProgram.uShadowMapLocation		= gl.getUniformLocation(shaderProgram, "uShadowMap");
    return shaderProgram;
};

showCubeMapShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertex_shader = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		attribute vec3 aPosition;                                       \n\
		varying vec3 vPos;                                       \n\
		void main(void)                                                 \n\
		{                                                               \n\
			  // vertex normal (in view space)                                   \n\
			vPos = aPosition;\n\
			gl_Position = uProjectionMatrix*uModelViewMatrix * vec4(aPosition, 1.0)  ;                         \n\
		}";

    shaderProgram.fragment_shader = "\
		precision highp float;                                          \n\
		varying vec3 vPos;                                       \n\
		uniform  samplerCube uCubeMap; 				\n\
		void main(void)                                                 \n\
		{                                                               \n\
 			gl_FragColor = textureCube (uCubeMap,normalize(vPos));\n\
		}                                                               \n\
	";




    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");

    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;


    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uCubeMapLocation = gl.getUniformLocation(shaderProgram,"uCubeMap");

    return shaderProgram;
};


lambertianSingleColorShadowShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertex_shader = "\
precision highp float;     \n\
   \n\
uniform mat4 uProjectionMatrix;     \n\
uniform mat4 uModelMatrix;   \n\
uniform mat4 uViewMatrix;\n\
uniform mat4 uShadowMatrix;\n\
uniform mat3 uViewSpaceNormalMatrix;   \n\
uniform vec4    uLightDirection; \n\
attribute vec3 aPosition;  \n\
attribute vec3 aNormal;    \n\
varying vec3 vnormal;\n\
varying vec3 vcolor;\n\
varying vec4 vShadowPosition;\n\
   \n\
void main()    \n\
{  \n\
  // vertex normal (in view space)     \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal); \n\
   \n\
	vec4 position   = vec4(aPosition, 1.0);\n\
	vShadowPosition =  uShadowMatrix    * uModelMatrix *	position;\n\
   \n\
   \n\
   \n\
  // output    \n\
  gl_Position = uProjectionMatrix * uViewMatrix *uModelMatrix *position;   \n\
}  \n\
";

    shaderProgram.fragment_shader = "\
precision highp float;     \n\
   \n\
varying vec3 vnormal;\n\
varying vec3 vcolor;   \n\
uniform vec4 uLightDirection;\n\
uniform sampler2D uShadowMap;\n\
   \n\
// positional light: position and color\n\
uniform vec3 uLightColor;  \n\
uniform vec4 uColor;    \n\
varying vec4 vShadowPosition;\n\
float Unpack(vec4 v){\n\
	return v.x   + v.y / (256.0) + v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);\n\
}\n\
\n\
bool IsInShadow(){\n\
	// perspective division:\n\
	// from clip space to normalized space [-1..+1]^3\n\
	vec3  normShadowPos = vShadowPosition.xyz / vShadowPosition.w;\n\
	\n\
	// from [-1..+1] to [0..+1] (for texture coordinates and stored depth)\n\
	vec3  shadowPos     = normShadowPos * 0.5 + vec3(0.5);\n\
	float Fz = shadowPos.z;\n\
	float Sz = Unpack(texture2D(uShadowMap, shadowPos.xy));\n\
	\n\
	// shadow test\n\
	bool  inShadow = (Sz  +0.007< Fz);\n\
	return inShadow;\n\
}\n\
void main()    \n\
{  \n\
  // normalize interpolated normal     \n\
  vec3 N = normalize(vnormal);     \n\
   \n\
  // light vector (positional light)   \n\
  vec3 L = normalize(-uLightDirection.xyz); \n\
   \n\
  // diffuse component     \n\
  float NdotL = max(0.0, dot(N, L));   \n\
  vec3 color = (uColor.xyz * uLightColor) * NdotL;    \n\
	if( IsInShadow()){\n\
		color.x*=0.6;\n\
		color.y*=0.6;\n\
		color.z*=0.6;\n\
		}\n\
   gl_FragColor  = vec4(color, 1.0);     \n\
  }  \n\
";


    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragment_shader);
    gl.compileShader(fragmentShader);


    // Create the shader program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    shaderProgram.aPositionIndex = 0;
    shaderProgram.aNormalIndex = 2;
    gl.bindAttribLocation(shaderProgram, shaderProgram.aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aNormalIndex, "aNormal");
    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
        var str = "";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }


    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uShadowMatrixLocation = gl.getUniformLocation(shaderProgram,"uShadowMatrix");
    shaderProgram.uModelMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelMatrix");
    shaderProgram.uViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewMatrix");
    shaderProgram.uViewSpaceNormalMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewSpaceNormalMatrix");
    shaderProgram.uLightDirectionLocation = gl.getUniformLocation(shaderProgram,"uLightDirection");
    shaderProgram.uLightColorLocation = gl.getUniformLocation(shaderProgram,"uLightColor");
    shaderProgram.uColorLocation = gl.getUniformLocation(shaderProgram,"uColor");
    shaderProgram.uShadowMapLocation = gl.getUniformLocation(shaderProgram,"uShadowMap");

    return shaderProgram;
};

billboardShader = function (gl) {
    var vertex_shader = "\
		uniform   mat4 uModelViewMatrix;                                \n\
		uniform   mat4 uProjectionMatrix;                               \n\
		attribute vec3 aPosition;                                       \n\
		attribute vec4 aTxtCoord;				                        \n\
        varying vec4 vTexCoord;	                                        \n\
		void main(void)                                                 \n\
		{                        \n\
			vTexCoord = aTxtCoord; \n\
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);  \n\
		}                                                               \n\
	";

    var fragment_shader = "\
		precision highp float;                                          \n\
		uniform sampler2D uTexture; 				                    \n\
		uniform vec4 uColor;                                            \n\
		varying vec4 vTexCoord;			                                \n\
		void main(void)                                                 \n\
		{                                                               \n\
			 vec4 col = texture2D(uTexture, vTexCoord.xy);              \n\
			 gl_FragColor= col;\n\
		}                                                               \n\
	";

    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uModelViewMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.uProjectionMatrixLocation 	= gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    shaderProgram.uColorLocation               		= gl.getUniformLocation(shaderProgram, "uColor");
    shaderProgram.uTextureLocation=  gl.getUniformLocation(shaderProgram, "uTexture");

    return shaderProgram;
};

depthOfFieldShader = function (gl,constMAXRADIUS) {
    var vertex_shader = "\
		attribute vec3 aPosition;                                       \n\
		attribute vec2 aTextureCoords;				\n\
		varying vec2 vTexCoord;			\n\
		void main(void)                                                 \n\
		{                                                               \n\
			vTexCoord = aTextureCoords; \n\
			gl_Position = vec4(aPosition, 1.0);  \n\
		}                                                               \n\
	";

    var fragment_shader = "\
		precision highp float;                   	\n\
		const int MAXRADIUS ="+ constMAXRADIUS+";	\n\
		uniform sampler2D uDepthTexture;					\n\
		uniform sampler2D uTexture;								\n\
		uniform float uA,uB;											\n\
		uniform float near;												\n\
		uniform vec2 uDof;												\n\
		uniform vec2 uPxs;												\n\
		varying vec2 vTexCoord;										\n\
		float Unpack(vec4 v){											\n\
			return v.x   + v.y / (256.0) +								\n\
				v.z/(256.0*256.0)+v.w/ (256.0*256.0*256.0);	\n\
		}																					\n\
		float ComputeRadiusCoC( float z ) {				\n\
			float c = 0.0;													\n\
			// circle of confusion is computed here	\n\
			if ( z < uDof[0] )											\n\
 				c = float(MAXRADIUS)/(uDof[0]-near)*(uDof[0]-z);\n\
			if ( z > uDof[1] )																\n\
 				c = float(MAXRADIUS)/(uDof[0]-near)*(z-uDof[1]);\n\
			// clamp c between 1.0 and 7.0 pixels of radius	\n\
 			if ( int(c) > MAXRADIUS)												\n\
				return float(MAXRADIUS);											\n\
			else																						\n\
				return c;																			\n\
 			}																								\n\
		void main(void)																		\n\
		{																									\n\
			float z_01 =Unpack(texture2D(uDepthTexture,vTexCoord));\n\
			float z_NDC = z_01*2.0-1.0;\n\
			float z_V		= -uB / (z_NDC-uA);\n\
			int radius 	= int(ComputeRadiusCoC(z_V));						\n\
			vec4 accum_color = vec4(0.0 ,0.0 ,0.0 ,0.0) ;				\n\
																													\n\
			for ( int i = -MAXRADIUS ; i <= MAXRADIUS ; ++i )		\n\
				for ( int j = -MAXRADIUS ; j <= MAXRADIUS ; ++j )	\n\
					if ( 		(i >= -radius ) && ( i <= radius )			\n\
							&& 	(j >= -radius ) && ( j <= radius ) )		\n\
							accum_color += texture2D( uTexture ,				\n\
								vec2(	vTexCoord.x +float(i) *uPxs[0],			\n\
											vTexCoord.y+float(j) *uPxs[1]));		\n\
			accum_color /= vec4((radius*2+1)*(radius*2+1));			\n\
			vec4 color = accum_color;														\n\
		//	if(radius > 1) color+=vec4(1,0,0,1);\n\
	 		gl_FragColor = color;																\n\
	}";
    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment_shader);
    gl.compileShader(fragmentShader);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;
    shaderProgram.aTextureCoordIndex = 3;

    shaderProgram.vertex_shader = vertex_shader;
    shaderProgram.fragment_shader = fragment_shader;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uTextureLocation=  gl.getUniformLocation(shaderProgram, "uTexture");
    shaderProgram.uDepthTextureLocation=  gl.getUniformLocation(shaderProgram, "uDepthTexture");
    shaderProgram.uDofLocation=  gl.getUniformLocation(shaderProgram, "uDof");
    shaderProgram.uPxsLocation=  gl.getUniformLocation(shaderProgram, "uPxs");
    shaderProgram.uALocation=  gl.getUniformLocation(shaderProgram, "uA");
    shaderProgram.uBLocation=  gl.getUniformLocation(shaderProgram, "uB");
    return shaderProgram;
};



showCubeMapShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertexShaderSource = "\
		uniform   mat4 uModelViewMatrix;                            \n\
		uniform   mat4 uProjectionMatrix;                            \n\
		attribute vec3 aPosition;                                       \n\
		varying vec3 vPos;                                       \n\
		void main(void)                                                 \n\
		{                                                               \n\
			  // vertex normal (in view space)                                   \n\
			vPos = aPosition;\n\
			gl_Position = uProjectionMatrix*uModelViewMatrix * vec4(aPosition, 1.0)  ;                         \n\
		}";

    shaderProgram.fragmentShaderSource = "\
		precision highp float;                                          \n\
		varying vec3 vPos;                                       \n\
		uniform  samplerCube uCubeMap; 				\n\
		void main(void)                                                 \n\
		{                                                               \n\
 			gl_FragColor = textureCube (uCubeMap,normalize(vPos));\n\
		}                                                               \n\
	";




    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertexShaderSource);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create the shader program


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    shaderProgram.aPositionIndex = 0;

    gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");

    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var str = "Unable to initialize the shader program.\n\n";
        str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
        str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }

    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uCubeMapLocation = gl.getUniformLocation(shaderProgram,"uCubeMap");

    return shaderProgram;
};





lambertianSingleColorShader = function (gl) {

    var shaderProgram = gl.createProgram();

    shaderProgram.vertex_shader = "\
precision highp float;     \n\
   \n\
uniform mat4 uProjectionMatrix;     \n\
uniform mat4 uModelViewMatrix;   \n\
uniform mat3 uViewSpaceNormalMatrix;   \n\
attribute vec3 aPosition;  \n\
attribute vec3 aNormal;    \n\
varying vec3 vpos;   \n\
varying vec3 vnormal;\n\
   \n\
void main()    \n\
{  \n\
  // vertex normal (in view space)     \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal); \n\
   \n\
  \n\
// vertex position (in view space)   \n\
  vec4 position = vec4(aPosition, 1.0);\n\
  vpos = vec3(uModelViewMatrix *  position);  \n\
   \n\
   \n\
   \n\
  // output    \n\
  gl_Position = uProjectionMatrix *uModelViewMatrix * position;   \n\
}  \n\
";

    shaderProgram.fragment_shader = "\
precision highp float;     \n\
   \n\
varying vec3 vnormal;\n\
varying vec3 vpos;   \n\
uniform vec4 uLightDirection;\n\
   \n\
// positional light: position and color\n\
uniform vec3 uLightColor;  \n\
uniform vec4 uColor;    \n\
   \n\
void main()    \n\
{  \n\
  // normalize interpolated normal     \n\
  vec3 N = normalize(vnormal);     \n\
   \n\
  // light vector (positional light)   \n\
  vec3 L = normalize(-uLightDirection.xyz); \n\
   \n\
  // diffuse component     \n\
  float NdotL = max(0.0, dot(N, L));   \n\
  vec3 lambert = (uColor.xyz * uLightColor) * NdotL;    \n\
   \n\
  gl_FragColor  = vec4(lambert, 1.0);     \n\
  }  \n\
";


    // create the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderProgram.vertex_shader);
    gl.compileShader(vertexShader);

    // create the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderProgram.fragment_shader);
    gl.compileShader(fragmentShader);


    // Create the shader program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    shaderProgram.aPositionIndex = 0;
    shaderProgram.aNormalIndex = 2;
    gl.bindAttribLocation(shaderProgram, shaderProgram.aPositionIndex, "aPosition");
    gl.bindAttribLocation(shaderProgram, shaderProgram.aNormalIndex, "aNormal");
    gl.linkProgram(shaderProgram);

    shaderProgram.vertexShader = vertexShader;
    shaderProgram.fragmentShader = fragmentShader;

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
        var str = "";
        str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
        str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
        str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
        alert(str);
    }


    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram,"uProjectionMatrix");
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram,"uModelViewMatrix");
    shaderProgram.uViewSpaceNormalMatrixLocation = gl.getUniformLocation(shaderProgram,"uViewSpaceNormalMatrix");
    shaderProgram.uLightDirectionLocation = gl.getUniformLocation(shaderProgram,"uLightDirection");
    shaderProgram.uLightColorLocation = gl.getUniformLocation(shaderProgram,"uLightColor");
    shaderProgram.uColorLocation = gl.getUniformLocation(shaderProgram,"uColor");

    return shaderProgram;
};


motionBlurShader = function (gl) {
	var vertex_shader = "\
		attribute vec3 aPosition;                                       \n\
		attribute vec2 aTextureCoords;				\n\
		varying vec2 vTexCoord;			\n\
		void main(void)                                                 \n\
		{                                                               \n\
			vTexCoord = aTextureCoords; \n\
			gl_Position = vec4(aPosition, 1.0);  \n\
		}                                                               \n\
	";
  
	var fragment_shader = "\
		precision highp float;										\n\
		const int STEPS =	40;											\n\
		uniform sampler2D uVelocityTexture;				\n\
		uniform sampler2D uTexture;								\n\
		varying vec2 vTexCoord;										\n\
		vec2 Vel(vec2 p){													\n\
			vec2 vel = texture2D ( uVelocityTexture , p ).xy;	\n\
  			vel = vel* 2.0- 1.0;														\n\
			return vel;																				\n\
		}																										\n\
		void main(void)																			\n\
		{																							\n\
			vec2 vel = Vel(vTexCoord);									\n\
			vec4 accum_color = vec4(0.0 ,0.0 ,0.0 ,0.0);\n\
																									\n\
			float l = length(vel);											\n\
			if ( l < 4.0/255.0) vel=vec2(0.0,0.0);			\n\
			vec2 delta = -vel/vec2(STEPS);							\n\
			int steps_done = 0;													\n\
			accum_color= texture2D( uTexture , vTexCoord);\n\
			float i = (accum_color.x+accum_color.y+accum_color.z)/3.0;\n\
			for ( int i = 1 ; i <=   STEPS ; ++i )				\n\
					{																					\n\
					vec2 p = vTexCoord + float(i)*delta;			\n\
						if( (p.x <1.0) && (p.x > 0.0)						\n\
								&& (p.y <1.0) && (p.y >0.0) )				\n\
								{			\n\
								if(length(Vel(p)-vel)<0.01){\n\
	 							steps_done++;												\n\
								accum_color += texture2D( uTexture , p);\n\
							}\n\
						};																					\n\
					}																							\n\
			accum_color /= float(steps_done+1);								\n\
			vec4 vcol=vec4(0.0,0.0,0.0,1.0);\n\
			if(vel.x>0.01) vcol+=vec4(vel.x,0.0,0.0,0.0);\n\
			if(vel.x<-0.01) vcol+=vec4(0.0,-vel.x,0.0,0.0);\n\
			gl_FragColor = vec4(accum_color.xyz ,1.0);//*0.000001+vec4(i,i,i,1.0)+vcol;	\n\
 		}                                                   \n\
	";

	// create the vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertex_shader);
	gl.compileShader(vertexShader);

	// create the fragment shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragment_shader);
	gl.compileShader(fragmentShader);

	// Create the shader program

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	
	shaderProgram.aPositionIndex = 0;
	shaderProgram.aTextureCoordIndex = 3;
	
	shaderProgram.vertex_shader = vertex_shader;
	shaderProgram.fragment_shader = fragment_shader;
	
	gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
	gl.bindAttribLocation(shaderProgram, shaderProgram.aTextureCoordIndex, "aTextureCoords");
	gl.linkProgram(shaderProgram);
  
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var str = "Unable to initialize the shader program.\n\n";
		str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
		str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
		str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
		alert(str);
	}
	
	shaderProgram.uTextureLocation=  gl.getUniformLocation(shaderProgram, "uTexture");
	shaderProgram.uVelocityTextureLocation=  gl.getUniformLocation(shaderProgram, "uVelocityTexture");
	return shaderProgram;
};




velocityVectorShader = function (gl) {
	var vertex_shader = "\
		uniform   mat4 uPreviousModelViewMatrix;		\n\
		uniform   mat4 uModelViewMatrix;				\n\
		uniform   mat4 uProjectionMatrix;				\n\
		attribute vec3 aPosition;										\n\
		varying vec4 prev_position;									\n\
		varying vec4 curr_position;									\n\
		void main(void)											\n\
		{																	\n\
			prev_position 	= uProjectionMatrix*uPreviousModelViewMatrix	*vec4(aPosition, 1.0);\n\
			curr_position 	= uProjectionMatrix*uModelViewMatrix		*vec4(aPosition, 1.0); \n\
			gl_Position 	= uProjectionMatrix*uPreviousModelViewMatrix	*vec4(aPosition, 1.0);  \n\
		}																	  \n\
	";
  
	var fragment_shader = "\
		precision highp float;		\n\
		varying vec4 prev_position;	\n\
		varying vec4 curr_position;	\n\
		void main(void)							\n\
		{ 										\n\
			vec4 pp = prev_position / prev_position.w;	\n\
			vec4 cp	= curr_position / curr_position.w;	\n\
			vec2 vel= cp.xy- pp.xy;					\n\
			vel 	= vel*0.5+0.5;						\n\
			gl_FragColor =vec4(vel,0.0,1.0);			\n\
 		}										\n\
	";

	// create the vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertex_shader);
	gl.compileShader(vertexShader);

	// create the fragment shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragment_shader);
	gl.compileShader(fragmentShader);

	// Create the shader program

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	
	shaderProgram.aPositionIndex = 0;
	
	shaderProgram.vertex_shader = vertex_shader;
	shaderProgram.fragment_shader = fragment_shader;
	
	gl.bindAttribLocation(shaderProgram,shaderProgram. aPositionIndex, "aPosition");
	gl.linkProgram(shaderProgram);
  
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var str = "Unable to initialize the shader program.\n\n";
		str += "VS:\n"   + gl.getShaderInfoLog(vertexShader)   + "\n\n";
		str += "FS:\n"   + gl.getShaderInfoLog(fragmentShader) + "\n\n";
		str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
		alert(str);
	}
	
	shaderProgram.uModelViewMatrixLocation=  gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	shaderProgram.uPreviousModelViewMatrixLocation=  gl.getUniformLocation(shaderProgram, "uPreviousModelViewMatrix");
	shaderProgram.uProjectionMatrixLocation=  gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	return shaderProgram;
};



