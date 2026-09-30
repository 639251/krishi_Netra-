import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';
import type { PanchayatLocation } from '../types';
import { MOCK_FORECAST_DAYS, MOCK_HOURLY_FORECAST } from '../data/mockData';

interface ForecastDashboardProps {
  location: PanchayatLocation;
  currentLang: 'en' | 'hi' | 'mr' | 'ta';
}

export const ForecastDashboard: React.FC<ForecastDashboardProps> = ({
  location
}) => {
  const forecastDays = MOCK_FORECAST_DAYS[location.id] || MOCK_FORECAST_DAYS['tamhini-mulshi-pune'];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const activeDay = forecastDays[selectedDayIndex];

  const p = activeDay.panchayatForecast;
  const b = activeDay.blockForecast;
  const delta = activeDay.downscalingDelta;

  return (
    <div className="space-y-6">
      
      {/* Header & Day Selector */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold mb-1 border border-[#CCE4D3] dark:border-[#1F4D3A]">
              <span>National Agromet Micro-Forecast (WRF-Downscaled)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#131E18] dark:text-white">
              5-Day Gramin Panchayat Forecast ({location.name})
            </h2>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-0.5">
              Micro-topography & lapse-rate adjusted predictions for precision irrigation and harvesting.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-3 text-xs font-mono bg-[#FAF9EE] dark:bg-[#142F24] p-3 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
            <div>
              <span className="text-[#6E7B73] dark:text-[#8FA89B] block text-[10px]">Uncertainty Band</span>
              <span className="font-bold text-[#0C4A34] dark:text-[#34D399]">90% Confidence CI</span>
            </div>
            <div className="h-6 w-px bg-[#E6E9DC] dark:bg-[#1F4D3A]"></div>
            <div>
              <span className="text-[#6E7B73] dark:text-[#8FA89B] block text-[10px]">Station Baseline</span>
              <span className="font-bold text-[#131E18] dark:text-white">{location.awsStationName}</span>
            </div>
          </div>
        </div>

        {/* 5-Day Horizontal Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {forecastDays.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const fp = day.panchayatForecast;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#0C4A34] text-white shadow-lg border-[#0C4A34] scale-[1.02]'
                    : 'bg-white/70 dark:bg-[#122A20] hover:bg-[#FAF9EE] dark:hover:bg-[#153326] border-[#E6E9DC] dark:border-[#1B3B2E] text-[#131E18] dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className={isSelected ? 'text-[#A7F3D0]' : 'text-[#6E7B73] dark:text-[#8FA89B]'}>
                    {day.dayName}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{day.date.slice(5)}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-black">{fp.tempMax}°</div>
                  <div className="text-xs font-semibold opacity-80">/{fp.tempMin}°C</div>
                </div>

                {/* Rain Pill */}
                <div className={`flex items-center justify-between text-xs font-bold px-2.5 py-1 rounded-xl ${
                  isSelected ? 'bg-black/25 text-[#6EE7B7]' : 'bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#34D399]'
                }`}>
                  <span className="flex items-center">
                    <CloudRain className="w-3 h-3 mr-1" />
                    {fp.rainfallMm} mm
                  </span>
                  <span className="text-[10px] opacity-75">{fp.rainProbability}%</span>
                </div>

                {/* Delta compare tag */}
                <div className={`mt-2 text-[10px] font-mono pt-1.5 border-t ${
                  isSelected ? 'border-white/20 text-[#A7F3D0]' : 'border-[#E6E9DC] dark:border-[#1F4D3A] text-[#6E7B73] dark:text-[#8FA89B]'
                }`}>
                  <span>Δ Rain: {day.downscalingDelta.rainDiff > 0 ? `+${day.downscalingDelta.rainDiff}` : day.downscalingDelta.rainDiff}mm</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Deep-Dive Parameter Grid: Block vs Panchayat Deviation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Live Comparison Matrix & Weather Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E9DC] dark:border-[#1B3B2E]">
              <div>
                <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
                  Live Deviation Breakdown
                </span>
                <h3 className="text-lg font-bold text-[#131E18] dark:text-white">
                  {activeDay.dayName} ({activeDay.date}) Micro-Climate Matrix
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] font-mono text-xs font-bold border border-[#CCE4D3] dark:border-[#1F4D3A]">
                1km vs 25km
              </span>
            </div>

            {/* Downscaling Explanation Quote */}
            <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-xs text-[#3E4D45] dark:text-[#D1E5D8]">
              <span className="font-bold text-[#0C4A34] dark:text-[#34D399] block mb-1">🔍 Why the deviation occurs:</span>
              {delta.reason}
            </div>

            {/* Comparison Rows - Strict 2-Color Clean Palette */}
            <div className="space-y-3 text-xs">
              
              {/* Row 1: Max Temperature */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#131E18] dark:text-white block">Maximum Temperature</span>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B]">Adiabatic lapse rate applied</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 font-mono text-right">
                  <div>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B] block">Block (25km)</span>
                    <span className="font-bold text-[#55635B] dark:text-[#8FA89B]">{b.tempMax}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0C4A34] dark:text-[#34D399] font-bold block">Panchayat (1km)</span>
                    <span className="font-extrabold text-[#0C4A34] dark:text-[#34D399] text-sm">{p.tempMax}°C</span>
                  </div>
                  <div className="text-[#0C4A34] dark:text-[#34D399] font-bold flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>{Math.abs(delta.tempDiff)}°C</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Rainfall */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#131E18] dark:text-white block">Precipitation (24h)</span>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B]">Orographic precipitation model</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 font-mono text-right">
                  <div>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B] block">Block (25km)</span>
                    <span className="font-bold text-[#55635B] dark:text-[#8FA89B]">{b.rainfallMm} mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0C4A34] dark:text-[#34D399] font-bold block">Panchayat (1km)</span>
                    <span className="font-extrabold text-[#0C4A34] dark:text-[#34D399] text-sm">{p.rainfallMm} mm</span>
                  </div>
                  <div className="text-[#0C4A34] dark:text-[#34D399] font-bold flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+{delta.rainDiff}mm</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Humidity */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#131E18] dark:text-white block">Relative Humidity</span>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B]">Canopy boundary layer calculation</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 font-mono text-right">
                  <div>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B] block">Block (25km)</span>
                    <span className="font-bold text-[#55635B] dark:text-[#8FA89B]">{b.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0C4A34] dark:text-[#34D399] font-bold block">Panchayat (1km)</span>
                    <span className="font-extrabold text-[#0C4A34] dark:text-[#34D399] text-sm">{p.humidity}%</span>
                  </div>
                  <div className="text-[#0C4A34] dark:text-[#34D399] font-bold flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+{p.humidity - b.humidity}%</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Wind Speed & Direction */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#EDF5EE] dark:bg-[#0A261B] text-[#0C4A34] dark:text-[#6EE7B7]">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#131E18] dark:text-white block">Wind Gusts & Direction</span>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B]">Surface roughness aerodynamic drag</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 font-mono text-right">
                  <div>
                    <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B] block">Block (25km)</span>
                    <span className="font-bold text-[#55635B] dark:text-[#8FA89B]">{b.windSpeedKmH} km/h ({b.windDirection})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0C4A34] dark:text-[#34D399] font-bold block">Panchayat (1km)</span>
                    <span className="font-extrabold text-[#0C4A34] dark:text-[#34D399] text-sm">{p.windSpeedKmH} km/h ({p.windDirection})</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Recharts Uncertainty Band Charts */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Chart 1: Hourly Temperature with 90% Confidence Envelope */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
                  Uncertainty Envelope
                </span>
                <h4 className="text-base font-bold text-[#131E18] dark:text-white">
                  24-Hour Temperature Profile (°C) with 90% CI
                </h4>
              </div>
              <span className="text-xs font-mono text-[#55635B] dark:text-[#8FA89B]">Ridge Stacking</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HOURLY_FORECAST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTempPanchayat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0C4A34" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#0C4A34" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0C4A34" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0C4A34" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                  <XAxis dataKey="time" stroke="#8A968E" fontSize={11} />
                  <YAxis domain={[15, 35]} stroke="#8A968E" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131E18', 
                      borderRadius: '12px', 
                      borderColor: '#0C4A34',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="confidenceUpper" 
                    stroke="transparent" 
                    fill="#0C4A34" 
                    fillOpacity={0.12} 
                    name="90% Upper CI" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="panchayatTemp" 
                    stroke="#0C4A34" 
                    strokeWidth={2.5} 
                    fill="url(#colorTempPanchayat)" 
                    name="KrishiNetra 1km Temp (°C)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blockTemp" 
                    stroke="#8A968E" 
                    strokeWidth={1.8} 
                    strokeDasharray="4 4" 
                    fill="none" 
                    name="IMD Block 25km Temp (°C)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hourly Rainfall Comparison */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
                  Precipitation Distribution
                </span>
                <h4 className="text-base font-bold text-[#131E18] dark:text-white">
                  Hourly Rainfall: KrishiNetra 1km vs IMD 25km (mm)
                </h4>
              </div>
              <span className="text-xs font-mono text-[#0C4A34] dark:text-[#34D399] font-bold">+23.5mm Local Orographic Lift</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_HOURLY_FORECAST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                  <XAxis dataKey="time" stroke="#8A968E" fontSize={11} />
                  <YAxis stroke="#8A968E" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131E18', 
                      borderRadius: '12px', 
                      borderColor: '#0C4A34',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="panchayatRain" fill="#0C4A34" radius={[4, 4, 0, 0]} name="KrishiNetra 1km Rain (mm)" />
                  <Bar dataKey="blockRain" fill="#8A968E" radius={[4, 4, 0, 0]} name="IMD Block 25km Rain (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
