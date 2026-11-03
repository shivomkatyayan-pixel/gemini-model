#version 100
// ES 2 fragment shader that samples from a (non-external) texture with
// uTexSampler, and multiplies its alpha value by uAlphaScale.

precision mediump float;

uniform sampler2D uTexSampler;
uniform float uAlphaScale;

varying vec2 vTexSamplingCoord;

void main() {
  vec4 src = texture2D(uTexSampler, vTexSamplingCoord);
  gl_FragColor = vec4(src.rgb, src.a * uAlphaScale);
}
