import React, { useState, useEffect } from 'react';

const mockPendingAssets = [
  { id: 'dom-005', name: '정밀 칼질 - 양파 다지기', artisan: '0x3F...1B9', dof: 27, hz: 60, jitter: '0.2ms', completeness: '99.8%' },
  { id: 'ind-011', name: '컨베이어 벨트 불량품 선별', artisan: '0x99...F4A', dof: 32, hz: 120, jitter: '0.1ms', completeness: '100%' },
  { id: 'hm-042', name: '거실 청소 동선 (장애물 회피)', artisan: '0xAA...22B', dof: 19, hz: 60, jitter: '0.8ms', completeness: '97.5%' }
];

export default function ValidatorDashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 카드 스와이프 애니메이션을 위한 클래스 상태
  const [animationClass, setAnimationClass] = useState('scale-100 opacity-100 translate-x-0');

  // 사이버틱 프리뷰어 캔버스 내부 애니메이션용 State
  const [f, setF] = useState(0);
  useEffect(() => {
    let frameId;
    const loop = () => {
      setF(prev => prev + 0.05);
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleVerdict = (type) => {
    // 틴더 스타일 스와이프 로직
    if (type === 'approve') {
      setAnimationClass('translate-x-[120%] rotate-12 opacity-0');
    } else {
      setAnimationClass('-translate-x-[120%] -rotate-12 opacity-0');
    }
    
    // 400ms 후 인덱스 증가 및 상태 리셋
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setAnimationClass('scale-90 opacity-0 translate-x-0 rotate-0 transition-none'); // 리셋 렌더
      
      // 약간의 지연 후 팝업(Fade In) 애니메이션 트리거
      setTimeout(() => {
        setAnimationClass('scale-100 opacity-100 translate-x-0 rotate-0 transition-all duration-500 ease-out');
      }, 50);
    }, 400);
  };

  // 예외 처리: 심사 대기열이 텅 비었을 경우 (Empty State)
  if (currentIndex >= mockPendingAssets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 dark:bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-3xl p-16 rounded-[3rem] border border-slate-200 dark:border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex flex-col items-center text-center max-w-lg w-full relative z-10 transition-colors">
          <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-900/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-green-200 dark:border-green-500/30">
            <span className="text-6xl drop-shadow-md">✔️</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">All caught up!</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
            현재 대기 중인 심사 데이터가 없습니다.<br/>네트워크 무결성 유지에 기여해 주셔서 감사합니다.
          </p>
        </div>
      </div>
    );
  }

  const asset = mockPendingAssets[currentIndex];
  
  // 간단한 스켈레톤 애니메이션 계산
  const pelvisY = 60;
  const lKneeX = Math.sin(f) * 40;
  const rKneeX = Math.sin(f + Math.PI) * 40;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-10 overflow-hidden relative">
      
      {/* 백그라운드 장식 */}
      <div className="absolute top-10 w-full text-center z-0">
        <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm mb-2">VALIDATOR NODE</p>
        <h2 className="text-slate-200 dark:text-slate-800 font-black text-6xl tracking-tighter opacity-50 select-none">DATA INTEGRITY CHECK</h2>
      </div>

      {/* 틴더 스타일 중앙 심사 카드 */}
      <div className={`relative z-10 w-full max-w-2xl bg-white dark:bg-[#0c0c0e] rounded-[3rem] border border-slate-200 dark:border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 ease-out transform ${animationClass}`}>
        
        {/* 상단 3D 스켈레톤 프리뷰어 구역 */}
        <div className="w-full h-72 bg-[#050505] relative flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px] opacity-70"></div>
          
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
            <g transform="translate(100, 70)">
              <line x1="0" y1="0" x2="0" y2={pelvisY} stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              <line x1="0" y1={pelvisY} x2={lKneeX} y2="100" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />
              <line x1="0" y1={pelvisY} x2={rKneeX} y2="100" stroke="#c084fc" strokeWidth="6" strokeLinecap="round" />
              <circle cx="0" cy="-20" r="10" fill="#eff6ff" />
              <circle cx="0" cy={pelvisY} r="5" fill="#eff6ff" />
            </g>
          </svg>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono font-bold text-white uppercase shadow-lg">ID: {asset.id}</span>
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono font-bold text-yellow-400 uppercase shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>PENDING
            </span>
          </div>
        </div>

        {/* 중단 메타데이터 및 품질 지표 구역 */}
        <div className="p-8 md:p-10 border-b border-slate-100 dark:border-white/[0.05]">
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{asset.name}</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-mono mb-8">Artisan: {asset.artisan}</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.03]">
              <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">지터 (Jitter)</p>
              <p className={`text-2xl font-mono font-extrabold ${asset.jitter.includes('0.8') ? 'text-orange-500' : 'text-green-500 dark:text-green-400'}`}>{asset.jitter}</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.03]">
              <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">데이터 완전성</p>
              <p className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">{asset.completeness}</p>
            </div>
          </div>
        </div>

        {/* 하단 거대 액션 버튼 구역 */}
        <div className="p-6 md:p-8 flex gap-4 md:gap-6 bg-slate-50 dark:bg-[#0a0a0c]">
          <button 
            onClick={() => handleVerdict('reject')}
            className="flex-1 py-5 md:py-6 rounded-3xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-xl border-2 border-red-200 dark:border-red-500/30 hover:bg-red-200 dark:hover:bg-red-500/20 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(239,68,68,0.1)] flex items-center justify-center gap-3"
          >
            <span className="text-2xl">✕</span> 반려
          </button>
          
          <button 
            onClick={() => handleVerdict('approve')}
            className="flex-1 py-5 md:py-6 rounded-3xl bg-green-500 dark:bg-green-500/20 text-white dark:text-green-400 font-extrabold text-xl border-2 border-green-600 dark:border-green-500/50 hover:bg-green-600 dark:hover:bg-green-500/30 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.2)] dark:shadow-[0_10px_30px_rgba(34,197,94,0.1)] flex items-center justify-center gap-3"
          >
            <span className="text-2xl">○</span> 승인
          </button>
        </div>

      </div>
      
      {/* 대기 데이터 카운터 */}
      <div className="mt-8 font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest text-sm relative z-10 transition-colors">
        {currentIndex + 1} / {mockPendingAssets.length} REMAINING
      </div>

    </div>
  );
}
