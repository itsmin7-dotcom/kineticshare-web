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

  return (
    <div className="animate-fade-in pb-12">
      
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
          {role === 'provider' ? '📦 공급자 랩 (Lab)' : '🛒 모션 마켓 (Market)'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {role === 'provider' 
            ? '수집한 로봇 데이터를 검증받고 플랫폼에 상장하여 수익을 창출하세요.' 
            : '전 세계 최고 수준의 로봇 관절 모션 데이터를 탐색하고 다운로드하세요.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* 1. 데스크톱 좌측 LNB (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto hide-scrollbar">
          <div className="bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-white/[0.05] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <FilterSidebarContent />
          </div>
        </aside>

        {/* 2. 메인 그리드 뷰 (Grid) */}
        <main className="flex-1">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/50 dark:bg-white/[0.02] rounded-3xl border border-slate-200 dark:border-white/[0.05]">
              <span className="text-5xl mb-4 block opacity-50">🔍</span>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">조건에 맞는 에셋이 없습니다.</h3>
              <p className="text-slate-500 mt-2">필터를 해제하거나 다른 카테고리를 선택해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssets.map(asset => (
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2 leading-relaxed">
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
                      {role === 'provider' ? '관리' : '구매'}
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
