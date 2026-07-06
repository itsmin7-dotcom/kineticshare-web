import React, { useState } from 'react';

export default function AssetDetail({ asset, onBack }) {
  // 프리뷰어 애니메이션 컨트롤 상태
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  if (!asset) return null;

  // 인라인 스타일: 애니메이션 상태 제어
  const animationStyle = {
    animationPlayState: isPlaying ? 'running' : 'paused',
    animationDuration: `${3 / playbackSpeed}s` // 기본 3초를 기준 배속으로 분할
  };

  const reverseAnimationStyle = {
    animationPlayState: isPlaying ? 'running' : 'paused',
    animationDuration: `${4 / playbackSpeed}s` // 기본 4초
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto transition-colors duration-500 pb-20">
      
      <button 
        onClick={onBack}
        className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 text-sm font-bold tracking-wide transition-all duration-300 mb-6 group hover:bg-slate-100 dark:hover:bg-white/[0.05] w-fit px-4 py-2 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-white/[0.1]"
      >
        <span className="group-hover:-translate-x-1.5 transition-transform duration-300">&larr;</span> 
        대시보드로 돌아가기
      </button>

      {/* 키네틱 데이터 프리뷰어 영역 */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 dark:bg-black rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700/50 dark:border-white/[0.05] mb-12 flex items-center justify-center group">
        
        {/* 사이버틱 배경 격자 무늬 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        
        {/* SVG 애니메이션 캔버스 */}
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute z-10">
          <defs>
            {/* 은은한 네온 글로우 필터 */}
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowPurple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <g transform="translate(400, 250)">
            {/* 코어 중심 (어깨/골반 등 기점) */}
            <circle cx="0" cy="0" r="10" fill="#3b82f6" filter="url(#neonGlow)" className="animate-pulse" />
            
            {/* 오른쪽 팔 뼈대 그룹 */}
            <g className="bone-arm1" style={{...animationStyle, transformOrigin: '0px 0px'}}>
              <line x1="0" y1="0" x2="0" y2="120" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.8" filter="url(#neonGlow)" />
              <circle cx="0" cy="120" r="8" fill="#06b6d4" filter="url(#neonGlow)" />
              
              {/* 오른쪽 하박 뼈대 그룹 */}
              <g className="bone-arm2" style={{...animationStyle, transformOrigin: '0px 120px'}}>
                <line x1="0" y1="120" x2="0" y2="220" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.6" filter="url(#neonGlow)" />
                <circle cx="0" cy="220" r="6" fill="#a855f7" filter="url(#neonGlowPurple)" />
                
                {/* 궤적 패스 애니메이션 */}
                <path d="M 0 220 Q 25 250 -15 280 M 0 220 Q -25 240 10 270" stroke="#a855f7" strokeWidth="2" fill="none" strokeOpacity="0.4" className="bone-hand" style={animationStyle} filter="url(#neonGlowPurple)" />
              </g>
            </g>
            
            {/* 왼쪽 팔 뼈대 그룹 (반대 방향) */}
            <g className="bone-arm1-reverse" style={{...reverseAnimationStyle, transformOrigin: '0px 0px'}}>
              <line x1="0" y1="0" x2="0" y2="-140" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.8" filter="url(#neonGlow)" />
              <circle cx="0" cy="-140" r="8" fill="#06b6d4" filter="url(#neonGlow)" />
              
              {/* 왼쪽 하박 뼈대 그룹 */}
              <g className="bone-arm2-reverse" style={{...reverseAnimationStyle, transformOrigin: '0px -140px'}}>
                  <line x1="0" y1="-140" x2="0" y2="-230" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.6" filter="url(#neonGlow)" />
                  <circle cx="0" cy="-230" r="6" fill="#a855f7" filter="url(#neonGlowPurple)" />
              </g>
            </g>
          </g>
        </svg>

        {/* CSS Keyframes 인라인 삽입 (독립적 구동) */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes swing {
            0% { transform: rotate(-40deg); }
            50% { transform: rotate(50deg); }
            100% { transform: rotate(-40deg); }
          }
          @keyframes swingReverse {
            0% { transform: rotate(50deg); }
            50% { transform: rotate(-60deg); }
            100% { transform: rotate(50deg); }
          }
          @keyframes flexArm {
            0% { transform: rotate(15deg); }
            50% { transform: rotate(110deg); }
            100% { transform: rotate(15deg); }
          }
          @keyframes flexArmReverse {
            0% { transform: rotate(-20deg); }
            50% { transform: rotate(-100deg); }
            100% { transform: rotate(-20deg); }
          }
          @keyframes wiggle {
            0%, 100% { d: path('M 0 220 Q 25 250 -15 280 M 0 220 Q -25 240 10 270'); opacity: 0.8; }
            50% { d: path('M 0 220 Q -35 260 20 270 M 0 220 Q 15 250 -20 260'); opacity: 0.3; }
          }
          
          .bone-arm1 { animation: swing 3s ease-in-out infinite; }
          .bone-arm2 { animation: flexArm 3s ease-in-out infinite; }
          .bone-arm1-reverse { animation: swingReverse 4s ease-in-out infinite; }
          .bone-arm2-reverse { animation: flexArmReverse 4s ease-in-out infinite; }
          .bone-hand { animation: wiggle 3s ease-in-out infinite; }
        `}} />

        {/* 하단 글래스모피즘 컨트롤러 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2.5 rounded-full flex items-center gap-2 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`w-14 h-14 flex items-center justify-center rounded-full font-extrabold shadow-lg transition-all duration-300 ${isPlaying ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.6)]'}`}
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          
          <div className="w-px h-8 bg-white/20 mx-2"></div>
          
          <div className="flex bg-black/20 dark:bg-black/40 rounded-full p-1 border border-white/5">
            {[0.5, 1, 2].map(speed => (
              <button 
                key={speed} 
                onClick={() => setPlaybackSpeed(speed)} 
                className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 ${playbackSpeed === speed ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

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
