import React, { useState, useEffect, useRef } from 'react';

export default function AssetDetail({ asset, onBack }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [time, setTime] = useState(0);

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(playbackSpeed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    speedRef.current = playbackSpeed;
  }, [isPlaying, playbackSpeed]);

  // RequestAnimationFrame을 활용한 60fps 정밀 좌표 동기화 (Kinematic Chain)
  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isPlayingRef.current) {
        setTime((prevTime) => prevTime + dt * speedRef.current);
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!asset) return null;

  // 수학적 기구학(Kinematics) 기반 궤적 계산
  const f = time * 3; // 기본 진동 주파수

  // 기본 스켈레톤 노드 좌표
  const headY = -100;
  const shoulderY = -50;
  const pelvisY = 60;

  // 1. 오른팔 (Right Arm)
  const rArmL1 = 80; // 상박
  const rArmL2 = 70; // 하박
  const rShoulderAngle = Math.sin(f) * 0.8;
  const rElbowRel = Math.min(0, Math.cos(f)) * 1.5; // 팔꿈치는 안쪽으로만 굽힘
  
  const rElbowX = rArmL1 * Math.sin(rShoulderAngle);
  const rElbowY = shoulderY + rArmL1 * Math.cos(rShoulderAngle);
  const rHandX = rElbowX + rArmL2 * Math.sin(rShoulderAngle + rElbowRel);
  const rHandY = rElbowY + rArmL2 * Math.cos(rShoulderAngle + rElbowRel);

  // 2. 왼팔 (Left Arm)
  const lArmL1 = 80;
  const lArmL2 = 70;
  const lShoulderAngle = -Math.sin(f) * 0.8;
  const lElbowRel = Math.min(0, -Math.cos(f)) * 1.5;

  const lElbowX = lArmL1 * Math.sin(lShoulderAngle);
  const lElbowY = shoulderY + lArmL1 * Math.cos(lShoulderAngle);
  const lHandX = lElbowX + lArmL2 * Math.sin(lShoulderAngle + lElbowRel);
  const lHandY = lElbowY + lArmL2 * Math.cos(lShoulderAngle + lElbowRel);

  // 3. 오른다리 (Right Leg)
  const rLegL1 = 100; // 허벅지
  const rLegL2 = 90;  // 종아리
  const rHipAngle = -Math.sin(f) * 0.8;
  const rKneeRel = Math.max(0, -Math.cos(f)) * 1.8; // 무릎은 바깥(뒤)으로만 굽힘

  const rKneeX = rLegL1 * Math.sin(rHipAngle);
  const rKneeY = pelvisY + rLegL1 * Math.cos(rHipAngle);
  const rFootX = rKneeX + rLegL2 * Math.sin(rHipAngle + rKneeRel);
  const rFootY = rKneeY + rLegL2 * Math.cos(rHipAngle + rKneeRel);

  // 4. 왼다리 (Left Leg)
  const lLegL1 = 100;
  const lLegL2 = 90;
  const lHipAngle = Math.sin(f) * 0.8;
  const lKneeRel = Math.max(0, Math.cos(f)) * 1.8;

  const lKneeX = lLegL1 * Math.sin(lHipAngle);
  const lKneeY = pelvisY + lLegL1 * Math.cos(lHipAngle);
  const lFootX = lKneeX + lLegL2 * Math.sin(lHipAngle + lKneeRel);
  const lFootY = lKneeY + lLegL2 * Math.cos(lHipAngle + lKneeRel);

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto transition-colors duration-500 pb-20">
      
      <button 
        onClick={onBack}
        className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 text-sm font-bold tracking-wide transition-all duration-300 mb-6 group hover:bg-slate-100 dark:hover:bg-white/[0.05] w-fit px-4 py-2 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-white/[0.1]"
      >
        <span className="group-hover:-translate-x-1.5 transition-transform duration-300">&larr;</span> 
        대시보드로 돌아가기
      </button>

      {/* 키네틱 데이터 프리뷰어 영역 (동적 좌표 바인딩 적용) */}
      <div className="relative w-full h-[450px] md:h-[550px] bg-[#050505] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-800 dark:border-white/[0.08] mb-12 flex items-center justify-center group">
        
        {/* 사이버틱 배경 캔버스 그리드 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:30px_30px] opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        
        {/* SVG 애니메이션 캔버스 (Kinematic Chain) */}
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute z-10">
          <defs>
            {/* 은은한 네온 글로우 섀도우 필터 */}
            <filter id="neonGlowBlue" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="neonGlowPurple" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neonGlowCyan" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <g transform="translate(400, 250)">
            
            {/* 백그라운드 레이어 (왼쪽 팔/다리 - 약간 투명하고 얇게 처리하여 깊이감 조성) */}
            <g opacity="0.6">
              {/* 왼쪽 다리 뼈대 */}
              <line x1="0" y1={pelvisY} x2={lKneeX} y2={lKneeY} stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#neonGlowPurple)" />
              <line x1={lKneeX} y1={lKneeY} x2={lFootX} y2={lFootY} stroke="#c084fc" strokeWidth="4" strokeLinecap="round" filter="url(#neonGlowPurple)" />
              {/* 왼쪽 다리 관절 */}
              <circle cx={lKneeX} cy={lKneeY} r="5" fill="#f3e8ff" filter="url(#neonGlowPurple)" />
              <circle cx={lFootX} cy={lFootY} r="4" fill="#f3e8ff" filter="url(#neonGlowPurple)" />

              {/* 왼쪽 팔 뼈대 */}
              <line x1="0" y1={shoulderY} x2={lElbowX} y2={lElbowY} stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" filter="url(#neonGlowCyan)" />
              <line x1={lElbowX} y1={lElbowY} x2={lHandX} y2={lHandY} stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlowCyan)" />
              {/* 왼쪽 팔 관절 */}
              <circle cx={lElbowX} cy={lElbowY} r="4" fill="#cffafe" filter="url(#neonGlowCyan)" />
              <circle cx={lHandX} cy={lHandY} r="3" fill="#cffafe" filter="url(#neonGlowCyan)" />
            </g>

            {/* 몸통 (척추) */}
            <line x1="0" y1={shoulderY} x2="0" y2={pelvisY} stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" filter="url(#neonGlowBlue)" />
            <line x1="0" y1={shoulderY} x2="0" y2={headY + 15} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" filter="url(#neonGlowBlue)" opacity="0.5" />
            
            {/* 코어 관절 (어깨, 골반, 머리) */}
            <circle cx="0" cy={shoulderY} r="8" fill="#eff6ff" filter="url(#neonGlowBlue)" />
            <circle cx="0" cy={pelvisY} r="8" fill="#eff6ff" filter="url(#neonGlowBlue)" />
            <circle cx="0" cy={headY} r="14" fill="#eff6ff" filter="url(#neonGlowBlue)" />

            {/* 포그라운드 레이어 (오른쪽 팔/다리 - 진하고 두껍게) */}
            <g opacity="1">
              {/* 오른쪽 다리 뼈대 */}
              <line x1="0" y1={pelvisY} x2={rKneeX} y2={rKneeY} stroke="#a855f7" strokeWidth="8" strokeLinecap="round" filter="url(#neonGlowPurple)" />
              <line x1={rKneeX} y1={rKneeY} x2={rFootX} y2={rFootY} stroke="#c084fc" strokeWidth="6" strokeLinecap="round" filter="url(#neonGlowPurple)" />
              {/* 오른쪽 다리 관절 */}
              <circle cx={rKneeX} cy={rKneeY} r="7" fill="#ffffff" filter="url(#neonGlowPurple)" />
              <circle cx={rFootX} cy={rFootY} r="6" fill="#ffffff" filter="url(#neonGlowPurple)" />

              {/* 오른쪽 팔 뼈대 */}
              <line x1="0" y1={shoulderY} x2={rElbowX} y2={rElbowY} stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" filter="url(#neonGlowCyan)" />
              <line x1={rElbowX} y1={rElbowY} x2={rHandX} y2={rHandY} stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#neonGlowCyan)" />
              {/* 오른쪽 팔 관절 */}
              <circle cx={rElbowX} cy={rElbowY} r="6" fill="#ffffff" filter="url(#neonGlowCyan)" />
              <circle cx={rHandX} cy={rHandY} r="5" fill="#ffffff" filter="url(#neonGlowCyan)" />
            </g>

          </g>
        </svg>

        {/* 상단 뱃지 표시 */}
        <div className="absolute top-6 left-6 z-20 flex gap-3">
           <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono font-bold text-white shadow-lg">
             KINETIC ENGINE V2
           </div>
           <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono font-bold text-green-400 shadow-lg flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             LIVE TRACKING
           </div>
        </div>

        {/* 하단 글래스모피즘 컨트롤러 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 dark:bg-white/10 backdrop-blur-2xl border border-white/20 p-2.5 rounded-full flex items-center gap-3 z-20 shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`w-14 h-14 flex items-center justify-center rounded-full font-extrabold shadow-xl transition-all duration-300 ${isPlaying ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10' : 'bg-primary text-white hover:bg-blue-600 shadow-[0_0_25px_rgba(59,130,246,0.8)] border border-blue-400'}`}
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          
          <div className="w-px h-10 bg-white/20 mx-1"></div>
          
          <div className="flex bg-black/40 rounded-full p-1 border border-white/10 shadow-inner">
            {[0.5, 1, 2].map(speed => (
              <button 
                key={speed} 
                onClick={() => setPlaybackSpeed(speed)} 
                className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 ${playbackSpeed === speed ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 'text-white/60 hover:text-white hover:bg-white/20'}`}
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
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 dark:bg-purple-600/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-500"></div>

          <h3 className="text-3xl font-extrabold mb-12 flex items-center gap-4 relative z-10 text-slate-900 dark:text-white transition-colors">
            <div className="w-2.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)] dark:shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
            로열티 분배율
          </h3>
          
          <div className="flex-1 flex flex-col justify-center gap-10 relative z-10">
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
