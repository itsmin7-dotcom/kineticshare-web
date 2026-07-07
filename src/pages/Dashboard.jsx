import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 테스트용 하드코딩 데이터
const mockAssets = [
  { id: 'dom-001', name: '프리미엄 커피 브루잉', category: '가사 노동', artisan: '0x1A4...9B2', dof: 6, hz: 120, transactions: 1420 },
  { id: 'dom-002', name: '섬세한 식기 세척', category: '가사 노동', artisan: '0x8F2...3C1', dof: 7, hz: 100, transactions: 890 },
  { id: 'dom-003', name: '정밀 의류 개기', category: '가사 노동', artisan: '0x3E1...7A5', dof: 5, hz: 60, transactions: 450 },
  { id: 'mfg-001', name: '정밀 납땜 공정', category: '정밀 제조', artisan: '0x4D5...1E8', dof: 6, hz: 240, transactions: 3100 },
];

// O2O 캘린더용 날짜 계산
const today = new Date();
const dates = Array.from({length: 7}, (_, i) => {
  const d = new Date();
  d.setDate(today.getDate() + i + 1);
  return d;
});
const days = ['일', '월', '화', '수', '목', '금', '토'];

// 나의 보유 자산 및 수익 차트 모의 데이터
const mockChartData = [
  { name: '1일', KNT: 120 },
  { name: '2일', KNT: 310 },
  { name: '3일', KNT: 250 },
  { name: '4일', KNT: 480 },
  { name: '5일', KNT: 600 },
  { name: '6일', KNT: 550 },
  { name: '7일', KNT: 980 },
];

const mockMyAssets = [
  { id: 'dom-001', name: '정밀 요리 칼질 데이터', category: '가사 노동', transactions: 120 },
  { id: 'dom-002', name: '거실 청소 동선', category: '가사 노동', transactions: 340 },
  { id: 'svc-001', name: '숙련된 커피 브루잉', category: '전문 서비스', transactions: 89 },
];

export default function Dashboard({ onNavigate, userRole }) {
  const [activeCategory, setActiveCategory] = useState('가사 노동');

  // 모달 상태
  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const [isMintingModalOpen, setIsMintingModalOpen] = useState(false);
  const [extractionTab, setExtractionTab] = useState('studio');

  // 예상 수익 시뮬레이터 상태
  const [주간제공시간, set주간제공시간] = useState(10);
  const [숙련도, set숙련도] = useState('중급');

  // 민팅 완료 로딩 상태
  const [isMinting, setIsMinting] = useState(false);

  // 모달 오픈 시 브라우저 스크롤 방지
  useEffect(() => {
    if (isExtractionModalOpen || isMintingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExtractionModalOpen, isMintingModalOpen]);

  // 예상 수익 시뮬레이터 계산 로직
  const { 월간예상토큰, 월간예상원화 } = useMemo(() => {
    let 가중치 = 1;
    if (숙련도 === '중급') 가중치 = 2;
    if (숙련도 === '장인') 가중치 = 5;
    
    const 기본시급토큰 = 15;
    const 월간제공시간 = 주간제공시간 * 4;
    const 계산된토큰 = 월간제공시간 * 기본시급토큰 * 가중치;
    
    const 토큰당원화가치 = 1200;
    const 계산된원화 = 계산된토큰 * 토큰당원화가치;

    return { 월간예상토큰: 계산된토큰, 월간예상원화: 계산된원화 };
  }, [주간제공시간, 숙련도]);

  const handleMintSubmit = () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setIsMintingModalOpen(false);
      alert('데이터 토큰화가 성공적으로 완료되었습니다! 지갑으로 KNT 보상이 전송됩니다.');
    }, 1500);
  };

  // -------------------------------------------------------------
  // [1] 데이터 공급자(Provider) 뷰 렌더링
  // -------------------------------------------------------------
  if (userRole === 'provider') {
    return (
      <div className="space-y-10 animate-fade-in transition-colors duration-500 pb-20 relative">
        
        {/* 공급자 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent transition-colors duration-500">
            나의 행동 데이터 가치화
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xl font-medium tracking-wide transition-colors duration-500">
            당신의 일상적인 움직임이 블록체인 상의 자산이 됩니다.
          </p>
        </div>

        {/* 조건부 렌더링 (Empty State vs Main Dashboard) */}
        {mockMyAssets.length === 0 ? (
           // 자산이 0개일 때: 시뮬레이터 메인 노출
           <div className="bento-card bento-card-interactive p-10 md:p-14 relative overflow-hidden text-center flex flex-col items-center">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">첫 데이터 민팅을 시작해보세요!</h2>
              <p className="text-xl text-slate-500 dark:text-gray-400 mb-10">아래 시뮬레이터로 예상 수익을 확인하고 첫 발걸음을 내디뎌 보세요.</p>
              
              <div className="flex gap-4 mb-16">
                 <button 
                   onClick={() => setIsExtractionModalOpen(true)}
                   className="px-8 py-4 rounded-full border border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-extrabold shadow-sm transition-all"
                 >
                   + 데이터 추출 예약
                 </button>
                 <button 
                   onClick={() => setIsMintingModalOpen(true)}
                   className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-lg hover:brightness-110 transition-all hover:-translate-y-1"
                 >
                   ✨ 신규 자산 민팅
                 </button>
              </div>
              {/* 시뮬레이터 본문 (메인 뷰 버전) */}
              <div className="w-full max-w-4xl bg-slate-50 dark:bg-black/20 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/[0.05] shadow-inner text-left">
                {/* ... (생략 가능하나 유저 생애주기에 맞게 미니 렌더링 유지) */}
              </div>
           </div>
        ) : (
           // 자산이 1개 이상일 때: 메인 뷰 (로열티 차트 우선)
           <>
            {/* 1단계: 나의 자산 및 로열티 현황 (최상단 거대 벤토 카드) */}
            <div className="bento-card bento-card-interactive p-10 md:p-12 relative overflow-hidden group border-2 border-transparent hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-purple-500/20"></div>
              
              {/* 카드 헤더 및 퀵 액션 버튼 영역 */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors flex items-center gap-4">
                  <div className="w-2.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)] dark:shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
                  나의 자산 및 로열티 현황
                </h3>
                
                {/* 🌟 퀵 액션 버튼 (프리미엄 네온/글래스모피즘 CTA) */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsExtractionModalOpen(true)}
                    className="relative px-6 py-3.5 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-purple-400/50 text-purple-700 dark:text-purple-300 font-extrabold text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] dark:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group/btn1"
                  >
                    <span className="text-purple-500 text-lg group-hover/btn1:scale-110 transition-transform">+</span> 데이터 추출 예약
                  </button>
                  <button 
                    onClick={() => setIsMintingModalOpen(true)}
                    className="relative px-6 py-3.5 rounded-full font-extrabold text-sm text-white shadow-[0_10px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_30px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all duration-300 group/btn2 overflow-hidden border border-white/20"
                  >
                    {/* 버튼 배경 및 애니메이션 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-90 group-hover/btn2:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn2:animate-shimmer"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-yellow-200">✨</span> 신규 자산 민팅
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 relative z-10">
                {/* 좌측: 누적 수익 Area Chart */}
                <div className="xl:col-span-2 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] p-8 flex flex-col justify-between shadow-inner h-[420px]">
                   <div className="mb-8 flex justify-between items-end">
                     <div>
                       <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-2">최근 7일 KNT 누적 수익</p>
                       <p className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white transition-colors">3,290 <span className="text-2xl font-bold text-primary">KNT</span></p>
                     </div>
                     <div className="px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-base rounded-full border border-green-200 dark:border-green-500/30 shadow-sm">
                       +15.3%
                     </div>
                   </div>
                   
                   <div className="w-full flex-1 min-h-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorKnt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '12px 16px' }} 
                            itemStyle={{ color: '#c084fc', fontWeight: '800', fontSize: '18px' }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                          />
                          <Area type="monotone" dataKey="KNT" stroke="#a855f7" strokeWidth={5} fillOpacity={1} fill="url(#colorKnt)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* 우측: 보유 자산 리스트 (미니) */}
                <div className="xl:col-span-1 bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] border border-slate-200 dark:border-white/[0.05] p-8 shadow-inner flex flex-col h-[420px]">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white transition-colors">발행 완료 자산</h4>
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-slate-200 dark:bg-white/10 px-3 py-1.5 rounded-full">{mockMyAssets.length} 개</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-3 -mr-3">
                    {mockMyAssets.map(asset => (
                      <div key={asset.id} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all group cursor-pointer shadow-sm">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1.5">{asset.category}</p>
                        <p className="font-extrabold text-slate-900 dark:text-white text-[15px] leading-snug mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">{asset.name}</p>
                        <div className="flex justify-between items-end border-t border-slate-100 dark:border-white/10 pt-3">
                          <span className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">누적 판매</span>
                          <span className="text-sm font-mono font-extrabold text-green-600 dark:text-green-400">{asset.transactions} 회</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-6 w-full py-3.5 border border-slate-300 dark:border-white/20 rounded-2xl text-sm font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm hover:shadow-md">
                    자산 갤러리 전체보기
                  </button>
                </div>
              </div>
            </div>

            {/* 2단계 (강등됨): 예상 수익 시뮬레이터 (사이드 위젯 스타일로 가로 배치) */}
            <div className="bento-card p-8 bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/[0.05]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">예상 수익 시뮬레이터</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">추가 데이터 제공에 따른 수익을 확인해보세요.</p>
                </div>
                
                <div className="md:w-1/3 space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-gray-300">주간 가사 노동 시간</label>
                      <span className="text-sm font-extrabold text-primary">{주간제공시간} 시간</span>
                    </div>
                    <input 
                      type="range" min="1" max="40" value={주간제공시간} onChange={(e) => set주간제공시간(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-primary outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex bg-slate-100 dark:bg-white/[0.03] rounded-full p-1 border border-slate-200 dark:border-white/[0.05]">
                    {['초급', '중급', '장인'].map(level => (
                      <button
                        key={level} onClick={() => set숙련도(level)}
                        className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${숙련도 === level ? 'bg-white dark:bg-white/10 text-primary shadow' : 'text-slate-500 dark:text-gray-400'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/3 bg-white dark:bg-black/30 rounded-2xl p-5 border border-slate-200 dark:border-white/[0.05] shadow-inner text-right">
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400 mb-1">예상 획득 토큰 (월)</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">{월간예상토큰.toLocaleString()} <span className="text-sm text-primary">KNT</span></p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">₩ {월간예상원화.toLocaleString()}</p>
                </div>
              </div>
            </div>
           </>
        )}

        {/* -------------------------------------------------------------
            React Portals (팝업 모달 영역)
            ------------------------------------------------------------- */}
        
        {/* [모달 1] 데이터 추출 예약 폼 */}
        {isExtractionModalOpen && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" style={{ WebkitTransform: 'translateZ(0)' }}>
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsExtractionModalOpen(false)}></div>
            <div className="relative w-full max-w-4xl max-h-[90dvh] overflow-y-auto custom-scrollbar bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-3xl border border-white/50 dark:border-white/[0.08] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.9)] p-10 animate-fade-in">
              <button onClick={() => setIsExtractionModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 dark:hover:text-white text-2xl font-bold">&times;</button>
              
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="text-purple-500 text-4xl">+</span> 데이터 추출 예약
              </h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-10">오프라인 스튜디오를 방문하거나 자택으로 모션 캡처 키트를 대여하세요.</p>
              
              <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-white/[0.08] pb-4">
                <button 
                  onClick={() => setExtractionTab('studio')}
                  className={`text-lg font-extrabold px-6 py-2 rounded-t-xl transition-all relative ${extractionTab === 'studio' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-gray-400'}`}
                >
                  스튜디오 방문 예약
                  {extractionTab === 'studio' && <div className="absolute bottom-[-16px] left-0 w-full h-1 bg-purple-500 rounded-full"></div>}
                </button>
                <button 
                  onClick={() => setExtractionTab('rental')}
                  className={`text-lg font-extrabold px-6 py-2 rounded-t-xl transition-all relative ${extractionTab === 'rental' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-gray-400'}`}
                >
                  자택 장비 대여 (O2O)
                  {extractionTab === 'rental' && <div className="absolute bottom-[-16px] left-0 w-full h-1 bg-purple-500 rounded-full"></div>}
                </button>
              </div>

              {/* 스튜디오 탭 */}
              {extractionTab === 'studio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">거점 스튜디오 선택</label>
                      <select className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-4 text-slate-900 dark:text-white focus:border-purple-500 outline-none">
                        <option value="seoul-gangnam" className="text-slate-900">서울 강남 본점</option>
                        <option value="seoul-hongdae" className="text-slate-900">서울 홍대점</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">날짜 예약</label>
                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {dates.map((d, idx) => (
                          <button key={idx} className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border border-slate-200 dark:border-white/[0.1] hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10">
                            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{days[d.getDay()]}</span>
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{d.getDate()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-8 border border-slate-200 dark:border-white/[0.05] flex flex-col justify-between">
                     <ul className="text-slate-600 dark:text-gray-400 font-medium space-y-3 text-sm">
                       <li>✓ 예약 시간 10분 전까지 스튜디오에 도착해 주세요.</li>
                       <li>✓ 행동 캡처에 편안한 복장을 권장합니다.</li>
                     </ul>
                     <button onClick={() => setIsExtractionModalOpen(false)} className="w-full mt-8 py-4 rounded-full bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-lg transition-all hover:-translate-y-1">
                       예약 확정
                     </button>
                  </div>
                </div>
              )}
              {/* 렌탈 탭 생략 (구조 동일) */}
              {extractionTab === 'rental' && (
                <div className="p-10 text-center text-slate-500 dark:text-gray-400 font-medium">대여 폼 구성 준비 중...</div>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* [모달 2] 신규 데이터 민팅 폼 */}
        {isMintingModalOpen && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" style={{ WebkitTransform: 'translateZ(0)' }}>
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => !isMinting && setIsMintingModalOpen(false)}></div>
            <div className="relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto custom-scrollbar bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-3xl border border-cyan-500/30 dark:border-cyan-500/20 rounded-[2.5rem] shadow-[0_30px_80px_rgba(6,182,212,0.15)] dark:shadow-[0_30px_80px_rgba(6,182,212,0.2)] p-10 animate-fade-in">
              <button onClick={() => !isMinting && setIsMintingModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 dark:hover:text-white text-2xl font-bold">&times;</button>
              
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="text-2xl">✨</span> 데이터 업로드 및 토큰화
              </h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-10">오프라인 스튜디오나 대여 장비로 수집한 원본 행동 데이터를 블록체인 상의 고유 자산(NFT)으로 발행합니다.</p>
              
              <div className="space-y-8">
                {/* 드래그 앤 드롭 존 */}
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-3 uppercase tracking-wider">원본 파일 첨부</label>
                  <div className="w-full border-2 border-dashed border-cyan-400/50 dark:border-cyan-500/30 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-cyan-50/50 dark:bg-cyan-900/10 hover:bg-cyan-100/50 dark:hover:bg-cyan-900/20 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">📥</span>
                    </div>
                    <p className="text-slate-800 dark:text-white font-extrabold text-lg mb-1">.bvh, .csv 파일을 끌어다 놓으세요</p>
                    <p className="text-slate-500 dark:text-cyan-200/50 text-sm font-medium">최대 500MB</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">데이터 제목 (Asset Name)</label>
                    <input type="text" placeholder="예: 정밀 요리 칼질 데이터" className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:border-cyan-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">카테고리</label>
                      <select className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:border-cyan-500">
                        <option className="text-slate-900">가사 노동</option>
                        <option className="text-slate-900">정밀 제조</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">수집 시간</label>
                      <input type="text" placeholder="예: 2.5 시간" className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleMintSubmit}
                  disabled={isMinting}
                  className="w-full py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xl hover:brightness-110 shadow-[0_10px_25px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-1 flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {isMinting ? (
                    <><div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> 블록체인 기록 중...</>
                  ) : (
                    '✨ NFT 발행 및 토큰화 완료'
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // [2] 데이터 수요자(Buyer) 뷰 렌더링 (기존 유지)
  // -------------------------------------------------------------
  if (userRole === 'buyer') {
     // ... (코드 생략 방지를 위해 수요자 뷰 원본 유지)
     return (
       <div className="space-y-10 animate-fade-in transition-colors duration-500 pb-20">
         {/* 수요자 헤더 섹션 */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-4">
           <div>
             <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent transition-colors duration-500">
               글로벌 자산 대시보드
             </h1>
             <p className="text-slate-500 dark:text-gray-400 text-xl font-medium tracking-wide transition-colors duration-500">
               블록체인 기반 고품질 실시간 행동 데이터 거래소
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
           
           {/* 인기 자산 랭킹 테이블 */}
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

  return null;
}
