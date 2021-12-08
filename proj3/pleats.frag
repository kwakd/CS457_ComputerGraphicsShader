#version 330 compatibility

in vec3 vMC;
in vec3 vNormal;
in vec3 vPtoL;
in vec3 vPtoE;
in vec2 vST;

uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform sampler3D Noise3;


vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main()
{
    vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/lighting.1pp.pdf
    vec3 newShape = RotateNormal(angx, angy, vNormal);
    vec3 ref = normalize(gl_NormalMatrix * newShape);
    vec4 ambient = uKa * uColor;
    vec4 diffuse = uKd * max(dot(ref, vPtoL), 0.) * uColor;
    vec4 spec;

    //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/lighting.1pp.pdf
    if(dot(ref, vPtoL) > 0.)
    {
        vec3 reflect = normalize(reflect(-vPtoL, ref));
        spec = uKs * pow(max(dot(vPtoE, reflect), 0.), uShininess) * uSpecularColor;
    }

    gl_FragColor = vec4(ambient.rgb + diffuse.rgb + spec.rgb, 1.);
}