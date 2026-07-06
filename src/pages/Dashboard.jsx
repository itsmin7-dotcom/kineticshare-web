import React, { useState, useMemo } from 'react';

// 테스트용 하드코딩 데이터
const mockAssets = [
  { id: 'dom-001', name: '프리미엄 커피 브루잉', category: '가사 노동', artisan: '0x1A4...9B2', dof: 6, hz: 120, transactions: 1420 },
  { id: 'dom-002', name: '섬세한 식기 세척', category: '가사 노동', artisan: '0x8F2...3C1', dof: 7, hz: 100, transactions: 890 },
  { id: 'dom-003', name: '정밀 의류 개기', category: '가사 노동', artisan: '0x3E1...7A5', dof: 5, hz: 60, transactions: 450 },
  { id: 'mfg-001', name: '정밀 납땜 공정', category: '정밀 제조', artisan: '0x4D5...1E8', dof: 6, hz: 240, transactions: 3100 },
];

export default function Dashboard({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('가사 노동');

  // 예상 수익 시뮬레이터 상태
  const [주간제공시간, set주간제공시간] = useState(10);
  const [숙련도, set숙련도] = useState('중급');

  // 예상 수익 시뮬레이터 계산 로직
  const { 월간예상토큰, 월간예상원화 } = useMemo(() => {
    let 가중치 = 1;
    if (숙련도 === '중급') 가중치 = 2;
    if (숙련도 === '장인') 가중치 = 5;
    
    const 기본시급토큰 = 15; // 기본 시간당 15 KNT
    const 월간제공시간 = 주간제공시간 * 4;
    const 계산된토큰 = 월간제공시간 * 기본시급토큰 * 가중치;
    
    const 토큰당원화가치 = 1200; // 1 KNT 당 1,200원 (가정)
    const 계산된원화 = 계산된토큰 * 토큰당원화가치;

    return { 월간예상토큰: 계산된토큰, 월간예상원화: 계산된원화 };
  }, [주간제공시간, 숙련도]);

  return (
    <div className="space-y-10 animate-fade-in transition-colors duration-500">
      {/* 헤더 섹션 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent transition-colors duration-500">
            글로벌 자산 대시보드
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xl font-medium tracking-wide transition-colors duration-500">
            실시간 행동 데이터 거래 현황
          </p>
        </div>
        <div className="flex gap-3 bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl p-2 rounded-full border border-white/60 dark:border-white/[0.08] shadow-lg dark:shadow-2xl transition-colors duration-500">
          {['가사 노동', '정밀 제조', '전문 서비스'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-[0_0_15px_rgba(15,23,42,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 벤토 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        
        {/* 전체 자산 개요 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-widest uppercase mb-3 transition-colors">총 등록 자산</h3>
            <p className="text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white transition-colors">12,482</p>
          </div>
          <div className="mt-16">
            <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-widest uppercase mb-3 transition-colors">24시간 거래량 (토큰)</h3>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-extrabold tracking-tighter text-green-600 dark:text-green-400 transition-colors">2.4M</p>
              <span className="text-sm font-bold text-green-700 dark:text-green-400/80 bg-green-100 dark:bg-green-400/10 px-3 py-1 rounded-full border border-green-200 dark:border-green-400/20 transition-colors">+14.2%</span>
            </div>
          </div>
        </div>

        {/* 추상적 모션 와이어프레임 */}
        <div className="bento-card bento-card-interactive p-0 col-span-1 md:col-span-2 relative h-[380px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-black/40 to-transparent z-0 transition-colors duration-500"></div>
          <div className="absolute inset-0 wireframe-grid opacity-40 dark:opacity-40 z-0"></div>
          
          <div className="relative w-64 h-64 animate-wireframe-spin z-10">
            <div className="absolute top-0 left-1/2 w-5 h-5 bg-primary rounded-full data-node -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(59,130,246,0.6)] dark:shadow-[0_0_30px_rgba(59,130,246,0.9)]"></div>
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full data-node -translate-x-1/2 translate-y-1/2 shadow-[0_0_15px_rgba(168,85,247,0.6)] dark:shadow-[0_0_20px_rgba(168,85,247,0.9)]"></div>
            <div className="absolute top-1/2 left-0 w-4 h-4 bg-cyan-400 rounded-full data-node -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,211,238,0.6)] dark:shadow-[0_0_20px_rgba(34,211,238,0.9)]"></div>
            <div className="absolute top-1/2 right-0 w-6 h-6 bg-blue-400 rounded-full data-node translate-x-1/2 -translate-y-1/2 shadow-[0_0_25px_rgba(96,165,250,0.6)] dark:shadow-[0_0_35px_rgba(96,165,250,0.9)]"></div>
            
            <div className="absolute top-0 left-1/2 h-full w-[2px] bg-gradient-to-b from-primary via-transparent to-purple-500 opacity-60 dark:opacity-80"></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-transparent to-blue-400 opacity-60 dark:opacity-80"></div>
            
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-slate-300 dark:border-white/[0.15] rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-44 h-44 border border-slate-200 dark:border-white/[0.05] rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"></div>
          </div>
          
          <div className="absolute bottom-8 left-10 flex items-center gap-3 z-20 bg-white/60 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-white/10 transition-colors duration-500">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] dark:shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-bold tracking-widest font-mono">실시간_데이터_스트림 :: 동기화_완료</p>
          </div>
        </div>

        {/* 예상 수익 시뮬레이터 (추가된 부분) */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 col-span-1 md:col-span-3">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* 좌측 입력 영역 */}
            <div className="w-full lg:w-[45%] space-y-10">
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors mb-3">예상 수익 시뮬레이터</h3>
                <p className="text-slate-500 dark:text-gray-400 font-medium">나의 물리적 행동 데이터를 제공하고 획득할 수 있는 KNT 보상을 미리 계산해보세요.</p>
              </div>
              
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300">주간 가사 노동 데이터 제공 시간</label>
                  <span className="text-2xl font-extrabold text-primary">{주간제공시간} 시간</span>
                </div>
                {/* 커스텀 슬라이더 스타일 */}
                <input 
                  type="range" 
                  min="1" max="40" 
                  value={주간제공시간}
                  onChange={(e) => set주간제공시간(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 dark:bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-primary outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-gray-500">
                  <span>1 시간</span>
                  <span>40 시간 (최대)</span>
                </div>
              </div>

              <div className="space-y-5">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300">데이터 제공 숙련도</label>
                <div className="flex bg-slate-100 dark:bg-white/[0.03] rounded-full p-1.5 border border-slate-200 dark:border-white/[0.05] transition-colors">
                  {['초급', '중급', '장인'].map(level => (
                    <button
                      key={level}
                      onClick={() => set숙련도(level)}
                      className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                        숙련도 === level
                        ? 'bg-white dark:bg-white/10 text-primary shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측 결과 영역 */}
            <div className="w-full lg:w-[55%] bg-slate-50 dark:bg-black/20 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/[0.05] flex flex-col justify-center shadow-inner transition-colors duration-500 relative overflow-hidden">
              {/* 은은한 빛 효과 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="mb-10 relative z-10">
                <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-3">예상 월간 획득 토큰</p>
                <div className="flex items-end gap-3">
                  <p className="text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tighter transition-colors">{월간예상토큰.toLocaleString()}</p>
                  <span className="text-2xl font-extrabold text-primary mb-2">KNT</span>
                </div>
              </div>
              <div className="pt-10 border-t border-slate-200 dark:border-white/[0.08] relative z-10 transition-colors">
                <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-3">예상 원화 수익 (1 KNT = 1,200 KRW 기준)</p>
                <div className="flex items-end gap-3">
                  <p className="text-5xl font-extrabold text-green-600 dark:text-green-400 tracking-tighter transition-colors">₩ {월간예상원화.toLocaleString()}</p>
                  <span className="text-xl font-bold text-slate-400 dark:text-gray-500 mb-1 transition-colors">KRW</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 인기 자산 랭킹 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 col-span-1 md:col-span-3">
          <div className="flex justify-between items-end mb-10">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">인기 자산 ({activeCategory})</h3>
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-900 dark:hover:border-white pb-1">
              전체 보기 &rarr;
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-white/[0.08] transition-colors">
                  <th className="pb-6 px-4">자산명</th>
                  <th className="pb-6 px-4">저작권자 (장인)</th>
                  <th className="pb-6 px-4">스펙 (자유도 / 주파수)</th>
                  <th className="pb-6 px-4 text-right">트랜잭션 수</th>
                  <th className="pb-6 px-4 text-right">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] transition-colors">
                {mockAssets.filter(a => a.category === activeCategory).map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => onNavigate('assetDetail', asset)}>
                    <td className="py-7 px-4 text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">{asset.name}</td>
                    <td className="py-7 px-4 text-sm font-mono text-slate-500 dark:text-gray-400 font-medium transition-colors">{asset.artisan}</td>
                    <td className="py-7 px-4 text-sm font-medium text-slate-700 dark:text-gray-300 transition-colors">
                      <span className="text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-1 rounded transition-colors">{asset.dof} 축</span> 
                      <span className="text-slate-300 dark:text-white/20 mx-2 transition-colors">|</span> {asset.hz} Hz
                    </td>
                    <td className="py-7 px-4 text-right font-mono font-bold text-green-600 dark:text-green-400 transition-colors">{asset.transactions.toLocaleString()}</td>
                    <td className="py-7 px-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('assetDetail', asset); }}
                        className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/[0.15] bg-white/80 dark:bg-white/[0.05] text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-300 shadow-sm dark:shadow-lg"
                      >
                        상세 보기
                      </button>
                    </td>
                  </tr>
                ))}
                {mockAssets.filter(a => a.category === activeCategory).length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-400 dark:text-gray-500 font-medium text-lg transition-colors">
                      이 카테고리에는 아직 등록된 자산이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
