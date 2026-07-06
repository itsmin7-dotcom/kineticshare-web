import React from 'react';

export default function AssetDetail({ asset, onBack }) {
  if (!asset) return null;

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto transition-colors duration-500">
      <button 
        onClick={onBack}
        className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 text-sm font-bold tracking-wide transition-all duration-300 mb-6 group hover:bg-slate-100 dark:hover:bg-white/[0.05] w-fit px-4 py-2 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-white/[0.1]"
      >
        <span className="group-hover:-translate-x-1.5 transition-transform duration-300">&larr;</span> 
        대시보드로 돌아가기
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span className="px-4 py-1.5 bg-blue-50 dark:bg-primary/20 text-blue-600 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-primary/30 font-extrabold uppercase tracking-widest shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors">
              {asset.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium bg-white/60 dark:bg-white/[0.05] px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.05] transition-colors">
              ID: {asset.id}
            </span>
          </div>
          <h1 className="text-5xl md:text-[4rem] font-extrabold tracking-tighter leading-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent pb-2 transition-colors">
            {asset.name}
          </h1>
        </div>
        <button className="w-full md:w-auto px-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xl hover:bg-slate-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-[0_10px_20px_rgba(15,23,42,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 transform">
          데이터 라이선스 구매
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        {/* 스펙 테이블 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 col-span-1 lg:col-span-2">
          <h3 className="text-3xl font-extrabold mb-10 flex items-center gap-4 text-slate-900 dark:text-white transition-colors">
            <div className="w-2.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)] dark:shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            기술 스펙 상세
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 group">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-3 transition-colors">데이터 자유도</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">{asset.dof}</p>
                <span className="text-lg text-slate-500 dark:text-gray-400 font-medium mb-1 transition-colors">축</span>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 group">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-3 transition-colors">수집 주파수</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">{asset.hz}</p>
                <span className="text-lg text-slate-500 dark:text-gray-400 font-medium mb-1 transition-colors">Hz</span>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] transition-all duration-300">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-3 transition-colors">사용 센서</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white transition-colors">OptiTrack + IMU</p>
              <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-3 transition-colors">모션 캡처 스위트 V2</p>
            </div>
            <div className="bg-white/50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] transition-all duration-300">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-3 transition-colors">저작권자 (장인)</p>
              <p className="text-2xl font-mono font-bold mt-1 text-primary transition-colors">{asset.artisan}</p>
              <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-3 transition-colors">검증된 라이선스 전문가</p>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-slate-200 dark:border-white/[0.08] transition-colors">
             <h4 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-6 transition-colors">데이터 품질 지표</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-6">
                   <div className="w-32 text-sm font-bold text-slate-600 dark:text-gray-400 tracking-wide transition-colors">지터 (ms)</div>
                   <div className="flex-1 h-2.5 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden border border-slate-300 dark:border-white/[0.05] shadow-inner transition-colors">
                      <div className="h-full bg-green-500 dark:bg-green-400 w-[15%] shadow-[0_0_8px_rgba(34,197,94,0.5)] dark:shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                   </div>
                   <div className="w-16 text-right text-base font-mono font-bold text-green-600 dark:text-green-400 transition-colors">0.2ms</div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-32 text-sm font-bold text-slate-600 dark:text-gray-400 tracking-wide transition-colors">데이터 완전성</div>
                   <div className="flex-1 h-2.5 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden border border-slate-300 dark:border-white/[0.05] shadow-inner transition-colors">
                      <div className="h-full bg-blue-500 dark:bg-blue-400 w-[99.8%] shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                   </div>
                   <div className="w-16 text-right text-base font-mono font-bold text-blue-600 dark:text-blue-400 transition-colors">99.8%</div>
                </div>
             </div>
          </div>
        </div>

        {/* 로열티 분배율 차트 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 col-span-1 flex flex-col relative overflow-hidden">
          {/* 은은한 배경 광원 효과 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 dark:bg-purple-600/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-500"></div>

          <h3 className="text-3xl font-extrabold mb-12 flex items-center gap-4 relative z-10 text-slate-900 dark:text-white transition-colors">
            <div className="w-2.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)] dark:shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
            로열티 분배율
          </h3>
          
          <div className="flex-1 flex flex-col justify-center gap-10 relative z-10">
            {/* CSS 바 차트 */}
            <div className="space-y-10">
              
              <div className="group">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-800 dark:text-white font-bold text-lg transition-colors">장인 (데이터 생산자)</span>
                  <span className="font-mono text-2xl text-primary font-extrabold transition-colors">70%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-black/50 rounded-full h-4 border border-slate-300 dark:border-white/[0.05] overflow-hidden transition-colors">
                  <div className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_15px_rgba(59,130,246,0.8)] group-hover:brightness-110 dark:group-hover:brightness-125 transition-all duration-300" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-800 dark:text-white font-bold text-lg transition-colors">플랫폼 수수료</span>
                  <span className="font-mono text-2xl text-purple-600 dark:text-purple-400 font-extrabold transition-colors">10%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-black/50 rounded-full h-4 border border-slate-300 dark:border-white/[0.05] overflow-hidden transition-colors">
                  <div className="bg-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] dark:shadow-[0_0_15px_rgba(168,85,247,0.8)] group-hover:brightness-110 dark:group-hover:brightness-125 transition-all duration-300" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-800 dark:text-white font-bold text-lg transition-colors">검증자 / 품질 보증</span>
                  <span className="font-mono text-2xl text-cyan-600 dark:text-cyan-400 font-extrabold transition-colors">20%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-black/50 rounded-full h-4 border border-slate-300 dark:border-white/[0.05] overflow-hidden transition-colors">
                  <div className="bg-cyan-500 dark:bg-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] dark:shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:brightness-110 dark:group-hover:brightness-125 transition-all duration-300" style={{ width: '20%' }}></div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/[0.08] relative z-10 transition-colors">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 leading-relaxed transition-colors">
              * 로열티는 라이선스 거래 완료 시 스마트 컨트랙트를 통해 블록체인 네트워크에서 자동 분배됩니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
