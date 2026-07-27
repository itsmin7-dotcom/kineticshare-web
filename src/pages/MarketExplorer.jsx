import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const FILTER_CATEGORIES = {
  form: [
    { id: 'bipedal', label: '2족 보행' },
    { id: 'quadruped', label: '4족 보행' },
    { id: 'arm', label: '다관절 암' },
    { id: 'drone', label: '드론' },
  ],
  motion: [
    { id: 'locomotion', label: '이동 (Locomotion)' },
    { id: 'grasping', label: '파지 (Grasping)' },
    { id: 'simulation', label: '시뮬레이션' },
  ],
  env: [
    { id: 'ros1', label: 'ROS 1' },
    { id: 'ros2', label: 'ROS 2' },
    { id: 'pytorch', label: 'PyTorch' },
  ]
};

import { mockAssets } from '../data/mockAssets';

export default function MarketExplorer({ role, onNavigate }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 모바일 팝업 시 배경 스크롤 방지
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  // 필터 상태 파싱 유틸
  const getFilterArray = (key) => {
    const param = searchParams.get(key);
    return param ? param.split(',') : [];
  };

  // 체크박스 핸들러 (실시간 URL 동기화)
  const handleFilterToggle = (categoryKey, itemId) => {
    const currentValues = getFilterArray(categoryKey);
    let newValues;

    if (currentValues.includes(itemId)) {
      newValues = currentValues.filter(val => val !== itemId);
    } else {
      newValues = [...currentValues, itemId];
    }

    const newSearchParams = new URLSearchParams(searchParams);
    if (newValues.length > 0) {
      newSearchParams.set(categoryKey, newValues.join(','));
    } else {
      newSearchParams.delete(categoryKey);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  // 실시간 에셋 필터링 로직 (AND 조건 간, 다중 선택 OR 조건)
  const filteredAssets = mockAssets.filter(asset => {
    for (const key of Object.keys(FILTER_CATEGORIES)) {
      const selectedVals = getFilterArray(key);
      if (selectedVals.length > 0) {
        const assetValue = key === 'form' ? asset.type : asset[key];
        if (!selectedVals.includes(assetValue)) return false;
      }
    }
    return true;
  });

  // 개별 필터 항목 카운트 계산
  const getItemCount = (categoryKey, itemId) => {
    return mockAssets.filter(asset => {
      const assetValue = categoryKey === 'form' ? asset.type : asset[categoryKey];
      return assetValue === itemId;
    }).length;
  };

  // 공통 LNB 필터 렌더링 컴포넌트
  const FilterSidebarContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
          데이터셋 필터
        </h2>
        
        {Object.entries(FILTER_CATEGORIES).map(([key, items]) => {
          const selectedItems = getFilterArray(key);
          const title = key === 'form' ? '로봇 형태' : key === 'motion' ? '모션 타입' : '제어 환경';
          
          return (
            <div key={key} className="mb-8">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">{title}</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleFilterToggle(key, item.id)}
                    />
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      selectedItems.includes(item.id)
                        ? 'bg-indigo-500 border-indigo-500 dark:bg-indigo-500 dark:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 dark:bg-[#111115] dark:border-white/10 group-hover:border-indigo-500/50'
                    }`}>
                      {selectedItems.includes(item.id) && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      {item.label}
                      <span className="text-xs text-slate-400 font-normal">({getItemCount(key, item.id)})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 공급자 뷰일 때는 내 에셋(일부)만 렌더링
  const displayAssets = role === 'provider' ? filteredAssets.slice(0, 2) : filteredAssets;

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in relative z-10 min-h-[80vh]">
      
      {/* 상단 헤더 컨텍스트 */}
      <div className="mb-8 md:mb-12 border-b border-slate-200 dark:border-white/[0.05] pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 transition-colors">
          {role === 'provider' ? '데이터 크리에이터 스튜디오' : '글로벌 모션 에셋 마켓'}
        </h1>
        <p className="text-lg text-slate-500 dark:text-gray-400 max-w-2xl font-medium transition-colors">
          {role === 'provider' 
            ? '나의 로봇 궤적 데이터를 등록하고 판매 수익을 창출하세요.' 
            : '검증된 로봇 모션 데이터를 탐색하고 즉시 라이선스를 획득하세요.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* 1. 데스크톱 좌측 LNB (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto hide-scrollbar">
          <div className="bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-white/[0.05] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <FilterSidebarContent />
          </div>
        </aside>

        {/* 2. 메인 뷰 (Grid & Cards) */}
        <main className="flex-1">
          
          {/* 수요자(Consumer) 전용 과거 대시보드 카드 UI 복원 */}
          {role === 'consumer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-10">
              {/* 전체 자산 개요 */}
              <div className="bento-card p-10 md:p-14 col-span-1 flex flex-col justify-between bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/[0.05] rounded-[2.5rem] shadow-sm">
                <div>
                  <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-widest uppercase mb-3 transition-colors">총 등록 자산</h3>
                  <p className="text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white transition-colors">12,482</p>
                </div>
                <div className="mt-16">
                  <h3 className="text-slate-500 dark:text-gray-400 text-sm font-bold tracking-widest uppercase mb-3 transition-colors">24시간 거래량 (KNT)</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-extrabold tracking-tighter text-green-600 dark:text-green-400 transition-colors">2.4M</p>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400/80 bg-green-100 dark:bg-green-400/10 px-3 py-1 rounded-full border border-green-200 dark:border-green-400/20 transition-colors">+14.2%</span>
                  </div>
                </div>
              </div>

              {/* 추상화 모션 데이터 스트림 와이어프레임 */}
              <div className="bento-card p-0 col-span-1 md:col-span-2 relative h-[380px] overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/[0.05] rounded-[2.5rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-black/40 to-transparent z-0 transition-colors duration-500"></div>
                <div className="absolute inset-0 wireframe-grid opacity-40 dark:opacity-40 z-0"></div>
                
                <div className="relative w-64 h-64 animate-wireframe-spin z-10">
                  <div className="absolute top-0 left-1/2 w-5 h-5 bg-indigo-500 rounded-full data-node -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
                  <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full data-node -translate-x-1/2 translate-y-1/2 shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-cyan-400 rounded-full data-node -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,211,238,0.6)]"></div>
                  <div className="absolute top-1/2 right-0 w-6 h-6 bg-blue-400 rounded-full data-node translate-x-1/2 -translate-y-1/2 shadow-[0_0_25px_rgba(96,165,250,0.6)]"></div>
                  
                  <div className="absolute top-0 left-1/2 h-full w-[2px] bg-gradient-to-b from-indigo-500 via-transparent to-purple-500 opacity-60"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-transparent to-blue-400 opacity-60"></div>
                  
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-slate-300 dark:border-white/[0.15] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-44 h-44 border border-slate-200 dark:border-white/[0.05] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="absolute bottom-8 left-10 flex items-center gap-3 z-20 bg-white/60 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 font-bold tracking-widest font-mono">실시간 데이터 스트림 :: 동기화 완료</p>
                </div>
              </div>
            </div>
          )}

          {/* 공급자(Provider) 전용 스튜디오 UI 복원 */}
          {role === 'provider' && (
            <div className="mb-12">
              <div className="flex justify-end mb-10">
                <button className="px-10 py-5 rounded-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600 text-white font-black text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                  <span className="text-3xl font-normal leading-none relative z-10">+</span> 
                  <span className="relative z-10">새 로봇 궤적 데이터 업로드</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-xl relative overflow-hidden group transition-all duration-500 hover:border-blue-500/50">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner relative z-10">📦</div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">내가 등록한 데이터</p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white mt-auto relative z-10">2 <span className="text-xl text-slate-400 font-bold ml-1">개</span></p>
                </div>
                
                <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-xl relative overflow-hidden group transition-all duration-500 hover:border-green-500/50">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-green-500/10 rounded-full blur-[50px] group-hover:bg-green-500/20 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
                  <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-inner relative z-10">💎</div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">누적 판매 수익</p>
                  <p className="text-5xl font-black text-green-600 dark:text-green-400 mt-auto relative z-10">14,250 <span className="text-xl font-bold text-green-700/50 dark:text-green-500/50 ml-1">KNT</span></p>
                </div>
                
                <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col shadow-xl relative overflow-hidden group transition-all duration-500 hover:border-amber-500/50">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px] group-hover:bg-amber-500/20 transition-colors duration-500"></div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-inner relative z-10">⏳</div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">승인 대기 중</p>
                  <p className="text-5xl font-black text-amber-500 dark:text-amber-400 mt-auto relative z-10">1 <span className="text-xl text-slate-400 font-bold text-amber-600/50 dark:text-amber-500/50 ml-1">건</span></p>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-16 mb-8 flex items-center gap-4">
                <div className="w-2.5 h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                내 데이터 자산 관리
              </h3>
            </div>
          )}

          {displayAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/50 dark:bg-white/[0.02] rounded-3xl border border-slate-200 dark:border-white/[0.05]">
              <span className="text-5xl mb-4 block opacity-50">🔍</span>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">조건에 맞는 에셋이 없습니다.</h3>
              <p className="text-slate-500 mt-2">필터를 해제하거나 다른 카테고리를 선택해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayAssets.map(asset => (
                <div 
                  key={asset.id}
                  onClick={() => navigate(`/asset/${asset.id}`)}
                  className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-6 group hover:border-indigo-500/50 hover:shadow-2xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {asset.name}
                  </h3>
                  
                  {/* 추가된 메타데이터 칩(Badge) 영역 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-black tracking-wider px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800/50 shadow-sm">
                      DoF: {asset.dof}
                    </span>
                    <span className="text-[10px] font-black tracking-wider px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md border border-purple-200 dark:border-purple-800/50 shadow-sm">
                      Hz: {asset.hz}
                    </span>
                    <span className="text-[10px] font-black tracking-wider px-2 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 rounded-md border border-slate-200 dark:border-white/20 uppercase shadow-sm">
                      {asset.env}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2 leading-relaxed font-medium">
                    {asset.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-900 dark:text-green-400">
                      <span>{asset.price}</span>
                      <span className="text-[10px] text-slate-400">KNT</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/asset/${asset.id}`);
                      }}
                      className="text-xs font-bold px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {role === 'provider' ? '관리 / 수정' : '구매'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 3. 모바일 전용 플로팅 필터 버튼 (FAB) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_10px_20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:scale-105 transition-all"
        >
          <span className="text-2xl">⚡</span>
        </button>
      </div>

      {/* 4. 모바일 필터 팝업 (Drawer / Bottom Sheet) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end lg:hidden">
          {/* 어두운 배경 (클릭 시 닫힘) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>
          
          {/* 바텀 시트 컨텐츠 영역 */}
          <div className="relative w-full bg-white dark:bg-[#0f0f13] rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">필터 설정</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <FilterSidebarContent />

            {/* 적용(닫기) 버튼 */}
            <div className="sticky bottom-0 pt-6 mt-8 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f0f13]">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-500/30"
              >
                필터 적용 완료 ({Array.from(searchParams.keys()).length}개 항목)
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
