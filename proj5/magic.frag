#version 330 compatibility

in vec2 vST;

uniform float uSc; //MagicLens S Coordinates Horizontal
uniform float uTc; //MagicLens T Coordinates Vertical
uniform float uDs; //MagicLens Rectangle Width 
uniform float uDt; //MagicLens Rectangle Height
uniform float uMagFactor; //Magnification
uniform float uRotAngle; //Rotation
uniform float uSharpFactor; //Sharpening

uniform sampler2D uImageUnit;

void
main()
{
        //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/image.1pp.pdf
        //Slide 2
        ivec2 ires = textureSize(uImageUnit, 0);
        float ResS = float(ires.s);
        float ResT = float(ires.t);

        //Inside the fragment shader, you need to see if the current fragment is inside the Magic Lens rectangle.
        if(vST.s > uSc - uDs && vST.s < uSc + uDs && vST.t > uTc - uDt && vST.t < uTc + uDt)
        {
            //scaling and rotation you do to this (s,t) is with respect to the center (uSc,uTc) of the Magic Lens:
            //magicLensPosX is the new position for magiclens position, subtracting the total size by what the user wants
            //leads to new positions for the user
            //For example: vST.s = 1 (total) uSc = 0.5(base value)
            // 1 - 0.5 = 0.5 which basically means the center of the resolution in whichever direction S or T
            float magicLensPosS = vST.s - uSc;
            float magicLensPosT = vST.t - uTc;

            //When you want to do something to an image, you do the inverse of that to the (s,t) coordinates.
            //scale the image by uMagFactor, you do ????? to its (s,t) coordinates:
            //https://stackoverflow.com/questions/24651369/blend-textures-of-different-size-coordinates-in-glsl/24654919
            //https://gamedev.stackexchange.com/questions/49008/how-to-scale-a-texture-in-opengl-lwjgl
            //these two sites gave me hints on how to scale, basically dividing the magicLensPosX by the uMagFactor
            //in order to get the ratio to magnify
            magicLensPosS /= uMagFactor;
            magicLensPosT /= uMagFactor;

            //And, if you want to rotate an image, you would do:
            //s' = s*cos(theta) - t*sin(theta) 
            //t' = s*sin(theta) + t*cos(theta)
            float magicLensRotateS = magicLensPosS * cos(uRotAngle) - magicLensPosT * sin(uRotAngle);
            float magicLensRotateT = magicLensPosS * sin(uRotAngle) + magicLensPosT * cos(uRotAngle);

            //So, you would need to do ????? with the image's (s,t).
            //we add uSc and uTc to the magicLensRotateX so that it's picking the right image, without this the rectangle is centered on the wrong part of the image
            vec2 newMagicLensPosST = vec2(magicLensRotateS + uSc, magicLensRotateT + uTc);
            vec3 irgb = texture2D(uImageUnit, newMagicLensPosST).rgb;

            //The sharpening can be done with the code in the Image Manipulation notes. The sharpening is not done with respect to the center of the Magic Lense.
            //http://web.engr.oregonstate.edu/~mjb/cs557/Handouts/image.1pp.pdf
            //Slide 15
            vec2 stp0 = vec2(1./ResS, 0. );
            vec2 st0p = vec2(0. , 1./ResT);
            vec2 stpp = vec2(1./ResS, 1./ResT);
            vec2 stpm = vec2(1./ResS, -1./ResT);
            vec3 i00 = texture2D( uImageUnit, newMagicLensPosST ).rgb;
            vec3 im1m1 = texture2D( uImageUnit, newMagicLensPosST-stpp ).rgb;
            vec3 ip1p1 = texture2D( uImageUnit, newMagicLensPosST+stpp ).rgb;
            vec3 im1p1 = texture2D( uImageUnit, newMagicLensPosST-stpm ).rgb;
            vec3 ip1m1 = texture2D( uImageUnit, newMagicLensPosST+stpm ).rgb;
            vec3 im10 = texture2D( uImageUnit, newMagicLensPosST-stp0 ).rgb;
            vec3 ip10 = texture2D( uImageUnit, newMagicLensPosST+stp0 ).rgb;
            vec3 i0m1 = texture2D( uImageUnit, newMagicLensPosST-st0p ).rgb;
            vec3 i0p1 = texture2D( uImageUnit, newMagicLensPosST+st0p ).rgb;
            vec3 target = vec3(0.,0.,0.);
            target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
            target += 2.*(im10+ip10+i0m1+i0p1);
            target += 4.*(i00);
            target /= 16.;
            gl_FragColor = vec4( mix( target, irgb, uSharpFactor ), 1. );
        }//If statement FINISH

        // If it is not, do a texture lookup as normal.
        else
        {
            vec3 normalTexture = texture2D(uImageUnit, vST).rgb;
            gl_FragColor = vec4(normalTexture, 1.);
        }
}