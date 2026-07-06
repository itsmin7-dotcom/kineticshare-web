import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import AssetDetail from './pages/AssetDetail'

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // 최초 렌더링 시 다크모드 기본 적용
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateTo = (view, asset = null) => {
    setCurrentView(view);
    setSelectedAsset(asset);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      {/* 네비게이션 바 - 테마 반응형 글래스모피즘 */}
      <header className="sticky top-0 z-50 bg-white/40 dark:bg-[#09090b]/60 backdrop-blur-3xl border-b border-white/60 dark:border-white/[0.08] px-8 py-6 md:px-12 flex justify-between items-center shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all duration-500">
        <div 
          className="text-2xl font-extrabold tracking-tighter cursor-pointer flex items-center gap-4 hover:opacity-80 transition-opacity text-slate-900 dark:text-white"
          onClick={() => navigateTo('dashboard')}
        >
          <div className="w-8 h-8 rounded-full bg-primary animate-pulse-slow shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
          KineticShare
        </div>
        <div className="flex items-center gap-5">
          {/* 테마 토글 스위치 */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-300 dark:border-white/[0.1] bg-white/50 dark:bg-white/[0.03] text-slate-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/[0.1] transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <button className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/[0.1] bg-white/50 dark:bg-white/[0.03] text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm dark:shadow-lg">
            데이터 등록
          </button>
          <button className="px-7 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-extrabold hover:bg-slate-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(15,23,42,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5">
            지갑 연결
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto w-full">
        {currentView === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
        {currentView === 'assetDetail' && <AssetDetail asset={selectedAsset} onBack={() => navigateTo('dashboard')} />}
      </main>
    </div>
  )
}

export default App
