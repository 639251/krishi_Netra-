import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  MapPin, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Search, 
  ChevronDown, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import type { PanchayatLocation, LiveAlert } from '../types';
import { PANCHAYAT_LOCATIONS, MOCK_LIVE_ALERTS, UI_TRANSLATIONS } from '../data/mockData';

interface NavbarProps {
  selectedLocation: PanchayatLocation;
  onSelectLocation: (loc: PanchayatLocation) => void;
  currentLang: 'en' | 'hi' | 'mr' | 'ta';
  onChangeLang: (lang: 'en' | 'hi' | 'mr' | 'ta') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLocation,
  onSelectLocation,
  currentLang,
  onChangeLang,
  isDarkMode,
  onToggleTheme,
  activeTab,
  onSelectTab
}) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const unreadAlerts: LiveAlert[] = MOCK_LIVE_ALERTS;

  const langRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[currentLang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setIsAlertsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLocationModalOpen(false);
        setIsAlertsOpen(false);
        setIsLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredLocations = PANCHAYAT_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loc.name_hi && loc.name_hi.includes(searchTerm)) ||
    (loc.name_mr && loc.name_mr.includes(searchTerm))
  );

  const getLocationDisplayName = (loc: PanchayatLocation) => {
    if (currentLang === 'hi') return loc.name_hi;
    if (currentLang === 'mr') return loc.name_mr;
    if (currentLang === 'ta') return loc.name_ta;
    return loc.name;
  };

  const navItems = [
    { id: 'overview', label: t.overviewTab },
    { id: 'map', label: t.geoMapTab },
    { id: 'forecast', label: t.forecastTab },
    { id: 'advisory', label: t.advisoryTab },
    { id: 'architecture', label: t.modelArchTab },
    { id: 'impact', label: t.impactTab }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E6E9DC] dark:border-[#1B3B2E] bg-[#FAF9EE]/90 dark:bg-[#07130E]/90 backdrop-blur-md transition-colors duration-200">
        
        {/* Top Minimal Strip */}
        <div className="bg-[#0A261B] text-[#D1E5D8] text-xs px-4 py-1.5 flex items-center justify-between border-b border-[#143B2D]">
          <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[11px] text-[#A7F3D0] font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block mr-2 animate-pulse"></span>
              GOVT. OF INDIA GKMS AGROMET SERVICE • 1 KM MICRO-GRID
            </span>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-[#8CB89D]">
            <span>STATION TELEMETRY: <strong className="text-[#34D399]">LIVE</strong></span>
            <span>•</span>
            <span>LATENCY: <strong className="text-white">&lt;30ms</strong></span>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo & Portal Identity */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0C4A34] text-white shadow-sm ring-2 ring-[#0C4A34]/20">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg md:text-xl font-bold tracking-tight text-[#131E18] dark:text-white uppercase font-sans">
                    KrishiNetra
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F2E8] dark:bg-[#122E22] text-[#0C4A34] dark:text-[#6EE7B7] border border-[#CCE4D3] dark:border-[#1F4D3A]">
                    1 KM
                  </span>
                </div>
                <p className="text-[10px] text-[#55635B] dark:text-[#8FA89B] uppercase tracking-wider font-semibold">
                  National Agromet Intelligence
                </p>
              </div>
            </div>

            {/* Quick Location Selector Trigger Button */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsLocationModalOpen(true);
                }}
                className="flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#0F241C] hover:bg-white dark:hover:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] transition-all text-left shadow-sm group hover:border-[#0C4A34]/50"
              >
                <MapPin className="w-4 h-4 text-[#0C4A34] dark:text-[#34D399]" />
                <div>
                  <div className="hidden sm:block text-[10px] uppercase text-[#6E7B73] dark:text-[#8FA89B] font-medium">
                    {selectedLocation.district} • {selectedLocation.block}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#131E18] dark:text-white flex items-center space-x-1">
                    <span>{getLocationDisplayName(selectedLocation)}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8A968E] group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* Controls: Language, Theme, Alerts, Call to Action */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#0F241C] hover:bg-white dark:hover:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-xs font-semibold text-[#131E18] dark:text-neutral-200 transition-colors shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-[#6E7B73] dark:text-[#8FA89B]" />
                  <span className="uppercase font-bold">{currentLang}</span>
                  <ChevronDown className={`w-3 h-3 text-[#8A968E] transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#0F241C] rounded-2xl shadow-xl border border-[#E6E9DC] dark:border-[#1B3B2E] z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-[#6E7B73] dark:text-[#8FA89B] uppercase tracking-wider">Select Language (भाषा)</div>
                    <button
                      onClick={() => { onChangeLang('en'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F4F2E1] dark:hover:bg-[#142F24] flex items-center justify-between ${currentLang === 'en' ? 'text-[#0C4A34] dark:text-[#34D399] font-bold' : 'text-[#2D3831] dark:text-neutral-300'}`}
                    >
                      <span>English</span>
                      {currentLang === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />}
                    </button>
                    <button
                      onClick={() => { onChangeLang('hi'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F4F2E1] dark:hover:bg-[#142F24] flex items-center justify-between ${currentLang === 'hi' ? 'text-[#0C4A34] dark:text-[#34D399] font-bold' : 'text-[#2D3831] dark:text-neutral-300'}`}
                    >
                      <span>हिन्दी (Hindi)</span>
                      {currentLang === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />}
                    </button>
                    <button
                      onClick={() => { onChangeLang('mr'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F4F2E1] dark:hover:bg-[#142F24] flex items-center justify-between ${currentLang === 'mr' ? 'text-[#0C4A34] dark:text-[#34D399] font-bold' : 'text-[#2D3831] dark:text-neutral-300'}`}
                    >
                      <span>मराठी (Marathi)</span>
                      {currentLang === 'mr' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />}
                    </button>
                    <button
                      onClick={() => { onChangeLang('ta'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-[#F4F2E1] dark:hover:bg-[#142F24] flex items-center justify-between ${currentLang === 'ta' ? 'text-[#0C4A34] dark:text-[#34D399] font-bold' : 'text-[#2D3831] dark:text-neutral-300'}`}
                    >
                      <span>தமிழ் (Tamil)</span>
                      {currentLang === 'ta' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Dark / Light Toggle */}
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-2xl bg-white/80 dark:bg-[#0F241C] hover:bg-white dark:hover:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-[#131E18] dark:text-[#6EE7B7] transition-colors shadow-sm"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-[#6EE7B7]" /> : <Moon className="w-4 h-4 text-[#0C4A34]" />}
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={alertsRef}>
                <button
                  onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                  className="relative p-2 rounded-2xl bg-white/80 dark:bg-[#0F241C] hover:bg-white dark:hover:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-[#131E18] dark:text-neutral-200 transition-colors shadow-sm"
                  title="Weather Alerts"
                >
                  <Bell className="w-4 h-4 text-[#4A5850] dark:text-neutral-300" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadAlerts.length}
                    </span>
                  )}
                </button>

                {/* Alert Popover */}
                {isAlertsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 p-4 bg-white dark:bg-[#0F241C] rounded-3xl shadow-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E6E9DC] dark:border-[#1B3B2E]">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-bold text-[#131E18] dark:text-white">Active Weather Warnings</h4>
                      </div>
                      <button 
                        onClick={() => setIsAlertsOpen(false)}
                        className="text-[#6E7B73] hover:text-[#131E18] dark:hover:text-neutral-200 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {unreadAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            alert.severity === 'critical'
                              ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                              : alert.severity === 'warning'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span>{alert.title}</span>
                            <span className="text-[10px] opacity-75 font-mono">{alert.timeframe}</span>
                          </div>
                          <p className="text-xs opacity-90 leading-relaxed">{alert.description}</p>
                          <div className="mt-2 text-[10px] font-medium opacity-75">
                            Target Crops: {alert.affectedCrops.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 text-center border-t border-[#E6E9DC] dark:border-[#1B3B2E]">
                      <button
                        onClick={() => {
                          onSelectTab('advisory');
                          setIsAlertsOpen(false);
                        }}
                        className="text-xs font-bold text-[#0C4A34] dark:text-[#34D399] hover:underline"
                      >
                        View Crop Action Bulletins →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Wispr-Style Forest Pine CTA Button */}
              <button
                onClick={() => onSelectTab('advisory')}
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-[#0C4A34] hover:bg-[#073827] text-white font-bold text-xs shadow-sm hover:shadow transition-all"
              >
                KVK Bulletins
              </button>

            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-[#E6E9DC] dark:border-[#1B3B2E]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeTab === item.id
                    ? 'bg-[#0C4A34] text-white dark:bg-[#10B981] dark:text-[#062319] font-bold shadow-sm'
                    : 'text-[#4A5850] dark:text-[#9FB5A8] hover:text-[#131E18] dark:hover:text-white hover:bg-[#EBECE1]/70 dark:hover:bg-[#142F24]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#061C13]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLocationModalOpen(false);
          }}
        >
          <div className="bg-[#FAF9EE] dark:bg-[#0F241C] rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-[#E6E9DC] dark:border-[#1B3B2E] my-auto animate-in fade-in zoom-in-95 duration-150 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E9DC] dark:border-[#1B3B2E]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#E5F2E8] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7] border border-[#CCE4D3] dark:border-[#1F4D3A]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#131E18] dark:text-white">
                    Select Gram Panchayat Station
                  </h3>
                  <p className="text-xs text-[#55635B] dark:text-[#8FA89B]">
                    High-resolution micro-grid network (1 km²)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#EBECE1] dark:hover:bg-[#142F24] text-[#6E7B73] hover:text-[#131E18] dark:hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="mt-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7B73]" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] text-sm focus:outline-none focus:ring-2 focus:ring-[#0C4A34] text-[#131E18] dark:text-white placeholder-[#8A968E] font-medium shadow-sm"
                autoFocus
              />
            </div>

            {/* Location Cards List */}
            <div className="mt-4 space-y-2.5 max-h-[50vh] sm:max-h-80 overflow-y-auto pr-1">
              {filteredLocations.length === 0 ? (
                <div className="text-center py-8 text-[#6E7B73] dark:text-[#8FA89B] text-xs">
                  No Gram Panchayats found matching "{searchTerm}"
                </div>
              ) : (
                filteredLocations.map(loc => {
                  const isSelected = loc.id === selectedLocation.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setIsLocationModalOpen(false);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-[#16382B] border-[#0C4A34] dark:border-[#34D399] text-[#131E18] dark:text-white shadow-md ring-1 ring-[#0C4A34]'
                          : 'bg-white/70 dark:bg-[#122A20] hover:bg-white dark:hover:bg-[#153326] border-[#E6E9DC] dark:border-[#1B3B2E] text-[#131E18] dark:text-neutral-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#131E18] dark:text-white">
                            {getLocationDisplayName(loc)}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0C4A34] text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#55635B] dark:text-[#8FA89B]">
                          {loc.block} Block • {loc.district} District • {loc.state}
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] font-mono text-[#3E4D45] dark:text-neutral-300 pt-0.5">
                          <span>Elev: {loc.elevation}m</span>
                          <span>•</span>
                          <span>Soil: {loc.soilType}</span>
                          <span>•</span>
                          <span>AWS: {loc.nearestAwsDistanceKm}km</span>
                        </div>
                      </div>
                      <div className="text-right pl-3 flex-shrink-0">
                        <span className="text-xs font-mono text-[#6E7B73] dark:text-[#8FA89B] block">
                          {loc.lat.toFixed(2)}°N
                        </span>
                        <span className="text-xs font-mono text-[#6E7B73] dark:text-[#8FA89B] block">
                          {loc.lng.toFixed(2)}°E
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Tip */}
            <div className="mt-4 pt-3 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center justify-between text-[11px] text-[#55635B] dark:text-[#8FA89B]">
              <span>Press <kbd className="px-1.5 py-0.5 rounded-md bg-[#EBECE1] dark:bg-[#142F24] font-mono text-[10px]">ESC</kbd> to close</span>
              <span className="text-[#131E18] dark:text-white font-semibold">{filteredLocations.length} Stations Available</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
