uniform sampler2D TexUnit;

void main() {
    vec3 color = texture2D(TexUnit, gl_TexCoord[0].st).rgb;
    gl_FragColor = vec4(color.rgb, 1.);
}