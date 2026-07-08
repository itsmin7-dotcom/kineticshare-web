import React, { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import AssetDetail from './pages/AssetDetail'
import DeveloperCenter from './pages/DeveloperCenter'
import ValidatorDashboard from './pages/ValidatorDashboard'
import BountyBoard from './pages/BountyBoard'

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 지갑 연결 상태 로직
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // 공급자 / 수요자 모드 전환 상태
  const [userRole, setUserRole] = useState('provider'); // 'provider' | 'buyer'

  // 라우팅 뷰(페이지) 또는 토글(모드) 변경 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView, userRole]);

  // 시스템 테마 감지 및 초기화
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // HTML 루트 엘리먼트에 dark 클래스 토글
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navigate = (view, asset = null) => {
    setSelectedAsset(asset);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden relative">
      
      {/* 1. 배경 장식 요소: 오로라 블러 효과 */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 dark:bg-primary/30 blur-[120px] pointer-events-none transition-colors duration-500"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-[120px] pointer-events-none transition-colors duration-500"></div>
      
      {/* 2. 네비게이션 헤더 */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* 좌측 로고 영역 */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-1"
            onClick={() => navigate('dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-black text-xl tracking-tighter">K</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent transition-colors hidden sm:block">
              KineticShare
            </span>
          </div>

          {/* 중앙 토글 (공급자 / 수요자 / 검증자) */}
          <div className="flex-1 flex justify-center">
            <div className="flex bg-slate-200/50 dark:bg-white/[0.05] p-1 rounded-full border border-slate-300 dark:border-white/10 backdrop-blur-md relative shadow-inner transition-colors duration-300 w-[320px] sm:w-[380px]">
              {/* 슬라이딩 백그라운드 캡슐 (3등분) */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(33.33%-2px)] bg-white dark:bg-white/10 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_15px_rgba(255,255,255,0.1)] transition-all duration-300 ease-in-out ${
                  userRole === 'provider' ? 'left-1' : 
                  userRole === 'buyer' ? 'left-[calc(33.33%+1px)]' : 
                  'left-[calc(66.66%+1px)]'
                }`}
              ></div>
              
              <button 
                onClick={() => setUserRole('provider')}
                className={`relative flex-1 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold transition-colors duration-300 z-10 ${userRole === 'provider' ? 'text-primary dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
              >
                공급자
              </button>
              <button 
                onClick={() => setUserRole('buyer')}
                className={`relative flex-1 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold transition-colors duration-300 z-10 ${userRole === 'buyer' ? 'text-purple-600 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
              >
                수요자
              </button>
              <button 
                onClick={() => setUserRole('validator')}
                className={`relative flex-1 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold transition-colors duration-300 z-10 ${userRole === 'validator' ? 'text-green-600 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
              >
                검증자
              </button>
            </div>
          </div>

          {/* 우측 유틸리티 영역 */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
            
            {/* 메뉴 영역 */}
            <div className="hidden md:flex items-center gap-6 mr-2">
              <button 
                onClick={() => navigate('bounty')}
                className={`text-sm font-extrabold transition-colors ${currentView === 'bounty' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'}`}
              >
                바운티 게시판
              </button>
              <button 
                onClick={() => navigate('developer')}
                className={`text-sm font-extrabold transition-colors ${currentView === 'developer' ? 'text-primary dark:text-cyan-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'}`}
              >
                개발자 센터
              </button>
            </div>

            {/* 라이트/다크 테마 토글 버튼 */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors border border-slate-200 dark:border-white/[0.05]"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            {/* 지갑 연결 버튼 / 팝오버 상태 */}
            {!isWalletConnected ? (
              <button 
                onClick={() => setIsWalletConnected(true)}
                className="px-5 sm:px-7 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-extrabold hover:bg-slate-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-[0_5px_15px_rgba(15,23,42,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 whitespace-nowrap"
              >
                지갑 연결
              </button>
            ) : (
              <div 
                className="group relative cursor-pointer px-3 sm:px-4 py-2 rounded-full border border-green-500/30 bg-green-50 dark:bg-green-500/10 flex items-center gap-2 sm:gap-3 shadow-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all hover:bg-green-100 dark:hover:bg-green-500/20"
                onClick={() => setIsWalletConnected(false)}
              >
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)] flex-shrink-0"></div>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 hidden sm:block">0x7F...3B9</span>
                <div className="w-px h-4 bg-green-500/30 hidden sm:block mx-1"></div>
                <span className="font-extrabold text-sm text-green-700 dark:text-green-400">1,420 <span className="text-[10px] sm:text-xs font-bold">KNT</span></span>
                
                {/* 연결 해제 팝오버 툴팁 */}
                <div className="absolute top-full right-0 mt-3 w-40 py-3 px-4 bg-white/90 dark:bg-[#1a1a1c]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                  <p className="text-xs font-bold text-red-500 text-center">클릭하여 연결 해제</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 3. 메인 라우팅 영역 */}
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        {currentView === 'dashboard' && (userRole === 'provider' || userRole === 'buyer') && <Dashboard onNavigate={navigate} userRole={userRole} />}
        {currentView === 'dashboard' && userRole === 'validator' && <ValidatorDashboard />}
        
        {currentView === 'assetDetail' && <AssetDetail asset={selectedAsset} onBack={() => navigate('dashboard')} />}
        {currentView === 'developer' && <DeveloperCenter onBack={() => navigate('dashboard')} />}
        {currentView === 'bounty' && <BountyBoard userRole={userRole} />}
      </main>

    </div>
  )
}

export default App
