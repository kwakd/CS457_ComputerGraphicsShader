#version 330 compatibility
in vec2 vST;
uniform sampler2D uTexUnit;

void
main( )
{
    vec3 newcolor = texture( uTexUnit, vST ).rgb;
    gl_FragColor = vec4( newcolor, 1. );
}