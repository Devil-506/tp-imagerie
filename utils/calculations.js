export const REFERENCE_RANGES = {
  dose: {
    tolerance: 0.05, // ±5%
    min: 0.95,
    max: 1.05
  },
  imageQuality: {
    min: 8.5,
    max: 10
  },
  uniformity: {
    min: 0.92,
    max: 1.0
  },
  noise: {
    min: 0,
    max: 0.08
  },
  resolution: {
    min: 2.8,
    max: 5.0
  },
  contrast: {
    min: 0.85,
    max: 1.0
  }
}

export const TEST_TYPES = {
  daily: {
    name: 'Daily QC',
    frequency: 'daily',
    required: ['dose', 'imageQuality', 'uniformity']
  },
  weekly: {
    name: 'Weekly QC',
    frequency: 'weekly',
    required: ['dose', 'imageQuality', 'uniformity', 'noise']
  },
  monthly: {
    name: 'Monthly QC',
    frequency: 'monthly',
    required: ['dose', 'imageQuality', 'uniformity', 'noise', 'resolution']
  },
  quarterly: {
    name: 'Quarterly QC',
    frequency: 'quarterly',
    required: ['dose', 'imageQuality', 'uniformity', 'noise', 'resolution', 'contrast']
  },
  annual: {
    name: 'Annual QC',
    frequency: 'annual',
    required: ['dose', 'imageQuality', 'uniformity', 'noise', 'resolution', 'contrast']
  }
}

export const calculateExpectedDose = (settings) => {
  const { kV, mA, exposureTime, distance } = settings;
  
  const baseDose = (kV * mA * exposureTime) / Math.pow(distance, 2);
  
  const filterFactors = {
    'Al': 1.0,
    'Cu': 0.8,
    'Al+Cu': 0.7,
    'None': 1.2
  };
  
  const filterFactor = filterFactors[settings.filter] || 1.0;
  
  const modeFactors = {
    'Standard': 1.0,
    'HighRes': 1.3,
    'LowDose': 0.7,
    'Pediatric': 0.5
  };
  
  const modeFactor = modeFactors[settings.mode] || 1.0;
  
  return (baseDose * filterFactor * modeFactor * 0.001).toFixed(3);
}

export const calculateQualityScore = (results) => {
  const weights = {
    imageQuality: 0.3,
    uniformity: 0.2,
    noise: 0.15,
    resolution: 0.2,
    contrast: 0.15
  };

  let score = 0;
  
  score += (results.imageQuality / 10) * weights.imageQuality;
  score += results.uniformity * weights.uniformity;
  score += (1 - (results.noise / REFERENCE_RANGES.noise.max)) * weights.noise;
  score += (results.resolution / 5) * weights.resolution;
  score += results.contrast * weights.contrast;

  return Math.min(score * 100, 100).toFixed(1);
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}