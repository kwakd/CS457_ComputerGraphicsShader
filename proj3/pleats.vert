#version 330 compatibility
#define Pi 3.14159265359
#define Y0 .5

out vec3 vMC;
out vec3 vNormal;
out vec3 vPtoL;
out vec3 vPtoE;
out vec2 vST;

uniform float uK;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

void
main()
{
    float x = gl_Vertex.x;
    float y = gl_Vertex.y;
    float z = (uK * (Y0 - y) * sin((2.*Pi*x)/uP));

    float dzdx = uK * (Y0 - y) * (2. * (Pi / uP)) * cos(2. * Pi * (x/uP)); 
    float dzdy = -uK * sin(2. * Pi * (x/uP));

    vec3 Tx = vec3(1., 0., dzdx);
    vec3 Ty = vec3(0., 1., dzdy);

    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/bumpmapping.1pp.pdf
    vNormal = normalize(cross(Tx,Ty));

    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/Textures.1pp.pdf
    vST = gl_MultiTexCoord0.st;
    vec4 temporary = vec4(gl_Vertex.x, gl_Vertex.y, z, gl_Vertex.w);
    vMC = temporary.xyz;
    //The original x and y, plus the new z become the new vertex that gets multiplied by gl_ModelViewProjectionMatrix.
    gl_Position = gl_ModelViewProjectionMatrix * temporary;


    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/lighting.1pp.pdf
    vec3 vEye = vec3(gl_ModelViewMatrix * temporary);
    vec3 vLight = vec3(uLightX, uLightY, uLightZ);

    vPtoL = normalize(vLight - vEye);
    vPtoE = normalize(vec3(0., 0., 0.) - vEye);

}