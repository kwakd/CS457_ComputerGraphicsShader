#version 330 compatibility

in vec2 vST;
uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform sampler2D uImageUnit;


void
main()
{
    vec3 normalTexture = texture2D(uImageUnit, vST).rgb;
    gl_FragColor = vec4(normalTexture, 1. );
}