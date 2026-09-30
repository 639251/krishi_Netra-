import React from 'react';
import { 
  Cpu, 
  Database, 
  GitMerge, 
  Zap, 
  Sparkles,
  BookOpen,
  Sliders
} from 'lucide-react';
import { MOCK_MODEL_METRICS } from '../data/mockData';

export const ModelTransparencySection: React.FC = () => {
  const m = MOCK_MODEL_METRICS;

  const pipelineStages = [
    {
      step: '01',
      title: 'Multi-Source Data Ingestion',
      subtitle: 'Raw Covariate Extraction',
      description: 'Ingests IMD GRIB2 (25km), NASA SRTM (30m DEM), ISRO Bhuvan LULC, and NBSS&LUP soil maps. Harmonizes to EPSG:4326 with automated quality control.',
      badge: '5 Free Gov/Public Sources',
      icon: Database,
      color: 'blue'
    },
    {
      step: '02',
      title: '35 Geo-Feature Engineering',
      subtitle: 'Micro-Topography & Roughness',
      description: 'Computes elevation lapse rates, aspect angle, Topographic Wetness Index (TWI), roughness length (z0), NDVI vegetation canopy, and distance to ridge crest.',
      badge: '35 Features / 1km Grid',
      icon: Sliders,
      color: 'amber'
    },
    {
      step: '03',
      title: 'Tri-Hybrid ML Ensemble',
      subtitle: 'RF + XGBoost + CNN U-Net',
      description: 'Specialized sub-models: Random Forest (temperature & humidity), XGBoost (non-linear convective rainfall & wind gusts), and CNN U-Net (spatial orographic field continuity).',
      badge: 'Ridge Stacking Meta-Learner',
      icon: Cpu,
      color: 'emerald'
    },
    {
      step: '04',
      title: 'Physics Constraints & Bias Fix',
      subtitle: 'Atmospheric Boundary Bounds',
      description: 'Enforces Clausius-Clapeyron thermodynamic limits, mass-energy conservation, and quantile mapping against IMD AWS ground truth sensors.',
      badge: 'Leave-One-Station-Out CV',
      icon: Zap,
      color: 'purple'
    },
    {
      step: '05',
      title: 'Sub-30ms Inference & Delivery',
      subtitle: 'Last-Mile Micro-Advisories',
      description: 'Serves 1 km Panchayat micro-climate JSON APIs in <30ms, generates multi-lingual natural language advisories, and dispatches via MSG91 SMS & WhatsApp.',
      badge: '<30 min IMD Cycle Delivery',
      icon: GitMerge,
      color: 'teal'
    }
  ];

  const researchPapers = [
    {
      title: 'Statistical Downscaling and Bias Correction for Climate Research',
      authors: 'Maraun, D. & Widmann, M.',
      year: '2018',
      source: 'Cambridge University Press',
      doi: '10.1017/9781107588783',
      tag: 'Methodological Foundation'
    },
    {
      title: 'DeepSD: Generating High Resolution Climate Datasets from Low Resolution using Deep Learning',
      authors: 'Vandal, T., Kodra, E., Ganguly, S., Michaelis, A., Nemani, R., & Ganguly, A. R.',
      year: '2017',
      source: 'ACM SIGKDD International Conference on Knowledge Discovery & Data Mining',
      doi: '10.1145/3097983.3098004',
      tag: 'Super-Resolution Architecture'
    },
    {
      title: 'Physiographically-Informed Mapping of Temperature and Precipitation (PRISM)',
      authors: 'Daly, C., Halbleib, M., Smith, J. I., et al.',
      year: '2008',
      source: 'International Journal of Climatology',
      doi: '10.1002/joc.1688',
      tag: 'Orographic Lapse Modeling'
    },
    {
      title: 'Configuration of Deep Learning Neural Networks for Statistical Downscaling of Extreme Precipitation',
      authors: 'Baño-Medina, J., Manzanas, R., & Gutiérrez, J. M.',
      year: '2020',
      source: 'Geoscientific Model Development (GMD)',
      doi: '10.5194/gmd-13-2109-2020',
      tag: 'Extreme Event Handling'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold mb-1 border border-[#CCE4D3] dark:border-[#1F4D3A]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Enterprise ML Downscaling Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#131E18] dark:text-white">
              AI Downscaling Model Transparency & Pipeline
            </h2>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-0.5">
              Rigorous, peer-reviewed machine learning ensemble converting 25 km coarse NWP grids to 1 km Panchayat micro-climates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 rounded-full bg-[#0C4A34] text-white font-bold text-xs shadow-sm">
              Kosmonyx AI Systems
            </span>
          </div>
        </div>
      </div>

      {/* Live Benchmark Metrics Grid - Strict 2-Color Minimal Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Temp RMSE</span>
          <div className="text-2xl font-black text-[#131E18] dark:text-white mt-1">±{m.tempRmse}°C</div>
          <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-semibold font-mono">vs ±4.5°C IMD</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Rain MAE</span>
          <div className="text-2xl font-black text-[#131E18] dark:text-white mt-1">±{m.rainMae}mm</div>
          <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-semibold font-mono">vs ±18.0mm IMD</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Model R² Score</span>
          <div className="text-2xl font-black text-[#131E18] dark:text-white mt-1">{m.overallR2}</div>
          <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-semibold font-mono">High Correlation</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Skill Score</span>
          <div className="text-2xl font-black text-[#131E18] dark:text-white mt-1">+{m.skillScorePercent}%</div>
          <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-semibold font-mono">Over Baseline</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Brier Score</span>
          <div className="text-2xl font-black text-[#131E18] dark:text-white mt-1">{m.brierScore}</div>
          <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-semibold font-mono">Precipitation Calib</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
          <span className="text-[10px] font-bold text-[#55635B] dark:text-[#8FA89B] uppercase block">Inference Speed</span>
          <div className="text-2xl font-black text-[#0C4A34] dark:text-[#34D399] mt-1">{m.inferenceLatencyMs}ms</div>
          <span className="text-[10px] text-[#55635B] dark:text-[#8FA89B] font-mono">Sub-30ms Latency</span>
        </div>

      </div>

      {/* Ensemble Weight Breakdown (Ridge Stacking) */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
              Ensemble Stacking Architecture
            </span>
            <h3 className="text-lg font-bold text-[#131E18] dark:text-white">
              Meta-Learner Ridge Regression Weights
            </h3>
          </div>
          <span className="text-xs font-mono text-[#55635B] dark:text-[#8FA89B]">Optuna Hyper-Tuned</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#131E18] dark:text-white">XGBoost Regressor</span>
              <span className="font-mono font-bold text-[#0C4A34] dark:text-[#6EE7B7] text-sm">45% Weight</span>
            </div>
            <div className="w-full bg-[#E6E9DC] dark:bg-[#1B3B2E] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0C4A34] dark:bg-[#34D399] h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[11px] text-[#55635B] dark:text-[#8FA89B] leading-relaxed">
              Specialized for non-linear precipitation thresholds, extreme rain spikes, and localized wind gusts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#131E18] dark:text-white">Random Forest</span>
              <span className="font-mono font-bold text-[#0C4A34] dark:text-[#6EE7B7] text-sm">35% Weight</span>
            </div>
            <div className="w-full bg-[#E6E9DC] dark:bg-[#1B3B2E] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0C4A34] dark:bg-[#34D399] h-full rounded-full" style={{ width: '35%' }}></div>
            </div>
            <p className="text-[11px] text-[#55635B] dark:text-[#8FA89B] leading-relaxed">
              Robust estimator for temperature lapse rates, relative humidity, and canopy radiation balance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#131E18] dark:text-white">CNN U-Net (Spatial)</span>
              <span className="font-mono font-bold text-[#0C4A34] dark:text-[#6EE7B7] text-sm">20% Weight</span>
            </div>
            <div className="w-full bg-[#E6E9DC] dark:bg-[#1B3B2E] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0C4A34] dark:bg-[#34D399] h-full rounded-full" style={{ width: '20%' }}></div>
            </div>
            <p className="text-[11px] text-[#55635B] dark:text-[#8FA89B] leading-relaxed">
              Maintains spatial coherence across neighboring grid cells and preserves valley drainage corridors.
            </p>
          </div>

        </div>
      </div>

      {/* End-to-End Pipeline Step-by-Step Flow */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <div>
          <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
            End-to-End Workflow
          </span>
          <h3 className="text-xl font-bold text-[#131E18] dark:text-white mt-0.5">
            5-Stage Technical Architecture Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] flex flex-col justify-between space-y-3 relative group hover:border-[#0C4A34] transition-all hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0C4A34] dark:text-[#6EE7B7] bg-[#EDF5EE] dark:bg-[#0A261B] px-2.5 py-0.5 rounded-full border border-[#CCE4D3] dark:border-[#1F4D3A]">
                      Stage {stage.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#55635B] dark:text-[#8FA89B] group-hover:text-[#0C4A34] transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] font-semibold font-mono text-emerald-600 dark:text-emerald-400 block">
                    {stage.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Research Papers & Citations */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Research Foundation & Scientific Citations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {researchPapers.map((paper, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {paper.tag}
                </span>
                <span className="text-xs font-mono text-slate-400">{paper.year}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {paper.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {paper.authors} • <em>{paper.source}</em>
              </p>
              <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1 pt-1">
                <span>DOI: {paper.doi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
