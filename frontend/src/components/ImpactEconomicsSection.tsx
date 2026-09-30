import React from 'react';
import { 
  TrendingUp, 
  Droplet, 
  Users, 
  Globe2, 
  Sparkles,
  CheckCircle,
  Building2,
  HeartHandshake
} from 'lucide-react';

export const ImpactEconomicsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold mb-1 border border-[#CCE4D3] dark:border-[#1F4D3A]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>National Socio-Economic Transformation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#131E18] dark:text-white">
          Impact & Economics: Software Cost vs Hardware Sensor Cost
        </h2>
        <p className="text-xs text-[#55635B] dark:text-[#8FA89B] max-w-3xl">
          KrishiNetra delivers high-resolution weather intelligence at software cost (₹4.5 Cr) rather than massive physical sensor capital deployment (₹2,500+ Cr).
        </p>
      </div>

      {/* Hero Financial Comparison Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Solution Cost: KrishiNetra AI */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0C4A34] text-white border border-[#14533D] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#A7F3D0] uppercase tracking-wider">KrishiNetra AI Platform</span>
            <span className="px-3 py-1 rounded-full bg-white text-[#0C4A34] text-[10px] font-bold shadow-sm">Recommended</span>
          </div>
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-white">₹4.5 Crore</div>
            <p className="text-xs text-[#D1E5D8]">Total National Software Project Deployment Cost</p>
          </div>
          <ul className="space-y-2 text-xs text-[#E5F2E8] pt-2 border-t border-[#14533D]">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#34D399] flex-shrink-0" />
              <span>Full national coverage across all 2.5 Lakh+ Gram Panchayats</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#34D399] flex-shrink-0" />
              <span>Zero field sensor maintenance, vandalism, or calibration failures</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#34D399] flex-shrink-0" />
              <span>Real-time continuous model retraining via MLflow & Kubernetes</span>
            </li>
          </ul>
        </div>

        {/* Physical Sensor Alternative */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Physical AWS Hardware Grid</span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-300 dark:border-red-800">Impractical</span>
          </div>
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-slate-700 dark:text-slate-300">₹2,500+ Cr</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Required for 250,000 physical sensor stations (@ ₹1 Lakh/station)</p>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
            <li className="flex items-center space-x-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>10+ years deployment timeline with high recurring maintenance</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>High susceptibility to sensor drift, power outages & battery failure</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>Recurring ₹150+ Cr annual sensor replacement and telemetry budget</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 6 Key Impact Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Pillar 1: Economic Savings */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            ₹15,000 - ₹25,000 Cr Crop Protection
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Preventable crop loss averted per year by timing irrigation, pesticide sprays, sowing dates, and harvest before flash unseasonal downpours.
          </p>
        </div>

        {/* Pillar 2: Environmental Sustainability */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
            <Droplet className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            25,000 Cr L Water & 15k MT Pesticides
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Elimination of chemical spray wash-offs and precision scheduling of micro-irrigation saves groundwater aquifers and reduces chemical run-off.
          </p>
        </div>

        {/* Pillar 3: Social Equity & Small Farmers */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            12.7 Cr Small & Marginal Farmers
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Democratizes precision agriculture intelligence from high-tech industrial farms to smallholder farmers with average holdings &lt; 1.08 hectares.
          </p>
        </div>

        {/* Pillar 4: Gender Inclusivity */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Narrows 25% Gender Info Gap
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Direct WhatsApp voice notes and SMS broadcasts empower women farmers who traditionally face restricted access to physical village Mandi extensions.
          </p>
        </div>

        {/* Pillar 5: Governance & PMFBY Claims */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            ₹8,000 - ₹12,000 Cr PMFBY Targeting
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Enables hyper-local parametric crop insurance claim settlements at the Panchayat unit rather than disputed, averaged Block units.
          </p>
        </div>

        {/* Pillar 6: Global Benchmark */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
            <Globe2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Global Benchmark: 1 km Grid
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Elevates India's operational agro-meteorological forecasting to 1 km resolution, matching the USA PRISM standard and surpassing China (3 km).
          </p>
        </div>

      </div>

    </div>
  );
};
