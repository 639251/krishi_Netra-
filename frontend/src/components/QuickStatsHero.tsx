import React from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Target, 
  Users, 
  AlertCircle,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import type { PanchayatLocation, ForecastDay } from '../types';

interface QuickStatsHeroProps {
  location: PanchayatLocation;
  currentForecast: ForecastDay;
  currentLang: 'en' | 'hi' | 'mr' | 'ta';
  onNavigateToMap: () => void;
  onNavigateToAdvisory: () => void;
}

export const QuickStatsHero: React.FC<QuickStatsHeroProps> = ({
  location,
  currentForecast,
  currentLang,
  onNavigateToMap,
  onNavigateToAdvisory
}) => {
  const p = currentForecast.panchayatForecast;
  const b = currentForecast.blockForecast;
  const delta = currentForecast.downscalingDelta;

  const getLocationDisplayName = () => {
    if (currentLang === 'hi') return location.name_hi;
    if (currentLang === 'mr') return location.name_mr;
    if (currentLang === 'ta') return location.name_ta;
    return location.name;
  };

  return (
    <div className="space-y-8">
      
      {/* WisprType Inspired Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Headline & Mission */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Pill Chip (Wispr style) */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EDF5EE] dark:bg-[#0F2E22] border border-[#CCE4D3] dark:border-[#1F4D3A] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse"></span>
            <span className="font-mono text-[11px]">NATIONAL AGROMET GRID • 1 KM GRAM PANCHAYAT PRECISION</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#131E18] dark:text-white leading-[1.12]">
              Hyper-Local Weather <span className="font-serif italic text-[#0C4A34] dark:text-[#34D399] font-medium">Intelligence</span> & Precision Farm Systems.
            </h1>
            <p className="text-base sm:text-lg text-[#4A5850] dark:text-[#9FB5A8] max-w-2xl font-normal leading-relaxed pt-1">
              Downscaling 25 km IMD Taluka models directly to <strong className="text-[#131E18] dark:text-white">{getLocationDisplayName()}</strong> ({location.elevation}m MSL). Real-time micro-climate telemetry, moisture tracking, and KVK crop action bulletins.
            </p>
          </div>

          {/* Micro-climate Live Delta Alert Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0F241C] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0C4A34] dark:text-[#34D399]">
                <AlertCircle className="w-4 h-4" />
                <span>Micro-Climate Deviation (Panchayat vs Taluka HQ)</span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#143326] text-[#0C4A34] dark:text-[#6EE7B7] border border-[#CCE4D3] dark:border-[#1F4D3A]">
                Δ +140m Elevation
              </span>
            </div>
            <p className="text-xs text-[#3E4D45] dark:text-[#D1E5D8] leading-relaxed">
              {delta.reason}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
              <div className="bg-[#FAF9EE] dark:bg-[#142F24] p-3 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] text-center">
                <span className="text-[10px] text-[#6E7B73] dark:text-[#8FA89B] block uppercase font-medium">Panchayat Rain</span>
                <span className="text-sm font-bold text-[#0C4A34] dark:text-[#6EE7B7]">{p.rainfallMm} mm</span>
                <span className="text-[10px] text-[#8A968E] block">Taluka: {b.rainfallMm}mm</span>
              </div>
              <div className="bg-[#FAF9EE] dark:bg-[#142F24] p-3 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] text-center">
                <span className="text-[10px] text-[#6E7B73] dark:text-[#8FA89B] block uppercase font-medium">Max Temp</span>
                <span className="text-sm font-bold text-[#131E18] dark:text-white">{p.tempMax}°C</span>
                <span className="text-[10px] text-[#8A968E] block">Taluka: {b.tempMax}°C</span>
              </div>
              <div className="bg-[#FAF9EE] dark:bg-[#142F24] p-3 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] text-center">
                <span className="text-[10px] text-[#6E7B73] dark:text-[#8FA89B] block uppercase font-medium">RH-I Humidity</span>
                <span className="text-sm font-bold text-[#131E18] dark:text-white">{p.humidity}%</span>
                <span className="text-[10px] text-[#8A968E] block">Soil: {p.soilMoisturePercent}%</span>
              </div>
              <div className="bg-[#FAF9EE] dark:bg-[#142F24] p-3 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] text-center">
                <span className="text-[10px] text-[#6E7B73] dark:text-[#8FA89B] block uppercase font-medium">Wind Speed</span>
                <span className="text-sm font-bold text-[#131E18] dark:text-white">{p.windSpeedKmH} km/h</span>
                <span className="text-[10px] text-[#8A968E] block">Dir: {p.windDirection}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              onClick={onNavigateToMap}
              className="px-7 py-3.5 rounded-full bg-[#0C4A34] hover:bg-[#073827] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <span>Explore 1 km Micro-Grid Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToAdvisory}
              className="px-6 py-3.5 rounded-full bg-white dark:bg-[#0F241C] hover:bg-[#F4F2E1] dark:hover:bg-[#142F24] text-[#131E18] dark:text-white font-semibold text-xs sm:text-sm border border-[#E6E9DC] dark:border-[#1B3B2E] shadow-sm flex items-center space-x-2 transition-all"
            >
              <span>Read Crop Action Bulletins</span>
            </button>
          </div>

        </div>

        {/* Right Side: Matrix Executive Card */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F241C] border border-[#E6E9DC] dark:border-[#1B3B2E] shadow-lg space-y-5">
            
            {/* Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E6E9DC] dark:border-[#1B3B2E]">
              <div className="w-10 h-10 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] border border-[#CCE4D3] dark:border-[#1F4D3A] flex items-center justify-center text-[#0C4A34] dark:text-[#6EE7B7]">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#131E18] dark:text-white">
                  KrishiNetra Station Telemetry
                </h3>
                <p className="text-xs text-[#55635B] dark:text-[#8FA89B]">
                  {location.awsStationName}
                </p>
              </div>
            </div>

            {/* List with 01, 02, 03 Badges */}
            <div className="space-y-3">
              
              <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-start space-x-3.5">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                  01
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#131E18] dark:text-white">
                    Panchayat Resolution ({p.condition})
                  </div>
                  <p className="text-[11px] text-[#55635B] dark:text-[#9FB5A8]">
                    Surface temp {p.tempMax}°C with 90% confidence interval ({p.tempConfidenceMin}° - {p.tempConfidenceMax}°C).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-start space-x-3.5">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                  02
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#131E18] dark:text-white">
                    Orographic Rain Model (38.5 mm)
                  </div>
                  <p className="text-[11px] text-[#55635B] dark:text-[#9FB5A8]">
                    Calculated condensation over 685m elevation crest with +23.5mm excess.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-start space-x-3.5">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                  03
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#131E18] dark:text-white">
                    KVK Advisory: Anthesis Rice Threat
                  </div>
                  <p className="text-[11px] text-[#55635B] dark:text-[#9FB5A8]">
                    Clear field drainage trenches immediately. Suspend urea top-dressing.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Live Pill */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#55635B] dark:text-[#8FA89B] border-t border-[#E6E9DC] dark:border-[#1B3B2E]">
              <span>STATUS: OPERATIONAL</span>
              <span className="text-[#059669] dark:text-[#34D399] font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block mr-1.5 animate-pulse"></span>
                SYNC OK
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 4 Main KPI Impact Cards in Clean Wispr Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 1 km Resolution */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E7B73] dark:text-[#8FA89B] uppercase tracking-wider">Spatial Grid Scale</span>
            <div className="p-2.5 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#131E18] dark:text-white tracking-tight">1 km² Grid</div>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-1">
              Downscaled from <span className="font-semibold text-[#131E18] dark:text-neutral-200">25 km Taluka Block</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between text-[11px]">
            <span className="text-[#0C4A34] dark:text-[#34D399] font-semibold font-mono">625 Cells / Block</span>
            <span className="text-[#8A968E]">Gram Panchayat</span>
          </div>
        </div>

        {/* Card 2: Rainfall Accuracy Improvement */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E7B73] dark:text-[#8FA89B] uppercase tracking-wider">Precipitation Precision</span>
            <div className="p-2.5 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7]">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-[#131E18] dark:text-white tracking-tight">72%</span>
              <span className="text-xs font-bold text-[#059669] dark:text-[#34D399] flex items-center">
                <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" /> Error Drop
              </span>
            </div>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-1">
              MAE improved from <span className="font-mono">±18 mm</span> to <span className="font-mono font-bold text-[#131E18] dark:text-white">±5 mm</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between text-[11px]">
            <span className="text-[#131E18] dark:text-neutral-300 font-semibold font-mono">Orographic Calibrated</span>
            <span className="text-[#8A968E]">AWS Validated</span>
          </div>
        </div>

        {/* Card 3: Temperature Accuracy Improvement */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E7B73] dark:text-[#8FA89B] uppercase tracking-wider">Thermal Lapse Rate</span>
            <div className="p-2.5 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7]">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-[#131E18] dark:text-white tracking-tight">67%</span>
              <span className="text-xs font-bold text-[#059669] dark:text-[#34D399] flex items-center">
                <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" /> Error Drop
              </span>
            </div>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-1">
              RMSE improved from <span className="font-mono">±4.5°C</span> to <span className="font-mono font-bold text-[#131E18] dark:text-white">±1.5°C</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between text-[11px]">
            <span className="text-[#131E18] dark:text-neutral-300 font-semibold font-mono">DEM Slope Adjusted</span>
            <span className="text-[#8A968E]">Ridge Stacking</span>
          </div>
        </div>

        {/* Card 4: Farmer Reach */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E7B73] dark:text-[#8FA89B] uppercase tracking-wider">National Coverage</span>
            <div className="p-2.5 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#131E18] dark:text-white tracking-tight">12.7 Crore</div>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-1">
              Small & Marginal Farmers Across India
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between text-[11px]">
            <span className="text-[#0C4A34] dark:text-[#34D399] font-semibold">Trust: 40% → 80%+</span>
            <span className="text-[#8A968E]">PMFBY Aligned</span>
          </div>
        </div>

      </div>

    </div>
  );
};
