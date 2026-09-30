import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FlaskConical, 
  Share2,
  Check,
  X,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CropAdvisory, CropType, GrowthStage, SeverityLevel } from '../types';
import { MOCK_CROP_ADVISORIES, UI_TRANSLATIONS } from '../data/mockData';
import { sendSMSDelivery, sendWhatsAppDelivery } from '../services/api';

interface CropAdvisorySectionProps {
  currentLang: 'en' | 'hi' | 'mr' | 'ta';
}

const CROPS: CropType[] = [
  'Rice (Paddy)',
  'Wheat',
  'Cotton',
  'Soybean',
  'Grapes',
  'Sugarcane',
  'Onion',
  'Mustard'
];

const STAGES: GrowthStage[] = [
  'Sowing & Germination',
  'Vegetative Growth',
  'Flowering & Tillering',
  'Grain / Fruit Formation',
  'Maturity & Harvesting'
];

export const CropAdvisorySection: React.FC<CropAdvisorySectionProps> = ({
  currentLang
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<GrowthStage | 'all'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [activeModalAdvisory, setActiveModalAdvisory] = useState<CropAdvisory | null>(null);
  const [modalType, setModalType] = useState<'sms' | 'whatsapp' | null>(null);
  const [simulatedFarmerPhone, setSimulatedFarmerPhone] = useState('+91 98230 45892');
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredAdvisories = MOCK_CROP_ADVISORIES.filter(adv => {
    if (selectedCrop !== 'all' && adv.crop !== selectedCrop) return false;
    if (selectedStage !== 'all' && adv.stage !== selectedStage) return false;
    return true;
  });

  // Audio Playback simulation using Browser SpeechSynthesis API
  const handleToggleAudio = (adv: CropAdvisory) => {
    if (playingAudioId === adv.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(adv.id);
    const textToSpeak = adv.message[currentLang] || adv.message['en'];

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : currentLang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), adv.audioDurationSec * 1000);
    }
  };

  const [isSending, setIsSending] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  const handleTriggerPush = async () => {
    if (!activeModalAdvisory) return;
    setIsSending(true);
    setDeliveryResult(null);

    try {
      if (modalType === 'sms') {
        const res = await sendSMSDelivery(simulatedFarmerPhone, activeModalAdvisory.smsPreview);
        console.log('MSG91 Delivery API Response:', res);
        setDeliveryResult('SMS request dispatched via MSG91 Gateway!');
      } else {
        const res = await sendWhatsAppDelivery(
          simulatedFarmerPhone,
          activeModalAdvisory.whatsAppPreview.header,
          activeModalAdvisory.whatsAppPreview.body
        );
        console.log('WhatsApp Delivery API Response:', res);
        setDeliveryResult('WhatsApp message dispatched!');
      }

      setSentSuccess(true);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });

      setTimeout(() => {
        setSentSuccess(false);
        setIsSending(false);
        setModalType(null);
      }, 3000);
    } catch (err) {
      console.error('Dispatch failed:', err);
      setIsSending(false);
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    if (sev === 'critical') {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FAF9EE] dark:bg-[#142F24] border border-[#0C4A34]/40 text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#0C4A34] dark:bg-[#6EE7B7] mr-1"></span>
          <span>Immediate Action</span>
        </span>
      );
    }
    if (sev === 'warning') {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-[#131E18] dark:text-[#E2E8F0] text-xs font-bold">
          <AlertCircle className="w-3.5 h-3.5 mr-0.5 text-[#0C4A34] dark:text-[#6EE7B7]" />
          <span>Caution Window</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] border border-[#CCE4D3] dark:border-[#1F4D3A] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 mr-0.5 text-[#0C4A34] dark:text-[#34D399]" />
        <span>Optimal Window</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] text-xs font-bold mb-1 border border-[#CCE4D3] dark:border-[#1F4D3A]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />
              <span>District Agromet Unit (DAMU) & ICAR-KVK Advisory Service</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#131E18] dark:text-white">
              Panchayat Agromet Bulletins ({filteredAdvisories.length} Active)
            </h2>
            <p className="text-xs text-[#55635B] dark:text-[#8FA89B] mt-0.5">
              Subject Matter Specialist (SMS Agronomy) Verified Field Guidance for Precision Farming.
            </p>
          </div>

          {/* Audio TTS Indicator */}
          <div className="flex items-center space-x-2 text-xs text-[#131E18] dark:text-[#6EE7B7] bg-[#FAF9EE] dark:bg-[#142F24] px-3.5 py-2 rounded-2xl border border-[#E6E9DC] dark:border-[#1B3B2E]">
            <Volume2 className="w-4 h-4 text-[#0C4A34] dark:text-[#34D399]" />
            <span>Regional Voice Advisory Available</span>
          </div>
        </div>

        {/* Filter Controls: Crop & Growth Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Crop Filter */}
          <div>
            <label className="text-xs font-bold text-[#6E7B73] dark:text-[#8FA89B] uppercase block mb-1.5">
              Filter by Target Crop:
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCrop('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCrop === 'all'
                    ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                    : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
                }`}
              >
                All Crops
              </button>
              {CROPS.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCrop === c
                      ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                      : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Growth Stage Filter */}
          <div>
            <label className="text-xs font-bold text-[#6E7B73] dark:text-[#8FA89B] uppercase block mb-1.5">
              Phenological Growth Stage:
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedStage('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStage === 'all'
                    ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                    : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
                }`}
              >
                All Stages
              </button>
              {STAGES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStage(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStage === s
                      ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                      : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Advisory Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAdvisories.map(adv => {
          const isPlaying = playingAudioId === adv.id;
          const localizedTitle = adv.title[currentLang] || adv.title['en'];
          const localizedMessage = adv.message[currentLang] || adv.message['en'];

          return (
            <div
              key={adv.id}
              className="glass-card p-6 rounded-3xl space-y-5 transition-all relative overflow-hidden border border-[#E6E9DC] dark:border-[#1B3B2E] shadow-sm hover:border-[#0C4A34]/40"
            >
              
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#131E18] dark:text-white bg-[#FAF9EE] dark:bg-[#142F24] px-2.5 py-0.5 rounded-full border border-[#E6E9DC] dark:border-[#1B3B2E]">
                      {adv.crop}
                    </span>
                    <span className="text-xs font-medium text-[#55635B] dark:text-[#8FA89B]">
                      • {adv.stage}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#131E18] dark:text-white leading-snug pt-1">
                    {localizedTitle}
                  </h3>
                  <div className="text-[11px] text-[#6E7B73] font-mono">
                    {adv.timestamp}
                  </div>
                </div>
                <div>{getSeverityBadge(adv.severity)}</div>
              </div>

              {/* Advisory Body Message */}
              <p className="text-xs sm:text-sm text-[#55635B] dark:text-[#CBD5E1] leading-relaxed font-normal">
                {localizedMessage}
              </p>

              {/* Action Item Bullet Points */}
              <div className="p-4 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-2">
                <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#6EE7B7] uppercase tracking-wider block">
                  Prescribed Agronomic Operations:
                </span>
                <ul className="space-y-1.5 text-xs text-[#131E18] dark:text-[#E2E8F0]">
                  {adv.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-[#0C4A34] dark:text-[#6EE7B7] font-bold mt-0.5">▪</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scientific Basis Note */}
              <div className="flex items-center space-x-2 text-[11px] text-[#6E7B73] dark:text-[#8FA89B] font-mono">
                <FlaskConical className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#6EE7B7] flex-shrink-0" />
                <span className="truncate">Meteorological Threshold: {adv.scientificRationale}</span>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex flex-wrap items-center justify-between gap-3">
                
                {/* Audio Button */}
                <button
                  onClick={() => handleToggleAudio(adv)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center space-x-2 transition-all ${
                    isPlaying
                      ? 'bg-[#0C4A34] text-white shadow-sm'
                      : 'bg-[#FAF9EE] dark:bg-[#142F24] text-[#131E18] dark:text-[#6EE7B7] border border-[#E6E9DC] dark:border-[#1B3B2E] hover:border-[#0C4A34]'
                  }`}
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0C4A34]" />}
                  <span>{isPlaying ? t.audioPlaying : t.audioListen}</span>
                </button>

                {/* Delivery Simulators */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveModalAdvisory(adv);
                      setModalType('sms');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#142F24] hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E] text-xs font-semibold text-[#131E18] dark:text-neutral-200 flex items-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#0C4A34]" />
                    <span>SMS Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModalAdvisory(adv);
                      setModalType('whatsapp');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#0C4A34] hover:bg-[#083827] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-white" />
                    <span>WhatsApp Dispatch</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Simulator Modal for SMS and WhatsApp */}
      {modalType && activeModalAdvisory && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1f18] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-900/40">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${modalType === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {modalType === 'whatsapp' ? <Share2 className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {modalType === 'whatsapp' ? 'WhatsApp Business Agromet Dispatch' : 'Gramin SMS Gateway Delivery'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct Farmer Communication Channel</p>
                </div>
              </div>
              <button 
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Input */}
            <div className="mt-4 space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Farmer Mobile Number / Kisan ID:</label>
              <input
                type="text"
                value={simulatedFarmerPhone}
                onChange={e => setSimulatedFarmerPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            {/* Device Phone Screen Preview */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-emerald-900/60">
              {modalType === 'sms' ? (
                /* SMS Preview */
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b pb-1">
                    <span>Sender: GOV-KRISHI</span>
                    <span>Just Now</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                    {activeModalAdvisory.smsPreview}
                  </p>
                  <div className="text-[10px] text-slate-400 text-right">
                    152 / 160 characters (DLT Verified)
                  </div>
                </div>
              ) : (
                /* WhatsApp Preview */
                <div className="bg-[#0b141a] text-white p-4 rounded-2xl shadow-md border border-emerald-900/40 text-xs space-y-2.5">
                  <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      KN
                    </div>
                    <div>
                      <div className="font-bold flex items-center space-x-1">
                        <span>KrishiNetra Official Portal</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                      </div>
                      <div className="text-[9px] text-emerald-400">Verified Agromet Service</div>
                    </div>
                  </div>
                  <div className="bg-[#1f2c34] p-3 rounded-xl rounded-tl-none space-y-2">
                    <div className="font-bold text-amber-400 text-[11px]">{activeModalAdvisory.whatsAppPreview.header}</div>
                    <p className="text-slate-200 text-[11px] whitespace-pre-line leading-relaxed">
                      {activeModalAdvisory.whatsAppPreview.body}
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1 border-t border-white/10">
                      {activeModalAdvisory.whatsAppPreview.footer}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Result Banner */}
            {deliveryResult && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{deliveryResult}</span>
              </div>
            )}

            {/* Trigger Button */}
            <div className="mt-4">
              <button
                onClick={handleTriggerPush}
                disabled={sentSuccess || isSending}
                className={`w-full py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                  sentSuccess
                    ? 'bg-[#10B981] text-white'
                    : isSending
                    ? 'bg-slate-400 text-white cursor-wait'
                    : 'bg-[#0C4A34] hover:bg-[#083827] text-white shadow-sm'
                }`}
              >
                {sentSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Advisory Dispatched to Farmer Mobile</span>
                  </>
                ) : isSending ? (
                  <span>Dispatching to Gateway...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Agromet Broadcast</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
