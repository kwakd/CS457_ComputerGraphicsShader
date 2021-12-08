#version 330 compatibility
#define Pi 3.14159265359
#define Y0 .5

out vec3 vMC;
out vec3 vNormal;
out vec3 vPtoL;
out vec3 vPtoE;
out vec2 vST;

uniform float uP; 
uniform float tP; 
uniform float Timer;

void
main()
{
    float x = gl_Vertex.x;
    float y = gl_Vertex.y;
    float z = (uP*(sin(x - Timer * tP)));

    vST = gl_MultiTexCoord0.st;
    vec4 temporary = vec4(gl_Vertex.x, gl_Vertex.y, z, gl_Vertex.w);
    vMC = temporary.xyz;
    gl_Position = gl_ModelViewProjectionMatrix * temporary;


}