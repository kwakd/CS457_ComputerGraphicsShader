#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 st;
in vec4 vColor;


uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uAlpha;
uniform float uNoiseFreq;

uniform sampler3D Noise3;

const vec3 WHITE = vec3(1., 1., 1.);

void
main()
{
  vec4 nv = texture3D( Noise3, uNoiseFreq*vMCposition );
  float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
  n = n - 2.;                             // -1. -> 1.

  //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/stripesringsanddots.1pp.pdf
  float Ar = uAd/2;
  float Br = uBd/2;
  int numins = int(st.s/uAd);
  int numint = int(st.t/uBd);

  // determine the color based on the noise-modified (s,t):

  float sc = float(numins) * uAd  +  Ar;
  float ds = st.s - sc;                   // wrt ellipse center
  float tc = float(numint) * uBd  +  Br;
  float dt = st.t - tc;                   // wrt ellipse center

  float oldDist = sqrt( ds*ds + dt*dt );
  float newDist = (n * uNoiseAmp) + oldDist; //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/noise.1pp.pdf
  float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

  ds *= scale;                           //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/noise.1pp.pdf
  dt *= scale;
  ds /= Ar;
  dt /= Br;

  float d = ds*ds + dt*dt;
  float t = smoothstep( 1. - uTol, 1. + uTol, d);

  //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/mixing.1pp.pdf
  //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/noise.1pp.pdf
  vec4 start = vec4(vLightIntensity * vColor.rgb, 1.);
  vec4 end = vec4(vLightIntensity * WHITE, uAlpha);

  gl_FragColor = mix(start, end, t);

  if (gl_FragColor.a == 0)
	   discard;
}
