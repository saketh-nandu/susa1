/**
 * Detects which SUSA features are used in the code
 * to determine which interpreter to use
 */

function detectFeatures(code) {
  const features = {
    hasStringInterpolation: false,
    hasTypeDeclarations: false,
    hasUsePython: false,
    hasUseC: false,
    hasAdvancedFeatures: false
  };

  // Check for string interpolation rt"..."
  if (/rt["']/.test(code)) {
    features.hasStringInterpolation = true;
    features.hasAdvancedFeatures = true;
  }

  // Check for type declarations (int, string, bool, float, etc.)
  if (/\b(int|string|bool|float|double|char)\s+\w+\s*=/.test(code)) {
    features.hasTypeDeclarations = true;
    features.hasAdvancedFeatures = true;
  }

  // Check for USE PYTHON: blocks
  if (/USE\s+PYTHON:/i.test(code)) {
    features.hasUsePython = true;
    features.hasAdvancedFeatures = true;
  }

  // Check for USE C: blocks
  if (/USE\s+C:/i.test(code)) {
    features.hasUseC = true;
    features.hasAdvancedFeatures = true;
  }

  return features;
}

function shouldUsePythonInterpreter(code) {
  const features = detectFeatures(code);
  return features.hasAdvancedFeatures;
}

function getRecommendedInterpreter(code) {
  const features = detectFeatures(code);
  
  if (features.hasAdvancedFeatures) {
    return {
      interpreter: 'python',
      reason: 'Code uses advanced features',
      features: features
    };
  }
  
  return {
    interpreter: 'cpp',
    reason: 'Simple code, using C++ for performance',
    features: features
  };
}

module.exports = {
  detectFeatures,
  shouldUsePythonInterpreter,
  getRecommendedInterpreter
};
