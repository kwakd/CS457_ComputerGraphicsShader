#version 330 compatibility

out vec3  vMCposition;
out float  vLightIntensity;
out vec2  st;
out vec4  vColor;

const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main()
{
  vColor = gl_Color;
  st = gl_MultiTexCoord0.st; //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/Textures.1pp.pdf

  vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
  vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
  vLightIntensity  = abs(  dot( normalize(LIGHTPOS - ECposition), tnorm )  );

  vMCposition = gl_Vertex.xyz;
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
