#version 100

precision mediump float;

uniform sampler2D uVideoTexSampler0;
varying vec2 vVideoTexSamplingCoord0;

uniform sampler2D uOverlayTexSampler1;
uniform float uOverlayAlphaScale1;
varying vec2 vOverlayTexSamplingCoord1;

const int GL_FALSE = 0;
const int GL_TRUE = 1;
uniform int uEnableColorTransfer;

// Manually implementing the CLAMP_TO_BORDER texture wrapping option
// (https://open.gl/textures) since it's not implemented until OpenGL ES 3.2.
vec4 getClampToBorderOverlayColor(sampler2D texSampler, vec2 texSamplingCoord, float alphaScale){
  if (texSamplingCoord.x > 1.0 || texSamplingCoord.x < 0.0
      || texSamplingCoord.y > 1.0 || texSamplingCoord.y < 0.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    vec4 overlayColor = vec4(texture2D(texSampler, texSamplingCoord));
    overlayColor.a = alphaScale * overlayColor.a;
    return overlayColor;
  }
}

vec4 getMixColor(vec4 videoColor, vec4 overlayColor) {
  vec4 outputColor;
  outputColor.rgb = overlayColor.rgb * overlayColor.a + videoColor.rgb * (1.0 - overlayColor.a);
  outputColor.a = overlayColor.a + videoColor.a * (1.0 - overlayColor.a);
  return outputColor;
}

float srgbEotfSingleChannel(float srgb) {
  return srgb <= 0.04045 ? srgb / 12.92 : pow((srgb + 0.055) / 1.055, 2.4);
}

// sRGB EOTF.
vec3 applyEotf(const vec3 srgb) {
  // Reference implementation:
  // https://cs.android.com/android/platform/superproject/+/master:frameworks/native/libs/
  //          renderengine/gl/ProgramCache.cpp;drc=de09f10aa504fd8066370591a00c9ff1cafbb7fa;l=235

  if (uEnableColorTransfer == GL_TRUE) {
    return vec3(
    srgbEotfSingleChannel(srgb.r),
    srgbEotfSingleChannel(srgb.g),
    srgbEotfSingleChannel(srgb.b)
    );
  } else {
    // do nothing
    return srgb;
  }
}

void main() {
  vec4 videoColor = vec4(texture2D(uVideoTexSampler0, vVideoTexSamplingCoord0));
  vec4 fragColor = videoColor;


  vec4 electricalOverlayColor1 = getClampToBorderOverlayColor(
    uOverlayTexSampler1, vOverlayTexSamplingCoord1, uOverlayAlphaScale1);

  vec4 opticalOverlayColor1 = vec4(
    applyEotf(electricalOverlayColor1.rgb), electricalOverlayColor1.a);

  fragColor = getMixColor(fragColor, opticalOverlayColor1);

  gl_FragColor = fragColor;
}