import type { PanchayatLocation, ForecastDay, HourlyForecast, CropAdvisory, LiveAlert, MLModelMetrics } from '../types';

export const PANCHAYAT_LOCATIONS: PanchayatLocation[] = [
  {
    id: 'tamhini-mulshi-pune',
    name: 'Tamhini Ghat Gram Panchayat',
    name_hi: 'ताम्हिणी घाट ग्रामपंचायत',
    name_mr: 'ताम्हिणी घाट ग्रामपंचायत',
    name_ta: 'தம்ஹினி கிராம பஞ்சாயத்து',
    block: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.4902,
    lng: 73.4218,
    elevation: 685,
    slope: 14.2,
    soilType: 'Lateritic Red Clay (Udic Alfisol)',
    ndvi: 0.78,
    landUse: 'Terraced Paddy & Agro-Forestry (KVK-Pune Zone IV)',
    nearestAwsDistanceKm: 2.1,
    awsStationName: 'IMD-AWS-TAMHINI (Station ID: 43014)'
  },
  {
    id: 'paud-mulshi-pune',
    name: 'Paud Central Gram Panchayat',
    name_hi: 'पौड मध्य ग्रामपंचायत',
    name_mr: 'पौड मध्य ग्रामपंचायत',
    name_ta: 'பௌத் மத்திய பஞ்சாயத்து',
    block: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.5273,
    lng: 73.6124,
    elevation: 545,
    slope: 3.8,
    soilType: 'Medium Deep Black Soil (Vertic Inceptisol)',
    ndvi: 0.62,
    landUse: 'Intensive Vegetables & Lowland Paddy',
    nearestAwsDistanceKm: 0.8,
    awsStationName: 'DAMU-MULSHI-HQ (Station ID: 43018)'
  },
  {
    id: 'male-mulshi-pune',
    name: 'Male Valley Gram Panchayat',
    name_hi: 'माले घाटी ग्रामपंचायत',
    name_mr: 'माले व्हॅली ग्रामपंचायत',
    name_ta: 'மாலே பள்ளத்தாக்கு ஊராட்சி',
    block: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.5721,
    lng: 73.4981,
    elevation: 590,
    slope: 8.5,
    soilType: 'Coarse Sandy Loam',
    ndvi: 0.71,
    landUse: 'Paddy, Floriculture & Millets',
    nearestAwsDistanceKm: 3.4,
    awsStationName: 'C-DAC-MULSHI-02 (Station ID: 43022)'
  },
  {
    id: 'pimpalgaon-niphad-nashik',
    name: 'Pimpalgaon Baswant',
    name_hi: 'पिंपलगांव बसवंत',
    name_mr: 'पिंपळगाव बसवंत ग्रामपंचायत',
    name_ta: 'பிம்பல்கான் பஸ்வந்த்',
    block: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 20.1702,
    lng: 73.9851,
    elevation: 572,
    slope: 2.1,
    soilType: 'Deep Black Cotton Soil (Chromic Vertisol)',
    ndvi: 0.84,
    landUse: 'Export Table Grapes & Rabi Onion Belt',
    nearestAwsDistanceKm: 1.2,
    awsStationName: 'KVK-NIPHAD-AWS (Station ID: 43105)'
  },
  {
    id: 'jahangirpur-badnagar-ujjain',
    name: 'Jahangirpur Gram Panchayat',
    name_hi: 'जहांगीरपुर ग्राम पंचायत',
    name_mr: 'जहांगीरपूर ग्रामपंचायत',
    name_ta: 'ஜஹாங்கீர்பூர் கிராம ஊராட்சி',
    block: 'Badnagar',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    lat: 23.0142,
    lng: 75.3812,
    elevation: 498,
    slope: 1.2,
    soilType: 'Malwa Medium Black Vertisol',
    ndvi: 0.69,
    landUse: 'Soybean (JS-9560) & Sharbati Wheat Rotation',
    nearestAwsDistanceKm: 4.1,
    awsStationName: 'RVSKVV-BADNAGAR (Station ID: 42680)'
  },
  {
    id: 'sidhwan-bet-jagraon-ludhiana',
    name: 'Sidhwan Bet Gram Panchayat',
    name_hi: 'सिद्धवां बेट ग्राम पंचायत',
    name_mr: 'सिद्धवान बेट ग्रामपंचायत',
    name_ta: 'சித்வான் பெட் கிராம ஊராட்சி',
    block: 'Jagraon',
    district: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9321,
    lng: 75.5218,
    elevation: 234,
    slope: 0.6,
    soilType: 'Indo-Gangetic Silt Loam (Typic Ustochrept)',
    ndvi: 0.91,
    landUse: 'PUSA Basmati 1121 & HD-3086 Wheat',
    nearestAwsDistanceKm: 1.9,
    awsStationName: 'PAU-AGMET-JAGRAON (Station ID: 42095)'
  },
  {
    id: 'darasuram-kumbakonam-thanjavur',
    name: 'Darasuram Delta Gram Panchayat',
    name_hi: 'दारासुरम डेल्टा ग्राम पंचायत',
    name_mr: 'दारासुरम डेल्टा ग्रामपंचायत',
    name_ta: 'தாராசுரம் டெல்டா கிராம ஊராட்சி',
    block: 'Kumbakonam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lat: 10.9582,
    lng: 79.3564,
    elevation: 28,
    slope: 0.4,
    soilType: 'Cauvery Alluvial Clay (Fluventic Haplustept)',
    ndvi: 0.88,
    landUse: 'Kuruvai / Thaladi Double-Cropping Paddy Basin',
    nearestAwsDistanceKm: 1.5,
    awsStationName: 'TNAU-TRRI-ADUTHURAI (Station ID: 43320)'
  }
];

export const MOCK_FORECAST_DAYS: Record<string, ForecastDay[]> = {
  'tamhini-mulshi-pune': [
    {
      date: '2026-09-29',
      dayName: 'Today (Tuesday)',
      blockForecast: {
        tempMax: 32.0,
        tempMin: 22.5,
        tempConfidenceMin: 29.8,
        tempConfidenceMax: 34.2,
        rainfallMm: 15.0,
        rainProbability: 65,
        humidity: 78,
        windSpeedKmH: 14,
        windDirection: 'WSW',
        solarRadiationWm2: 520,
        soilMoisturePercent: 68,
        condition: 'Scattered Showers'
      },
      panchayatForecast: {
        tempMax: 27.3,
        tempMin: 20.1,
        tempConfidenceMin: 26.1,
        tempConfidenceMax: 28.5,
        rainfallMm: 38.5,
        rainProbability: 92,
        humidity: 94,
        windSpeedKmH: 26,
        windDirection: 'SW',
        solarRadiationWm2: 340,
        soilMoisturePercent: 89,
        condition: 'Heavy Rain'
      },
      downscalingDelta: {
        tempDiff: -4.7,
        rainDiff: +23.5,
        reason: 'Orographic ascent on Western Ghats ridgeline (Elevation 685m vs Taluka HQ 545m) causing strong windward condensation.'
      }
    },
    {
      date: '2026-09-30',
      dayName: 'Wednesday',
      blockForecast: {
        tempMax: 31.5,
        tempMin: 23.0,
        tempConfidenceMin: 29.0,
        tempConfidenceMax: 33.5,
        rainfallMm: 12.0,
        rainProbability: 60,
        humidity: 75,
        windSpeedKmH: 12,
        windDirection: 'W',
        solarRadiationWm2: 580,
        soilMoisturePercent: 65,
        condition: 'Scattered Showers'
      },
      panchayatForecast: {
        tempMax: 26.8,
        tempMin: 19.8,
        tempConfidenceMin: 25.4,
        tempConfidenceMax: 28.0,
        rainfallMm: 45.0,
        rainProbability: 95,
        humidity: 96,
        windSpeedKmH: 29,
        windDirection: 'SW',
        solarRadiationWm2: 290,
        soilMoisturePercent: 94,
        condition: 'Heavy Rain'
      },
      downscalingDelta: {
        tempDiff: -4.7,
        rainDiff: +33.0,
        reason: 'Dense cloud canopy & moisture trapping in Western windward ghat corridor.'
      }
    },
    {
      date: '2026-10-01',
      dayName: 'Thursday',
      blockForecast: {
        tempMax: 33.0,
        tempMin: 22.0,
        tempConfidenceMin: 30.5,
        tempConfidenceMax: 35.0,
        rainfallMm: 6.0,
        rainProbability: 40,
        humidity: 70,
        windSpeedKmH: 10,
        windDirection: 'NW',
        solarRadiationWm2: 640,
        soilMoisturePercent: 60,
        condition: 'Partly Cloudy'
      },
      panchayatForecast: {
        tempMax: 28.5,
        tempMin: 19.2,
        tempConfidenceMin: 27.2,
        tempConfidenceMax: 29.8,
        rainfallMm: 18.0,
        rainProbability: 75,
        humidity: 88,
        windSpeedKmH: 18,
        windDirection: 'WSW',
        solarRadiationWm2: 450,
        soilMoisturePercent: 82,
        condition: 'Scattered Showers'
      },
      downscalingDelta: {
        tempDiff: -4.5,
        rainDiff: +12.0,
        reason: 'Valley thermal lag and persistent micro-cloud band along river catchment.'
      }
    },
    {
      date: '2026-10-02',
      dayName: 'Friday',
      blockForecast: {
        tempMax: 33.5,
        tempMin: 21.5,
        tempConfidenceMin: 31.0,
        tempConfidenceMax: 35.8,
        rainfallMm: 2.0,
        rainProbability: 25,
        humidity: 64,
        windSpeedKmH: 9,
        windDirection: 'N',
        solarRadiationWm2: 710,
        soilMoisturePercent: 54,
        condition: 'Sunny'
      },
      panchayatForecast: {
        tempMax: 29.8,
        tempMin: 18.5,
        tempConfidenceMin: 28.3,
        tempConfidenceMax: 31.0,
        rainfallMm: 6.5,
        rainProbability: 45,
        humidity: 76,
        windSpeedKmH: 14,
        windDirection: 'NW',
        solarRadiationWm2: 590,
        soilMoisturePercent: 71,
        condition: 'Partly Cloudy'
      },
      downscalingDelta: {
        tempDiff: -3.7,
        rainDiff: +4.5,
        reason: 'Higher elevation lapse rate gives cooler nights & early morning mist.'
      }
    },
    {
      date: '2026-10-03',
      dayName: 'Saturday',
      blockForecast: {
        tempMax: 34.0,
        tempMin: 21.0,
        tempConfidenceMin: 31.8,
        tempConfidenceMax: 36.2,
        rainfallMm: 0.0,
        rainProbability: 10,
        humidity: 58,
        windSpeedKmH: 8,
        windDirection: 'NE',
        solarRadiationWm2: 760,
        soilMoisturePercent: 48,
        condition: 'Sunny'
      },
      panchayatForecast: {
        tempMax: 30.5,
        tempMin: 18.0,
        tempConfidenceMin: 29.0,
        tempConfidenceMax: 31.8,
        rainfallMm: 1.0,
        rainProbability: 20,
        humidity: 68,
        windSpeedKmH: 11,
        windDirection: 'NW',
        solarRadiationWm2: 670,
        soilMoisturePercent: 63,
        condition: 'Sunny'
      },
      downscalingDelta: {
        tempDiff: -3.5,
        rainDiff: +1.0,
        reason: 'Optimal solar radiation window for field drying & post-harvest preparation.'
      }
    }
  ]
};

export const MOCK_HOURLY_FORECAST: HourlyForecast[] = [
  { time: '06:00', panchayatTemp: 20.1, blockTemp: 23.2, panchayatRain: 4.2, blockRain: 1.1, humidity: 98, confidenceLower: 19.2, confidenceUpper: 21.0 },
  { time: '08:00', panchayatTemp: 21.8, blockTemp: 25.5, panchayatRain: 8.5, blockRain: 2.3, humidity: 95, confidenceLower: 20.9, confidenceUpper: 22.8 },
  { time: '10:00', panchayatTemp: 23.9, blockTemp: 28.4, panchayatRain: 12.0, blockRain: 4.5, humidity: 92, confidenceLower: 22.8, confidenceUpper: 24.9 },
  { time: '12:00', panchayatTemp: 26.5, blockTemp: 31.2, panchayatRain: 6.4, blockRain: 2.8, humidity: 88, confidenceLower: 25.2, confidenceUpper: 27.6 },
  { time: '14:00', panchayatTemp: 27.3, blockTemp: 32.0, panchayatRain: 3.1, blockRain: 1.5, humidity: 84, confidenceLower: 26.1, confidenceUpper: 28.5 },
  { time: '16:00', panchayatTemp: 25.8, blockTemp: 30.1, panchayatRain: 2.2, blockRain: 1.0, humidity: 89, confidenceLower: 24.8, confidenceUpper: 26.9 },
  { time: '18:00', panchayatTemp: 23.4, blockTemp: 27.5, panchayatRain: 1.2, blockRain: 0.8, humidity: 93, confidenceLower: 22.5, confidenceUpper: 24.4 },
  { time: '20:00', panchayatTemp: 21.6, blockTemp: 25.1, panchayatRain: 0.6, blockRain: 0.5, humidity: 96, confidenceLower: 20.7, confidenceUpper: 22.4 },
  { time: '22:00', panchayatTemp: 20.5, blockTemp: 23.8, panchayatRain: 0.3, blockRain: 0.3, humidity: 98, confidenceLower: 19.8, confidenceUpper: 21.3 }
];

export const MOCK_CROP_ADVISORIES: CropAdvisory[] = [
  {
    id: 'adv-rice-tamhini-1',
    crop: 'Rice (Paddy)',
    stage: 'Flowering & Tillering',
    severity: 'critical',
    title: {
      en: 'Agromet Alert: Excessive Precipitation During Anthesis — Drain Field Outlets',
      hi: 'कृषि-मौसम चेतावनी: फूल आने की अवस्था में अत्यधिक वर्षा — खेत से जल निकासी करें',
      mr: 'कृषी-हवामान इशारा: फुलोरा अवस्थेत अतिवृष्टी — शेतातून पाण्याचा तत्काळ निचरा करा',
      ta: 'வேளாண் எச்சரிக்கை: பூக்கும் பருவத்தில் கனமழை — வயலில் வடிகால் வசதி செய்க'
    },
    message: {
      en: 'Downscaled micro-forecast indicates 38.5 mm rainfall in Tamhini Panchayat catchment today (vs 15.0 mm Block average). Flowering paddy is vulnerable to spikelet sterility from pollen wash. Immediately clear field bund outlets, maintain standing water below 5 cm, and suspend all top-dressing of Urea and foliar sprays until clear weather resumes on Oct 2nd.',
      hi: 'ताम्हिणी पंचायत क्षेत्र में आज 38.5 मिमी वर्षा का पूर्वानुमान है (तालुका औसत 15 मिमी की तुलना में)। परागकण धुलने से फसल सुरक्षा हेतु मेड़ के निकास द्वार खोलकर पानी 3-5 सेमी पर रखें। यूरिया व कीटनाशक छिड़काव 2 अक्टूबर तक स्थगित रखें।',
      mr: 'ताम्हिणी ग्रामपंचायत क्षेत्रात आज ३८.५ मिमी पावसाचा अंदाज आहे (तालुका सरासरी १५ मिमी). फुलोऱ्यातील भाताचे परागकण धुतले जावू नयेत म्हणून शेतातील जादा पाणी बाहेर काढावे. युरिया व कीटकनाशक फवारणी २ ऑक्टोबरपर्यंत पुढे ढकलावी.',
      ta: 'தம்ஹினி ஊராட்சியில் இன்று 38.5 மிமீ கனமழை எதிர்பார்க்கப்படுகிறது. மகரந்தச் சேர்க்கை பாதிக்கப்படாமல் இருக்க வயலில் தேங்கும் நீரை உடனே வெளியேற்றவும். அக்டோபர் 2 வரை உரம் மற்றும் மருந்து தெளிப்பதை தள்ளிவைக்கவும்.'
    },
    audioDurationSec: 26,
    actionItems: [
      'Maintain standing water strictly between 3-5 cm by opening drainage trenches',
      'Postpone top-dressing of Urea and micro-nutrient sprays until Friday (Oct 2)',
      'Monitor for Bacterial Leaf Blight (BLB); prepare Copper Oxychloride 50% WP @ 2.5g/L for post-rain application'
    ],
    scientificRationale: 'Rainfall exceeding 25 mm during anthesis (09:30-11:30 hrs) induces up to 38% spikelet sterility in Swarna and Indrayani cultivars.',
    smsPreview: 'GKMS-DAMU Pune Alert: Heavy rain (38.5mm) in Tamhini today. Maintain 3-5cm water in paddy. Postpone urea spray. KVK Helpline: 1800-180-1551.',
    whatsAppPreview: {
      header: '🌾 District Agromet Unit (DAMU) | Tamhini Bulletin',
      body: '⚠️ *HIGH PRECIPITATION ADVISORY*\n\nTarget Crop: *Paddy (Flowering Stage)*\nExpected Rainfall: *38.5 mm (Micro-Grid Zone)*\n\n✅ *Field Operations Recommended:*\n1. Clear farm drainage ditches immediately.\n2. Do NOT apply Urea / Nitrogen today.\n3. Resume spraying on Friday morning during dry spell.',
      footer: 'Gramin Krishi Mausam Sewa (GKMS) • MoES / ICAR'
    },
    timestamp: 'Bulletin Issued: Today 06:30 IST'
  },
  {
    id: 'adv-soybean-badnagar-2',
    crop: 'Soybean',
    stage: 'Grain / Fruit Formation',
    severity: 'warning',
    title: {
      en: 'Foliar Blight Warning: High Canopy Humidity & Pod Borer Proliferation',
      hi: 'कवक रोग चेतावनी: अत्यधिक आर्द्रता और फली छेदक कीट का संक्रमण',
      mr: 'बुरशीजन्य रोग इशारा: जास्त आर्द्रता व शेंगा पोखरणारी अळी',
      ta: 'பூஞ்சை நோய் எச்சரிக்கை: அதிக ஈரப்பதம் மற்றும் காய்ப்புழு தாக்கம்'
    },
    message: {
      en: 'Relative humidity exceeding 92% combined with 27°C micro-temperature creates optimal conditions for Anthracnose (Colletotrichum truncatum) and Pod Blight. Spray Tebuconazole 25.9% EC @ 1.5 ml/L of water during clear morning hours.',
      hi: '९२% से अधिक सापेक्ष आर्द्रता और २७ डिग्री तापमान से फली झुलसा व एन्थ्रेक्नोज रोग का अनुकूल वातावरण बन रहा है। सुबह के समय टेबुकोनाज़ोल २५.९% ईसी (१.५ मिली/लीटर) का छिड़काव करें।',
      mr: '९२% पेक्षा जास्त आर्द्रता असल्याने शेंगा करपा रोगाचा प्रादुर्भाव वाढू शकतो. सकाळच्या मोकळ्या वेळेत टेबुकोनाझोल २५.९% ईसी (१.५ मिली/लिटर) फवारणी करावी.',
      ta: '92% க்கும் அதிகமான ஈரப்பதம் உள்ளதால் காய் கருகல் மற்றும் காய்ப்புழு பரவ வாய்ப்புள்ளது. காலை வேளையில் டெபுகோனசோல் மருந்து தெளிக்கவும்.'
    },
    audioDurationSec: 22,
    actionItems: [
      'Apply Tebuconazole 25.9% EC @ 1.5 ml/L or Trifloxystrobin + Tebuconazole @ 0.7g/L',
      'Install 4 pheromone traps per acre for Spodoptera litura monitoring',
      'Ensure aeration in dense crop canopy by trimming weed growth'
    ],
    scientificRationale: 'Prolonged leaf wetness duration (>8 hours) at 24-28°C accelerates Colletotrichum truncatum sporulation.',
    smsPreview: 'KVK Badnagar: RH >92% alert in Badnagar. Spray Tebuconazole @ 1.5ml/L for soybean pod protection. Agromet Advisory.',
    whatsAppPreview: {
      header: '🌱 Agromet Advisory Bulletin | Badnagar',
      body: '⚠️ *WARNING: Soybean Pod Protection*\n\nRelative Humidity: *92%* | Temp: *27.3°C*\n\n✅ *Recommended Action:*\nApply preventive fungicide before evening dew to protect grain development.',
      footer: 'ICAR-IISR Agromet Network'
    },
    timestamp: 'Bulletin Issued: Today 07:00 IST'
  },
  {
    id: 'adv-grapes-niphad-3',
    crop: 'Grapes',
    stage: 'Vegetative Growth',
    severity: 'safe',
    title: {
      en: 'Favorable Spray Window: Foundation Pruning & Micronutrient Application',
      hi: 'अनुकूल छिड़काव अवधि: द्राक्ष छंटाई एवं सूक्ष्म पोषक तत्व प्रबंधन',
      mr: 'द्राक्ष छाटणी व सूक्ष्म अन्नद्रव्य फवारणीसाठी अत्यंत अनुकूल ४८ तास',
      ta: 'திராட்சை கவாத்து மற்றும் நுண்ணூட்ட உரம் தெளிக்க உகந்த 48 மணிநேரம்'
    },
    message: {
      en: 'Micro-climate indicators show zero rainfall probability, wind velocity below 8 km/h, and dry canopy conditions for the next 48 hours in Pimpalgaon belt. Ideal window for foundation pruning and foliar application of Chelated Zinc and Boron.',
      hi: 'पिंपलगांव क्षेत्र में अगले ४८ घंटों में वर्षा की संभावना शून्य है और हवा ८ किमी/घंटे से कम रहेगी। द्राक्ष की कटाई-छंटाई और जिंक-बोरॉन छिड़काव के लिए अत्यंत उपयुक्त समय है।',
      mr: 'पिंपळगाव परिसरात पुढील दोन दिवस कोरडे हवामान व शांत वारे राहणार असल्याने द्राक्ष बागेची छाटणी व सूक्ष्म अन्नद्रव्य फवारणी नियोजनानुसार पूर्ण करावी.',
      ta: 'அடுத்த 48 மணி நேரத்திற்கு மழை இல்லை மற்றும் சீரான காற்று இருக்கும். திராட்சை கவாத்து மற்றும் நுண்ணூட்ட உரம் இட சிறந்த நேரம்.'
    },
    audioDurationSec: 20,
    actionItems: [
      'Execute foundation cane pruning and dress cuts with Copper paste (10%)',
      'Foliar spray of Chelated Zinc (0.5g/L) + Boron (1g/L) during early morning',
      'Regulate drip irrigation at 16-18 Litres/vine/day based on soil tensiometer readings'
    ],
    scientificRationale: 'Atmospheric Vapor Pressure Deficit (VPD 0.9-1.2 kPa) ensures optimal wound healing and stomatal absorption of foliar micronutrients.',
    smsPreview: 'NRC Grapes Advisory: Clear skies in Niphad next 48h. Safe window for grape foundation pruning & Zinc foliar spray.',
    whatsAppPreview: {
      header: '🍇 ICAR-NRCG Agromet Advisory | Niphad',
      body: '🟢 *OPTIMAL SPRAY WINDOW CONFIRMED*\n\nRain: *0.0 mm* | Wind: *7 km/h*\n\n✅ *Action:* Complete foundation pruning and micronutrient spray without wash-off risk.',
      footer: 'ICAR National Research Centre for Grapes'
    },
    timestamp: 'Bulletin Issued: Yesterday 17:00 IST'
  },
  {
    id: 'adv-cotton-4',
    crop: 'Cotton',
    stage: 'Flowering & Tillering',
    severity: 'warning',
    title: {
      en: 'Spray Drift Hazard: High Afternoon Wind Gusts Exceeding 25 km/h',
      hi: 'कीटनाशक बहाव चेतावनी: दोपहर में २५ किमी/घंटे से अधिक तेज हवाएं',
      mr: 'फवारणी इशारा: दुपारच्या जोरदार वाऱ्यामुळे औषध वाया जाण्याचा धोका',
      ta: 'பருத்தி மருந்து தெளிப்பு எச்சரிக்கை: மதிய நேர பலத்த காற்று'
    },
    message: {
      en: 'Surface wind velocity will accelerate to 26 km/h between 12:30 PM - 04:30 PM, causing severe droplet drift and pesticide wastage. Shift insecticide application strictly to morning hours (06:00 AM - 09:00 AM).',
      hi: 'दोपहर १२:३० से ४:३० के बीच हवा की गति २६ किमी/घंटे रहने से कीटनाशक हवा में बहेगा। कीटनाशक छिड़काव केवल सुबह ६:०० से ९:०० के मध्य ही करें।',
      mr: 'दुपारी १२:३० ते ४:३० दरम्यान २६ किमी/तास वेगाने वारे वाहणार असल्याने औषध उडून जाईल. फवारणी सकाळी ६:०० ते ९:०० या वेळेतच करावी.',
      ta: 'மதியம் பலத்த காற்று வீசும் என்பதால் மருந்து தெளிப்பதை காலை 6:00 முதல் 9:00 மணிக்குள் முடிக்கவும்.'
    },
    audioDurationSec: 19,
    actionItems: [
      'Schedule insecticide application strictly between 06:00 AM and 09:00 AM',
      'Deploy hollow cone drift-reduction nozzles with operating pressure <2.5 bar',
      'Inspect for Pink Bollworm rosette flowers across 20 random plants/acre'
    ],
    scientificRationale: 'Cross-wind velocities >12 km/h increase droplet displacement by >60%, reducing target canopy deposition efficiency.',
    smsPreview: 'DAMU Alert: Afternoon gusts (26 km/h) in cotton belt. Conduct pesticide sprays strictly during 6-9 AM.',
    whatsAppPreview: {
      header: '🌿 CICR Agromet Advisory | Cotton Alert',
      body: '⚠️ *SPRAY DRIFT WARNING*\n\nAfternoon Wind: *26 km/h*\n\n✅ *Operation:* Reschedule spraying to 06:00 - 09:00 AM for target pest control.',
      footer: 'ICAR-CICR Cotton Advisory System'
    },
    timestamp: 'Bulletin Issued: Today 06:00 IST'
  }
];

export const MOCK_LIVE_ALERTS: LiveAlert[] = [
  {
    id: 'alert-1',
    type: 'Heavy Rainfall',
    severity: 'critical',
    title: 'High Precipitation & Orographic Runoff (Tamhini Ridge)',
    description: 'WRF-Downscaling model predicts +38.5 mm localized heavy shower in the next 6-12 hours.',
    impactArea: 'Tamhini, Male, Kolvan Catchment',
    timeframe: 'Next 6 - 12 Hours',
    affectedCrops: ['Rice (Paddy)', 'Vegetables', 'Floriculture']
  },
  {
    id: 'alert-2',
    type: 'Optimal Spray Window',
    severity: 'safe',
    title: 'Favorable Spray & Pruning Window Active',
    description: 'Wind <8 km/h, 0% rain probability, relative humidity 64% in Niphad Grape Belt.',
    impactArea: 'Pimpalgaon, Dindori, Niphad Rural',
    timeframe: 'Today 06:00 AM - Tomorrow 05:00 PM',
    affectedCrops: ['Grapes', 'Onion', 'Pomegranate']
  },
  {
    id: 'alert-3',
    type: 'Pest Outbreak Risk',
    severity: 'warning',
    title: 'Fungal Spore Proliferation Index Elevated',
    description: 'Continuous leaf wetness (>90% RH for 12+ hrs) indicates Downy Mildew / Anthracnose risk.',
    impactArea: 'Badnagar, Ujjain Rural Block',
    timeframe: 'Valid through Oct 1',
    affectedCrops: ['Soybean', 'Cotton']
  }
];

export const MOCK_MODEL_METRICS: MLModelMetrics = {
  rfWeight: 0.35,
  xgbWeight: 0.45,
  cnnWeight: 0.20,
  overallR2: 0.942,
  tempRmse: 1.48, // °C (vs 4.5°C IMD block error)
  rainMae: 4.82,  // mm (vs 18.0mm IMD block error)
  skillScorePercent: 48.6,
  brierScore: 0.114,
  inferenceLatencyMs: 24.8,
  lastUpdated: 'Station Sync: 12 seconds ago (AWS Net)'
};

export const UI_TRANSLATIONS = {
  en: {
    appTitle: 'KrishiNetra',
    tagline: 'National Agro-Meteorological & Precision Weather Portal',
    subtitle: 'Gram Panchayat Micro-Grid Forecast System (1 km Resolution)',
    liveMlEngine: 'WRF-ML Downscaling System Active',
    latency: 'Telemetry Sync < 30ms',
    searchPlaceholder: 'Search State, District, Block, Gram Panchayat...',
    overviewTab: 'Agromet Dashboard',
    geoMapTab: 'Interactive Micro-Climate Map',
    forecastTab: '5-Day Gramin Forecast',
    advisoryTab: 'Crop Advisory Bulletins',
    modelArchTab: 'Downscaling Architecture & Science',
    impactTab: 'National Impact & Coverage',
    statsResolution: '1 km² Grid',
    statsResolutionSub: 'Panchayat Micro-Climate',
    statsRainReduction: '72% Rain Error Drop',
    statsRainReductionSub: 'From ±18mm to ±5mm',
    statsTempReduction: '67% Temp Error Drop',
    statsTempReductionSub: 'From ±4.5°C to ±1.5°C',
    statsCoverage: '12.7 Cr Beneficiaries',
    statsCoverageSub: 'Small & Marginal Farmers',
    currentAdvisoryLevel: 'Advisory Status',
    orangeAlert: 'Moderate Risk Advisory',
    redAlert: 'Severe Action Required',
    greenAlert: 'Optimal Conditions',
    elevation: 'Elevation (MSL)',
    soilType: 'Soil Classification',
    slope: 'Terrain Slope Angle',
    ndvi: 'Vegetation Index (NDVI)',
    landUse: 'Land Use (ISRO LULC)',
    awsDistance: 'Nearest IMD-AWS Distance',
    blockVsPanchayat: 'Taluka vs Gram Panchayat Micro-Climate Variation',
    blockLabel: 'IMD Taluka Block Avg (25 km)',
    panchayatLabel: 'Gram Panchayat Grid (1 km)',
    audioListen: 'Listen Audio Advisory',
    audioPlaying: 'Playing Voice Advisory...',
    testSms: 'Test SMS (MSG91)',
    testWhatsApp: 'Test WhatsApp Alert',
    confidenceBand: '90% Statistical Confidence Interval',
    modelWeights: 'Model Ensemble Weights (Ridge Stacking)',
    researchPaper: 'Meteorological Foundations & Citations',
    governmentAlignment: 'National Mission Alignments'
  },
  hi: {
    appTitle: 'कृषि-नेत्र',
    tagline: 'राष्ट्रीय कृषि-मौसम एवं सटीक मौसम परामर्श पोर्टल',
    subtitle: 'ग्राम पंचायत सूक्ष्म ग्रिड पूर्वानुमान प्रणाली (१ किमी सटीकता)',
    liveMlEngine: 'डब्ल्यूआरएफ-एमएल डाउनस्केलिंग प्रणाली सक्रिय',
    latency: 'टेलीमेट्री सिंक < ३० ms',
    searchPlaceholder: 'राज्य, जिला, ब्लॉक, ग्राम पंचायत खोजें...',
    overviewTab: 'कृषि-मौसम डॅशबोर्ड',
    geoMapTab: 'सूक्ष्म जलवायु मानचित्र',
    forecastTab: '५-दिवसीय ग्रामीण पूर्वानुमान',
    advisoryTab: 'फसल परामर्श बुलेटिन',
    modelArchTab: 'डाउनस्केलिंग प्रणाली एवं विज्ञान',
    impactTab: 'राष्ट्रीय प्रभाव एवं कवरेज',
    statsResolution: '१ किमी² ग्रिड',
    statsResolutionSub: 'पंचायत सूक्ष्म जलवायु',
    statsRainReduction: '७२% वर्षा त्रुटि में कमी',
    statsRainReductionSub: '±१८ मिमी से घटकर ±५ मिमी',
    statsTempReduction: '६७% तापमान त्रुटि में कमी',
    statsTempReductionSub: '±४.५°C से घटकर ±१.५°C',
    statsCoverage: '१२.७ करोड़ लाभार्थी',
    statsCoverageSub: 'छोटे एवं सीमांत किसान',
    currentAdvisoryLevel: 'परामर्श स्थिति',
    orangeAlert: 'मध्यम जोखिम चेतावनी',
    redAlert: 'तत्काल कार्रवाई आवश्यक',
    greenAlert: 'अनुकूल स्थिति',
    elevation: 'समुद्र तल से ऊंचाई',
    soilType: 'मृदा वर्गीकरण',
    slope: 'ढलान कोण',
    ndvi: 'वनस्पति सूचकांक (NDVI)',
    landUse: 'भूमि उपयोग (इसरो भुवन)',
    awsDistance: 'निकटतम मौसम स्टेशन दूरी',
    blockVsPanchayat: 'तालुका बनाम ग्राम पंचायत सूक्ष्म जलवायु अंतर',
    blockLabel: 'आईएमडी तालुका औसत (२५ किमी)',
    panchayatLabel: 'ग्राम पंचायत ग्रिड (१ किमी)',
    audioListen: 'ऑडियो परामर्श सुनें',
    audioPlaying: 'ऑडियो चल रहा है...',
    testSms: 'एसएमएस टेस्ट (MSG91)',
    testWhatsApp: 'व्हाट्सएप टेस्ट',
    confidenceBand: '९०% सांख्यिकीय विश्वास अंतराल',
    modelWeights: 'एन्सेम्बल भार (रिज स्टैकिंग)',
    researchPaper: 'मौसम विज्ञान अनुसंधान एवं संदर्भ',
    governmentAlignment: 'राष्ट्रीय मिशन संरेखण'
  },
  mr: {
    appTitle: 'कृषी-नेत्र',
    tagline: 'राष्ट्रीय कृषी-हवामान व सूक्ष्म अंदाज पोर्टल',
    subtitle: 'ग्रामपंचायत सूक्ष्म ग्रिड हवामान अंदाज प्रणाली (१ किमी अचूकता)',
    liveMlEngine: 'डब्ल्यूआरएफ-एमएल प्रणाली कार्यरत',
    latency: 'टेलिमेट्री प्रतिसाद < ३० ms',
    searchPlaceholder: 'राज्य, जिल्हा, तालुका, ग्रामपंचायत शोधा...',
    overviewTab: 'हवामान डॅशबोर्ड',
    geoMapTab: 'सूक्ष्म हवामान नकाशा',
    forecastTab: '५-दिवसीय ग्रामीण अंदाज',
    advisoryTab: 'पीक सल्लागार बुलेटिन',
    modelArchTab: 'डाऊनस्केलिंग आर्किटेक्चर',
    impactTab: 'राष्ट्रीय व्याप्ती व लाभ',
    statsResolution: '१ किमी² ग्रिड',
    statsResolutionSub: 'पंचायत पातळीवर',
    statsRainReduction: '७२% पाऊस त्रुटी घट',
    statsRainReductionSub: '±१८ मिमी वरून ±५ मिमी',
    statsTempReduction: '६७% तापमान त्रुटी घट',
    statsTempReductionSub: '±४.५°C वरून ±१.५°C',
    statsCoverage: '१२.७ कोटी शेतकरी',
    statsCoverageSub: 'लहान व अत्यल्प भूधारक',
    currentAdvisoryLevel: 'सल्ला पातळी',
    orangeAlert: 'सावधानता इशारा',
    redAlert: 'तातडीची कारवाई आवश्यक',
    greenAlert: 'अनुकूल परिस्थिती',
    elevation: 'समुद्र सपाटीपासून उंची',
    soilType: 'मातीचे वर्गीकरण',
    slope: 'उताराचे प्रमाण',
    ndvi: 'वनस्पती निर्देशांक (NDVI)',
    landUse: 'जमीन वापर (ISRO LULC)',
    awsDistance: 'हवामान केंद्राचे अंतर',
    blockVsPanchayat: 'तालुका वि. ग्रामपंचायत सूक्ष्म हवामान फरक',
    blockLabel: 'IMD तालुका सरासरी (२५ किमी)',
    panchayatLabel: 'ग्रामपंचायत ग्रिड (१ किमी)',
    audioListen: 'ऑडिओ सल्ला ऐका',
    audioPlaying: 'ऑडिओ वाजत आहे...',
    testSms: 'एसएमएस चाचणी',
    testWhatsApp: 'व्हॉट्सॲप चाचणी',
    confidenceBand: '९०% विश्वासार्हता मर्यादा',
    modelWeights: 'एन्सेम्बल मॉडेल वजन (रिज स्टॅकिंग)',
    researchPaper: 'संशोधन व संदर्भ',
    governmentAlignment: 'शासकीय योजना जोडणी'
  },
  ta: {
    appTitle: 'கிருஷிநேத்ரா',
    tagline: 'தேசிய வேளாண்-வானிலை & துல்லிய முன்னறிவிப்பு தளம்',
    subtitle: 'கிராம பஞ்சாயத்து மைக்ரோ-கிரிட் முன்னறிவிப்பு அமைப்பு (1 கி.மீ)',
    liveMlEngine: 'WRF-ML டவுன்ஸ்கேலிங் அமைப்பு செயலில்',
    latency: 'டெலிமெட்ரி தாமதம் < 30ms',
    searchPlaceholder: 'மாநிலம், மாவட்டம், ஊராட்சி தேடுக...',
    overviewTab: 'வேளாண் தகவல் பலகை',
    geoMapTab: 'ஊடாடும் மைக்ரோ-வரைபடம்',
    forecastTab: '5-நாள் முன்னறிவிப்பு',
    advisoryTab: 'பயிர் ஆலோசனை புல்லட்டின்',
    modelArchTab: 'கட்டமைப்பு & அறிவியல்',
    impactTab: 'தேசிய தாக்கம் & பயன்கள்',
    statsResolution: '1 கி.மீ² கிரிட்',
    statsResolutionSub: 'பஞ்சாயத்து அளவில்',
    statsRainReduction: '72% மழை பிழை குறைப்பு',
    statsRainReductionSub: '±18மிமீ முதல் ±5மிமீ வரை',
    statsTempReduction: '67% வெப்பநிலை பிழை குறைப்பு',
    statsTempReductionSub: '±4.5°C முதல் ±1.5°C வரை',
    statsCoverage: '12.7 கோடி பயனாளிகள்',
    statsCoverageSub: 'சிறு & குறு விவசாயிகள்',
    currentAdvisoryLevel: 'ஆலோசனை நிலை',
    orangeAlert: 'எச்சரிக்கை தேவை',
    redAlert: 'உடனடி நடவடிக்கை',
    greenAlert: 'பாதுகாப்பான சூழல்',
    elevation: 'உயரம் (MSL)',
    soilType: 'மண் வகைப்பாடு',
    slope: 'சரிவு கோணம்',
    ndvi: 'தாவர குறியீடு (NDVI)',
    landUse: 'நில பயன்பாடு (ISRO)',
    awsDistance: 'வானிலை மைய தொலைவு',
    blockVsPanchayat: 'வட்டாரம் vs பஞ்சாயத்து வேறுபாடு',
    blockLabel: 'IMD வட்டார சராசரி (25 கிமீ)',
    panchayatLabel: 'கிராம பஞ்சாயத்து (1 கிமீ)',
    audioListen: 'ஆடியோ ஆலோசனையை கேட்க',
    audioPlaying: 'ஒலிபரப்பாகிறது...',
    testSms: 'SMS மாதிரி',
    testWhatsApp: 'வாட்ஸ்அப் மாதிரி',
    confidenceBand: '90% நம்பகத்தன்மை இடைவெளி',
    modelWeights: 'மாடல் எடைகள்',
    researchPaper: 'வானிலை ஆராய்ச்சி குறிப்புகள்',
    governmentAlignment: 'தேசிய திட்டங்கள்'
  }
};
