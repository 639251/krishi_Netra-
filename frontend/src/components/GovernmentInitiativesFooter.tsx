import React from 'react';
import { 
  Sprout, 
  Award
} from 'lucide-react';

export const GovernmentInitiativesFooter: React.FC = () => {
  const initiatives = [
    {
      title: 'Digital India',
      desc: 'Democratizing AI to the last-mile smallholder farmer via SMS and WhatsApp.',
      badge: 'MeitY'
    },
    {
      title: 'PMFBY',
      desc: 'Panchayat-level granular parametric weather index insurance verification.',
      badge: 'MoA&FW'
    },
    {
      title: 'GKMS',
      desc: 'Direct enhancement of IMD Gramin Krishi Mausam Sewa block bulletins.',
      badge: 'MoES'
    },
    {
      title: 'NMSA',
      desc: 'National Mission for Sustainable Agriculture: reducing water & pesticide waste.',
      badge: 'Sustainable'
    },
    {
      title: 'Aspirational Districts',
      desc: 'Priority deployment in NITI Aayog climate-vulnerable agricultural blocks.',
      badge: 'NITI Aayog'
    },
    {
      title: 'AtmaNirbhar Bharat',
      desc: '100% indigenous AI downscaling engine tailored for Indian monsoon dynamics.',
      badge: 'Make In India'
    }
  ];

  return (
    <footer className="mt-16 border-t border-[#E6E9DC] dark:border-[#1B3B2E] bg-[#FAF9EE]/80 dark:bg-[#06140E] backdrop-blur-xl pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* National Initiatives Alignment Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h4 className="text-base font-bold text-[#131E18] dark:text-white uppercase tracking-wider">
              Strategic Alignment with Government of India Initiatives
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0F241C] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#131E18] dark:text-white">{item.title}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] font-bold">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[10px] text-[#55635B] dark:text-[#8FA89B] leading-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-[#E6E9DC] dark:border-[#1B3B2E] text-xs">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#0C4A34] flex items-center justify-center text-white font-bold">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-[#131E18] dark:text-white">KrishiNetra</span>
                <span className="text-xs text-[#0C4A34] dark:text-[#34D399] ml-1.5 font-bold">AI Platform</span>
              </div>
            </div>
            <p className="text-[#4A5850] dark:text-[#9FB5A8] leading-relaxed max-w-sm">
              Empowering 12.7 Cr Indian smallholder farmers with hyper-local 1 km² Panchayat micro-climate forecasts, precision crop advisories, and weather risk management.
            </p>
            <div className="text-[11px] text-[#6E7B73] dark:text-[#8FA89B] font-mono">
              Designed for National Precision Agriculture & GKMS Advisory Integration.
            </div>
          </div>

          {/* Core Technologies */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-bold text-[#131E18] dark:text-white uppercase tracking-wider block">
              Core Tech Stack & Models
            </span>
            <ul className="space-y-1 text-[#4A5850] dark:text-[#9FB5A8] text-[11px]">
              <li>• ML: Scikit-Learn, XGBoost, CNN U-Net, Ridge Stacking Ensemble</li>
              <li>• Geospatial: GeoPandas, Rasterio, GDAL, NASA SRTM DEM, ISRO LULC</li>
              <li>• Ingestion: IMD GRIB2, NBSS&LUP Soil Maps, AWS Telemetry</li>
              <li>• Messaging: MSG91 SMS API, WhatsApp Business Cloud API</li>
            </ul>
          </div>

          {/* Enterprise Support / Architecture Division */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-bold text-[#131E18] dark:text-white uppercase tracking-wider block">
              Platform Governance
            </span>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0F241C] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-1 shadow-sm">
              <div className="font-bold text-[#0C4A34] dark:text-[#6EE7B7]">Kosmonyx Precision Systems</div>
              <div className="text-[11px] text-[#55635B] dark:text-[#8FA89B]">National Weather Intelligence Portal</div>
              <div className="text-[10px] text-[#059669] dark:text-[#34D399] font-mono font-semibold">Status: 24/7 Live Monitoring Active</div>
            </div>
          </div>

        </div>

        {/* Copyright & Live Status Bar */}
        <div className="pt-6 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#6E7B73] dark:text-[#8FA89B]">
          <div>
            © 2026 KrishiNetra by Kosmonyx. All Rights Reserved. National Precision Agriculture Platform.
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#059669] dark:text-[#34D399] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block mr-1.5 animate-pulse"></span>
              All Systems Operational
            </span>
            <span>•</span>
            <span className="font-mono">Inference Engine v2.3.1</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
