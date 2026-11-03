#version 100
attribute vec4 aFramePosition;
varying vec2 vVideoTexSamplingCoord0;

// uniform mat4 uTransformationMatrix1;
// uniform mat4 uVertexTransformationMatrix1;
varying vec2 vOverlayTexSamplingCoord1;

vec2 getTexSamplingCoord(vec2 ndcPosition){
  return vec2(ndcPosition.x * 0.5 + 0.5, ndcPosition.y * 0.5 + 0.5);
}

void main() {
  gl_Position = aFramePosition;
  vVideoTexSamplingCoord0 = getTexSamplingCoord(aFramePosition.xy);

//  vec4 aOverlayPosition1 =  uVertexTransformationMatrix1 * uTransformationMatrix1 * aFramePosition;
  vec4 aOverlayPosition1 =  aFramePosition;
  vOverlayTexSamplingCoord1 = getTexSamplingCoord(aOverlayPosition1.xy);
}