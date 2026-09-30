import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QuickStatsHero } from './components/QuickStatsHero';
import { InteractiveGeoMap } from './components/InteractiveGeoMap';
import { ForecastDashboard } from './components/ForecastDashboard';
import { CropAdvisorySection } from './components/CropAdvisorySection';
import { ModelTransparencySection } from './components/ModelTransparencySection';
import { ImpactEconomicsSection } from './components/ImpactEconomicsSection';
import { GovernmentInitiativesFooter } from './components/GovernmentInitiativesFooter';
import type { PanchayatLocation } from './types';
import { PANCHAYAT_LOCATIONS, MOCK_FORECAST_DAYS } from './data/mockData';

export function App() {
  const [selectedLocation, setSelectedLocation] = useState<PanchayatLocation>(PANCHAYAT_LOCATIONS[0]);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'mr' | 'ta'>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentForecastDays = MOCK_FORECAST_DAYS[selectedLocation.id] || MOCK_FORECAST_DAYS['tamhini-mulshi-pune'];
  const todayForecast = currentForecastDays[0];

  return (
    <div className="min-h-screen bg-[#FAF9EE] text-[#131E18] dark:bg-[#07130E] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Soft Ambient Radial Mesh background for Wispr look */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-10 bg-[radial-gradient(circle_at_50%_0%,_rgba(12,74,52,0.08)_0%,_transparent_55%)]" />
      <div className="pointer-events-none fixed -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5F2E8]/60 blur-3xl dark:bg-[#0C4A34]/10" />
      <div className="pointer-events-none fixed top-1/3 -left-40 w-96 h-96 rounded-full bg-[#F4F2E1]/80 blur-3xl dark:bg-[#0C4A34]/5" />
      
      {/* Sticky Top Navbar */}
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
        
        {/* Tab 1: Overview & Weather Intelligence */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <QuickStatsHero
              location={selectedLocation}
              currentForecast={todayForecast}
              currentLang={currentLang}
              onNavigateToMap={() => setActiveTab('map')}
              onNavigateToAdvisory={() => setActiveTab('advisory')}
            />
            
            <div className="pt-2">
              <InteractiveGeoMap
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                currentLang={currentLang}
              />
            </div>

            <div className="pt-2">
              <ForecastDashboard
                location={selectedLocation}
                currentLang={currentLang}
              />
            </div>

            <div className="pt-2">
              <CropAdvisorySection
                currentLang={currentLang}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Geo-Spatial Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <InteractiveGeoMap
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* Tab 3: 5-Day Downscaled Forecast & Uncertainty Bands */}
        {activeTab === 'forecast' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ForecastDashboard
              location={selectedLocation}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* Tab 4: Crop Advisory Engine & Simulators */}
        {activeTab === 'advisory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CropAdvisorySection
              currentLang={currentLang}
            />
          </div>
        )}

        {/* Tab 5: Model Transparency & ML Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ModelTransparencySection />
          </div>
        )}

        {/* Tab 6: Impact & Socio-Economic Benefits */}
        {activeTab === 'impact' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ImpactEconomicsSection />
          </div>
        )}

      </main>

      {/* Footer & Compliance */}
      <GovernmentInitiativesFooter />

    </div>
  );
}

export default App;
