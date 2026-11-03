#version 100

precision highp float;

const int GL_FALSE = 0;
const int GL_TRUE = 1;

uniform sampler2D uTexSampler;
varying highp vec2 vTexSamplingCoord;
// Homography matrix for transforming coordinates.
uniform highp mat4 uHomographyTransformationMatrix;

// Uniform to whether the edge needs a blur effect.
uniform int uEnableEdgeBlur;
// Amount of blur to apply (controls both radius and weight).
uniform float uEdgeBlurAmount ;
// Uniform variable for texel size in both x and y directions.
uniform vec2 uEdgeTexelSize;

highp vec3 applyHorizontalBlur(highp vec2 clampedCoords, highp vec2 texelSize, float blurAmount) {
    highp vec3 color = vec3(0.0);
    float totalWeight = 0.0;
    int blurRadius = int(blurAmount);

    for (int dx = -blurRadius; dx <= blurRadius; ++dx) {
        float weight = exp(-float(dx * dx) / (2.0 * blurAmount * blurAmount));
        color += texture2D(uTexSampler, clampedCoords + vec2(float(dx) * texelSize.x, 0.0)).rgb * weight;
        totalWeight += weight;
    }

    return color / (totalWeight + 0.0001);
}

highp vec3 applyVerticalBlur(highp vec2 clampedCoords, highp vec2 texelSize, float blurAmount) {
    highp vec3 color = vec3(0.0);
    float totalWeight = 0.0;
    int blurRadius = int(blurAmount);

    for (int dy = -blurRadius; dy <= blurRadius; ++dy) {
        float weight = exp(-float(dy * dy) / (2.0 * blurAmount * blurAmount));
        color += texture2D(uTexSampler, clampedCoords + vec2(0.0, float(dy) * texelSize.y)).rgb * weight;
        totalWeight += weight;
    }

    return color / (totalWeight + 0.0001);
}

void main() {
    // Setup homogeneous coordinate -> clip space coordinate.
    highp vec4 frameCoordinate = vec4(vTexSamplingCoord.xy, 0.0, 1.0);
    highp vec4 trans = uHomographyTransformationMatrix * frameCoordinate;

    // Perform perspective correction.
    highp vec2 correctionCoords = trans.xy / trans.w;
    highp vec2 coords = vec2(correctionCoords.xy);

    // Sample the texture if we're mapping within the image, otherwise set color to black with blur.
    if (coords.x >= 0.0 && coords.x <= 1.0 && coords.y >= 0.0 && coords.y <= 1.0) {
        gl_FragColor = texture2D(uTexSampler, coords);
    } else if (uEnableEdgeBlur == GL_TRUE) {
        // Perform blur by averaging neighboring texels around clamped coordinates.
        highp vec2 clampedCoords = clamp(coords, 0.0, 1.0);

        // Initialize the blurred color.
        highp vec3 blurredColor = vec3(0.0);

        // Apply Gaussian blur to coordinates outside [0.0, 1.0]
        if (coords.y < 0.0 || coords.y > 1.0) {
            // Apply vertical blur first.
            highp vec3 intermediateColor  = applyVerticalBlur(clampedCoords, uEdgeTexelSize, uEdgeBlurAmount);
            // Then apply horizontal blur on the already blurred result.
            blurredColor = applyHorizontalBlur(clampedCoords, uEdgeTexelSize, uEdgeBlurAmount);
        } else if (coords.x < 0.0 || coords.x > 1.0) {
            // Apply horizontal blur first.
            highp vec3 intermediateColor = applyHorizontalBlur(clampedCoords, uEdgeTexelSize, uEdgeBlurAmount);
            // Then apply vertical blur on the already blurred result.
            blurredColor = applyVerticalBlur(clampedCoords, uEdgeTexelSize, uEdgeBlurAmount);
        }
        // Output the final blurred color.
        gl_FragColor = vec4(blurredColor, 1.0);
    } else {
        // Output red as an obviously visible debug.
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}