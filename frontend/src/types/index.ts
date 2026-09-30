export type SeverityLevel = 'safe' | 'warning' | 'critical';

export interface PanchayatLocation {
  id: string;
  name: string;
  name_hi: string;
  name_mr: string;
  name_ta: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  elevation: number; // in meters
  slope: number; // in degrees
  soilType: string;
  ndvi: number; // 0 to 1
  landUse: string;
  nearestAwsDistanceKm: number;
  awsStationName: string;
}

export interface WeatherMetric {
  tempMax: number;
  tempMin: number;
  tempConfidenceMin: number;
  tempConfidenceMax: number;
  rainfallMm: number;
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  windDirection: string;
  solarRadiationWm2: number;
  soilMoisturePercent: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Heavy Rain' | 'Scattered Showers' | 'Thunderstorm' | 'Foggy';
}

export interface ForecastDay {
  date: string;
  dayName: string;
  blockForecast: WeatherMetric;
  panchayatForecast: WeatherMetric;
  downscalingDelta: {
    tempDiff: number;
    rainDiff: number;
    reason: string;
  };
}

export interface HourlyForecast {
  time: string;
  panchayatTemp: number;
  blockTemp: number;
  panchayatRain: number;
  blockRain: number;
  humidity: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export type CropType = 'Rice (Paddy)' | 'Wheat' | 'Cotton' | 'Soybean' | 'Grapes' | 'Sugarcane' | 'Onion' | 'Mustard';

export type GrowthStage = 'Sowing & Germination' | 'Vegetative Growth' | 'Flowering & Tillering' | 'Grain / Fruit Formation' | 'Maturity & Harvesting';

export interface CropAdvisory {
  id: string;
  crop: CropType;
  stage: GrowthStage;
  severity: SeverityLevel;
  title: Record<string, string>;
  message: Record<string, string>;
  audioDurationSec: number;
  actionItems: string[];
  scientificRationale: string;
  smsPreview: string;
  whatsAppPreview: {
    header: string;
    body: string;
    footer: string;
  };
  timestamp: string;
}

export interface LiveAlert {
  id: string;
  type: 'Heavy Rainfall' | 'High Wind Warning' | 'Optimal Spray Window' | 'Pest Outbreak Risk' | 'Heat Stress Alert';
  severity: SeverityLevel;
  title: string;
  description: string;
  impactArea: string;
  timeframe: string;
  affectedCrops: string[];
}

export interface MLModelMetrics {
  rfWeight: number;
  xgbWeight: number;
  cnnWeight: number;
  overallR2: number;
  tempRmse: number;
  rainMae: number;
  skillScorePercent: number;
  brierScore: number;
  inferenceLatencyMs: number;
  lastUpdated: string;
}
