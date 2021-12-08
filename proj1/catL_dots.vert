#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );

out vec2 vST;
out vec4 vColor;



void
main( )
{
	vColor = gl_Color;
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vMCposition  = gl_Vertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
