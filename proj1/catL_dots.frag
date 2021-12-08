#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2  vST;
in vec4 vColor;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec3 WHITE = vec3(1., 1., 1.);

void
main( )
{
		float Ar = uAd/2.;
		float Br = uBd/2.;
		int numins = int(vST.s/uAd);
		int numint = int(vST.t/uBd);
		float sc = (numins * uAd) + Ar;
		float tc = (numint * uBd) + Br;

		float ellipse = (((vST.s - sc) / Ar) * ((vST.s - sc) / Ar)) + (((vST.t - tc) / Br) * ((vST.t - tc) / Br));

		float d = smoothstep( 1. - uTol, 1. + uTol, ellipse);
		vec4 start = vec4(vLightIntensity * vColor.rgb, 1.);
		vec4 end = vec4(vLightIntensity * WHITE, 1.);
		gl_FragColor = mix(start, end, d);
}
