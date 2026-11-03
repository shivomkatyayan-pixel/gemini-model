#version 300 es
// Copyright 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ES 3 fragment shader that:
// 1. Samples electrical (HLG or PQ) BT.2020 RGB from an internal texture.
// 2. Applies an EOTF based on uInputColorTransfer, yielding optical linear
//    BT.2020 RGB.
// 3. Optionally applies a BT2020 to BT709 OOTF, if OpenGL tone-mapping is
//    requested via uApplyHdrToSdrToneMapping.
// 4. Applies a 4x4 RGB color matrix to change the pixel colors.
// 5. Outputs as requested by uOutputColorTransfer. Use COLOR_TRANSFER_LINEAR
//    for outputting to intermediate shaders, or COLOR_TRANSFER_ST2084 /
//    COLOR_TRANSFER_HLG to output electrical colors via an OETF (e.g. to an
//    encoder).
// The output will be red or blue if an error has occurred.

precision mediump float;
uniform sampler2D uTexSampler;
uniform mat4 uRgbMatrix;
// C.java#ColorTransfer value.
// Only COLOR_TRANSFER_ST2084 and COLOR_TRANSFER_HLG are allowed.
uniform int uInputColorTransfer;
// C.java#ColorSpace value.
uniform int uInputColorSpace;
// C.java#ColorSpace value.
uniform int uOutputColorSpace;
// C.java#ColorSpace value.
uniform int uIntermediateColorSpace;
in vec2 vTexSamplingCoord;
out vec4 outColor;

// LINT.IfChange(color_transfer)
const int COLOR_TRANSFER_LINEAR = 1;
const int COLOR_TRANSFER_GAMMA_2_2 = 10;
const int COLOR_TRANSFER_ST2084 = 6;
const int COLOR_TRANSFER_HLG = 7;

// LINT.IfChange(color_space)
const int COLOR_SPACE_BT601 = 2;
const int COLOR_SPACE_BT709 = 1;
const int COLOR_SPACE_BT2020 = 6;
const int COLOR_SPACE_DISPLAY_P3 = 10;

// Matrix values based on computeXYZMatrix(BT2020Primaries, BT2020WhitePoint)
// https://cs.android.com/android/platform/superproject/+/master:frameworks/base/libs/hwui/utils/HostColorSpace.cpp;l=200-232;drc=86bd214059cd6150304888a285941bf74af5b687
const mat3 RGB_BT2020_TO_XYZ =
    mat3(0.63695805f, 0.26270021f, 0.00000000f, 0.14461690f, 0.67799807f,
         0.02807269f, 0.16888098f, 0.05930172f, 1.06098506f);
const mat3 XYZ_TO_RGB_BT2020 =
    mat3(1.7166511880f, -0.3556707838f, -0.2533662814f, -0.6666843518f,
         1.6164812366f,  0.0157685458f, 0.0176398574f, -0.0427706133f,  0.9421031212f);
// Matrix values based on computeXYZMatrix(BT709Primaries, BT709WhitePoint)
const mat3 RGB_BT709_TO_XYZ =
    mat3(0.41239080f, 0.35758434f, 0.18048079f, 0.21263901f, 0.71516868f,
         0.07219232f, 0.01933082f, 0.11919478f, 0.95053215f);
const mat3 XYZ_TO_RGB_BT709 =
    mat3(3.24096994f, -0.96924364f, 0.05563008f, -1.53738318f, 1.87596750f,
         -0.20397696f, -0.49861076f, 0.04155506f, 1.05697151f);
const mat3 RGB_P3_TO_XYZ =
    mat3(0.48656854f, 0.22897342f, 0.00000000f, 0.26567274f, 0.69175166f,
         0.04511426f, 0.19818731f, 0.07927492f, 1.04378641f);
const mat3 XYZ_TO_RGB_P3 =
    mat3(2.49350905f, -0.82947320f, 0.03585127f, -0.93138826f, 1.76263070f,
         -0.07618395f, -0.40271285f, 0.02362424f, 0.95702940f);


// Output colors for an obviously visible error.
const vec3 ERROR_COLOR_RED = vec3(1.0, 0.0, 0.0);
const vec3 ERROR_COLOR_GREEN = vec3(0.0, 1.0, 0.0);
const vec3 ERROR_COLOR_BLUE = vec3(0.0, 0.0, 1.0);

// Apply the HLG BT2020 to BT709 OOTF.
highp vec3 applyHlgBt2020ToBt709Ootf(highp vec3 linearRgbBt2020) {
  // Reference ("HLG Reference OOTF" section):
  // https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.2100-2-201807-I!!PDF-E.pdf
  // hlgGamma is 1.2 + 0.42 * log10(nominalPeakLuminance/1000);
  // nominalPeakLuminance was selected to use a 500 as a typical value, used
  // in
  // https://cs.android.com/android/platform/superproject/+/master:frameworks/native/libs/tonemap/tonemap.cpp;drc=7a577450e536aa1e99f229a0cb3d3531c82e8a8d;l=62,
  // b/199162498#comment35, and
  // https://www.microsoft.com/applied-sciences/uploads/projects/investigation-of-hdr-vs-tone-mapped-sdr/investigation-of-hdr-vs-tone-mapped-sdr.pdf.
  const float hlgGamma = 1.0735674018211279;

  vec3 linearXyz = RGB_BT2020_TO_XYZ * linearRgbBt2020;
  linearXyz = linearXyz * pow(linearXyz[1], hlgGamma - 1.0);
  vec3 linearRgbBt709 = clamp((XYZ_TO_RGB_BT709 * linearXyz), 0.0, 1.0);
  return linearRgbBt709;
}

highp vec3 applyBt709ToHlgBt2020Ootf(highp vec3 linearRgbBt709) {
  // Reference ("HLG Reference OOTF" section):
  // https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.2100-2-201807-I!!PDF-E.pdf
  // hlgGamma is 1.2 + 0.42 * log10(nominalPeakLuminance/1000);
  // nominalPeakLuminance was selected to use a 500 as a typical value, used
  // in
  // https://cs.android.com/android/platform/superproject/+/master:frameworks/native/libs/tonemap/tonemap.cpp;drc=7a577450e536aa1e99f229a0cb3d3531c82e8a8d;l=62,
  // b/199162498#comment35, and
  // https://www.microsoft.com/applied-sciences/uploads/projects/investigation-of-hdr-vs-tone-mapped-sdr/investigation-of-hdr-vs-tone-mapped-sdr.pdf.
  const float hlgGamma = 1.0735674018211279;

  // Convert from BT.709 to XYZ color space
  vec3 linearXyz = RGB_BT709_TO_XYZ * linearRgbBt709;

  // Apply the inverse OOTF (HLG Reference OOTF)
  linearXyz = linearXyz * pow(linearXyz[1], 1.0 / hlgGamma - 1.0);
  // Convert from XYZ to BT.2020 color space
  vec3 linearRgbBt2020 = clamp(XYZ_TO_RGB_BT2020 * linearXyz, 0.0, 1.0);
  return linearRgbBt2020;
}

// Apply the PQ BT2020 to BT709 OOTF.
highp vec3 applyPqBt2020ToBt709Ootf(highp vec3 linearRgbBt2020) {
  // Reference implementation:
  // https://cs.android.com/android/platform/superproject/main/+/main:frameworks/native/libs/renderengine/gl/ProgramCache.cpp;l=343-397;drc=1b988a4ee33de9cab9740ddc1ee70b1734c8e622
  // Constants x0 and y0 from the reference implementation are set to 0 in this
  // implementation.
  const float pqMaxLuminance = 10000.0;
  const float sdrMaxLuminance = 500.0;

  // Default value mastering luminance based on experimentation, and as a common
  // industry value.
  // Also happens to match Netflix's minimum HDR mastering guidelines:
  // https://partnerhelp.netflixstudios.com/hc/en-us/articles/360000599948-Dolby-Vision-HDR-Mastering-Guidelines
  //
  // TODO: b/290553698 - Use max_display_mastering_luminance from
  //  ColorInfo.hdrStaticInfo in the bitstream instead.
  const float maxMasteringLuminance = 1000.0;

  const float maxInputLuminance = maxMasteringLuminance;
  const float maxOutputLuminance = sdrMaxLuminance;

  linearRgbBt2020 = linearRgbBt2020 * pqMaxLuminance;  // Scale luminance.
  float nits = linearRgbBt2020.y;

  nits = clamp(nits, 0.0, maxInputLuminance);

  // Two control points.
  float x1 = maxOutputLuminance * 0.75;
  float y1 = x1;
  float x2 = x1 + (maxInputLuminance - x1) / 2.0;
  float y2 = y1 + (maxOutputLuminance - y1) * 0.75;

  // Horizontal distances between the last three control points.
  float h12 = x2 - x1;
  float h23 = maxInputLuminance - x2;
  // Tangents at the last three control points.
  float m1 = (y2 - y1) / h12;
  float m3 = (maxOutputLuminance - y2) / h23;
  float m2 = (m1 + m3) / 2.0;

  if (nits < x1) {
    // Scale [0, x1] to [0, y1] linearly.
    float slope = y1 / x1;
    nits = nits * slope;
  } else if (nits < x2) {
    // Scale [x1, x2] to [y1, y2] using Hermite interpolation.
    float t = (nits - x1) / h12;
    nits = (y1 * (1.0 + 2.0 * t) + h12 * m1 * t) * (1.0 - t) * (1.0 - t) +
           (y2 * (3.0 - 2.0 * t) + h12 * m2 * (t - 1.0)) * t * t;
  } else {
    // Scale [x2, maxInputLuminance] to [y2, maxOutputLuminance] using
    // Hermite interpolation.
    float t = (nits - x2) / h23;
    nits =
        (y2 * (1.0 + 2.0 * t) + h23 * m2 * t) * (1.0 - t) * (1.0 - t) +
        (maxOutputLuminance * (3.0 - 2.0 * t) + h23 * m3 * (t - 1.0)) * t * t;
  }

  // linearRgbBt2020.y is greater than 0 and is thus non-zero.
  linearRgbBt2020 = linearRgbBt2020 * (nits / linearRgbBt2020.y);
  linearRgbBt2020 = linearRgbBt2020 / sdrMaxLuminance;  // Normalize luminance.
  vec3 linearRgbBt709 = XYZ_TO_RGB_BT709 * RGB_BT2020_TO_XYZ * linearRgbBt2020;
  return linearRgbBt709;
}

// Apply the BT2020 to P3 OOTF.
highp vec3 applyBt2020ToP3Ootf(highp vec3 linearRgbBt2020) {
  vec3 linearXyz = RGB_BT2020_TO_XYZ * linearRgbBt2020;
  vec3 linearRgbP3 = clamp((XYZ_TO_RGB_P3 * linearXyz), 0.0, 1.0);
  return linearRgbP3;
}

// Apply the P3 to BT2020 OOTF.
highp vec3 applyP3ToBt2020Ootf(highp vec3 linearRgbBt2020) {
  vec3 linearXyz = RGB_P3_TO_XYZ * linearRgbBt2020;
  vec3 linearRgbBt2020 = clamp((XYZ_TO_RGB_BT2020 * linearXyz), 0.0, 1.0);
  return linearRgbBt2020;
}

highp vec3 applyBt2020ToBt709Ootf(highp vec3 linearRgbBt2020) {
  if (uInputColorTransfer == COLOR_TRANSFER_ST2084) {
    return applyPqBt2020ToBt709Ootf(linearRgbBt2020);
  } else if (uInputColorTransfer == COLOR_TRANSFER_HLG) {
    return applyHlgBt2020ToBt709Ootf(linearRgbBt2020);
  } else {
    return ERROR_COLOR_GREEN;
  }
}

highp vec3 applyOotf(highp vec3 linearRgb) {
  highp vec3 intermediateLinearRgb = linearRgb;
  if (uInputColorSpace == COLOR_SPACE_BT2020) {
    if (uIntermediateColorSpace == COLOR_SPACE_BT709) {
      intermediateLinearRgb = applyHlgBt2020ToBt709Ootf(intermediateLinearRgb);
    } if (uIntermediateColorSpace == COLOR_SPACE_DISPLAY_P3) {
      intermediateLinearRgb = applyBt2020ToP3Ootf(intermediateLinearRgb);
    } else {
      return ERROR_COLOR_GREEN;
    }
  } else {
    return ERROR_COLOR_RED;
  }
  if (uOutputColorSpace == COLOR_SPACE_BT2020) {
    if (uIntermediateColorSpace == COLOR_SPACE_BT709) {
      intermediateLinearRgb = applyBt709ToHlgBt2020Ootf(intermediateLinearRgb);
    } if (uIntermediateColorSpace == COLOR_SPACE_DISPLAY_P3) {
      intermediateLinearRgb = applyP3ToBt2020Ootf(intermediateLinearRgb);
    } else {
      return ERROR_COLOR_GREEN;
    }
  } else {
    return ERROR_COLOR_RED;
  }
  return intermediateLinearRgb;
}

void main() {
  vec3 opticalColor = texture(uTexSampler, vTexSamplingCoord).xyz;
  vec3 transformedColors = applyBt2020ToBt709Ootf(opticalColor);
  outColor = vec4(transformedColors.rgb, 1.0);
}
