#version 330 compatibility

out vec2 vST;

void
main()
{
    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/Textures.1pp.pdf
    vST = gl_MultiTexCoord0.st;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}