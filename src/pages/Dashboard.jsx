import React, { useState, useMemo } from 'react';

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

export default function Dashboard({ onNavigate, userRole }) {
  const [activeCategory, setActiveCategory] = useState('가사 노동');

  // O2O 확장 아코디언 상태
  const [isExtractionOpen, setIsExtractionOpen] = useState(false);
  const [extractionTab, setExtractionTab] = useState('studio');

  // 예상 수익 시뮬레이터 상태
  const [주간제공시간, set주간제공시간] = useState(10);
  const [숙련도, set숙련도] = useState('중급');

  // 민팅 완료 토스트 알림용 임시 상태
  const [isMinting, setIsMinting] = useState(false);

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
      alert('데이터 토큰화가 성공적으로 완료되었습니다! 지갑으로 KNT 보상이 전송됩니다.');
    }, 1500);
  };

  // -------------------------------------------------------------
  // [1] 데이터 공급자(Provider) 뷰 렌더링
  // -------------------------------------------------------------
  if (userRole === 'provider') {
    return (
      <div className="space-y-10 animate-fade-in transition-colors duration-500 pb-20">
        
        {/* 공급자 헤더 섹션 */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent transition-colors duration-500">
            나의 행동 데이터 가치화
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xl font-medium tracking-wide transition-colors duration-500">
            당신의 일상적인 움직임이 블록체인 상의 자산이 됩니다.
          </p>
        </div>

        {/* 1단계: 예상 수익 시뮬레이터 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(59,130,246,0.6)]">1</div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">예상 수익 시뮬레이터</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* 좌측 입력 영역 */}
            <div className="w-full lg:w-[45%] space-y-10">
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300">주간 가사 노동 데이터 제공 시간</label>
                  <span className="text-2xl font-extrabold text-primary">{주간제공시간} 시간</span>
                </div>
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

        {/* 2단계: 데이터 추출 예약 (O2O) */}
        <div>
          <div 
            onClick={() => setIsExtractionOpen(!isExtractionOpen)}
            className="bento-card bento-card-interactive p-8 md:p-10 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group border-2 border-transparent hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-cyan-400 opacity-80"></div>
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(168,85,247,0.6)]">2</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors mb-2">데이터 추출용 정밀 장비 예약</h3>
                <p className="text-slate-500 dark:text-gray-400 font-medium">인증된 오프라인 스튜디오를 방문하거나 자택으로 모션 캡처 키트를 대여해 보세요.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-lg transition-all duration-300 shadow-[0_10px_20px_rgba(15,23,42,0.2)] dark:shadow-[0_10px_20px_rgba(255,255,255,0.2)] group-hover:-translate-y-1">
              {isExtractionOpen ? '예약 닫기 \u2191' : '스케줄 확인하기 \u2193'}
            </button>
          </div>

          {isExtractionOpen && (
            <div className="bento-card mt-6 p-10 md:p-14 animate-fade-in border-t-4 border-t-purple-500 rounded-t-none">
              <div className="flex gap-4 mb-10 border-b border-slate-200 dark:border-white/[0.08] pb-4 transition-colors">
                <button 
                  onClick={() => setExtractionTab('studio')}
                  className={`text-lg font-extrabold px-6 py-3 rounded-t-xl transition-all duration-300 relative ${extractionTab === 'studio' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'}`}
                >
                  스튜디오 방문 예약
                  {extractionTab === 'studio' && <div className="absolute bottom-[-16px] left-0 w-full h-1 bg-purple-500 rounded-full"></div>}
                </button>
                <button 
                  onClick={() => setExtractionTab('rental')}
                  className={`text-lg font-extrabold px-6 py-3 rounded-t-xl transition-all duration-300 relative ${extractionTab === 'rental' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'}`}
                >
                  자택 장비 대여 (O2O)
                  {extractionTab === 'rental' && <div className="absolute bottom-[-16px] left-0 w-full h-1 bg-purple-500 rounded-full"></div>}
                </button>
              </div>

              {extractionTab === 'studio' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
                  <div className="space-y-8">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-3">인증 거점 스튜디오 선택</label>
                      <div className="relative">
                        <select className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer">
                          <option value="seoul-gangnam" className="text-slate-900">서울 강남 본점 (Vicon 프리미엄 장비)</option>
                          <option value="seoul-hongdae" className="text-slate-900">서울 홍대점 (OptiTrack 최신 장비)</option>
                          <option value="busan-centum" className="text-slate-900">부산 센텀점 (혼합 모션 캡처 지원)</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-3">방문 날짜 예약 (향후 7일)</label>
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {dates.map((d, idx) => (
                          <button key={idx} className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white/50 dark:bg-white/[0.02] hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                            <span className="text-sm font-bold text-slate-500 dark:text-gray-400 mb-1">{days[d.getDay()]}요일</span>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{d.getDate()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/[0.05] flex flex-col justify-between shadow-inner">
                    <div>
                       <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                         <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                         스튜디오 방문 안내
                       </h4>
                       <ul className="text-slate-600 dark:text-gray-400 font-medium space-y-4 text-base">
                         <li className="flex items-start gap-3"><span className="text-purple-500 mt-1">✓</span> 예약된 시간 10분 전까지 스튜디오에 도착해 주세요.</li>
                         <li className="flex items-start gap-3"><span className="text-purple-500 mt-1">✓</span> 행동 캡처에 방해되지 않는 복장을 권장합니다.</li>
                       </ul>
                    </div>
                    <button className="w-full mt-10 py-5 rounded-full bg-purple-600 text-white font-extrabold text-lg hover:bg-purple-700 transition-all shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:-translate-y-1">
                      예약 확정하기
                    </button>
                  </div>
                </div>
              )}

              {extractionTab === 'rental' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">배송지 주소 (도로명)</label>
                      <input type="text" placeholder="예: 서울특별시 강남구 테헤란로 123" className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">상세 주소</label>
                          <input type="text" placeholder="동 / 호수 등" className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-500 transition-colors" />
                       </div>
                       <div>
                          <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">대여 기간 선택</label>
                          <div className="relative">
                            <select className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer">
                              <option value="3" className="text-slate-900">3일 (기본 패키지)</option>
                              <option value="7" className="text-slate-900">7일 (심화 패키지)</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/[0.05] flex flex-col justify-between shadow-inner">
                    <div>
                       <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                         <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                         장비 대여 유의사항
                       </h4>
                       <ul className="text-slate-600 dark:text-gray-400 font-medium space-y-4 text-base">
                         <li className="flex items-start gap-3"><span className="text-purple-500 mt-1">✓</span> 전용 앱을 통해 누구나 자가 캘리브레이션이 가능합니다.</li>
                       </ul>
                    </div>
                    <button className="w-full mt-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-lg transition-all shadow-[0_10px_20px_rgba(15,23,42,0.2)] dark:shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                      배송 요청하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3단계: 거대한 민팅(Minting) CTA 벤토 카드 - 파일 드래그 앤 드롭 내장 */}
        <div className="bento-card bento-card-interactive p-10 md:p-14 relative overflow-hidden group border-2 border-transparent hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-cyan-400/10"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.6)]">3</div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">추출 완료된 데이터 업로드 및 토큰화</h3>
          </div>
          <p className="text-slate-500 dark:text-gray-400 font-medium mb-12 text-lg">오프라인 스튜디오나 대여 장비로 수집한 원본 행동 데이터를 블록체인 상의 고유 자산(NFT)으로 발행합니다.</p>
          
          <div className="space-y-10 relative z-10">
            
            {/* 드래그 앤 드롭 파일 업로드 영역 */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-3 uppercase tracking-wider">데이터 원본 파일 첨부</label>
              <div className="w-full border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 cursor-pointer group/dropzone">
                <div className="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center mb-6 group-hover/dropzone:scale-110 group-hover/dropzone:bg-cyan-200 dark:group-hover/dropzone:bg-cyan-800/50 transition-all shadow-inner">
                  <span className="text-4xl text-cyan-600 dark:text-cyan-400">📥</span>
                </div>
                <p className="text-slate-800 dark:text-white font-extrabold text-xl mb-2 transition-colors">추출 완료된 원본 파일(.bvh, .csv)을 끌어다 놓으세요</p>
                <p className="text-slate-500 dark:text-gray-400 font-medium">클릭하여 내 컴퓨터에서 파일 찾기 (최대 500MB)</p>
              </div>
            </div>

            {/* 상세 입력 폼 */}
            <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200 dark:border-white/[0.05] shadow-inner space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">데이터 제목 (Asset Name)</label>
                <input 
                  type="text" 
                  placeholder="예: 정밀 요리 칼질 데이터 (당근 채썰기)" 
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors shadow-sm" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">카테고리 분류</label>
                  <div className="relative">
                    <select className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors appearance-none cursor-pointer shadow-sm">
                      <option className="text-slate-900 dark:text-white bg-white dark:bg-black">가사 노동</option>
                      <option className="text-slate-900 dark:text-white bg-white dark:bg-black">정밀 제조</option>
                      <option className="text-slate-900 dark:text-white bg-white dark:bg-black">전문 서비스</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2">총 수집 시간 (Duration)</label>
                  <input 
                    type="text" 
                    placeholder="예: 2.5 시간" 
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.1] rounded-xl p-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors shadow-sm" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleMintSubmit}
                disabled={isMinting}
                className="w-full md:w-auto px-12 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xl hover:brightness-110 transition-all shadow-[0_10px_25px_rgba(6,182,212,0.4)] hover:-translate-y-1 disabled:opacity-50 flex justify-center items-center gap-3"
              >
                {isMinting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    스마트 컨트랙트 기록 중...
                  </>
                ) : (
                  '✨ 데이터 토큰화 (Mint) 진행'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // [2] 데이터 수요자(Buyer) 뷰 렌더링
  // -------------------------------------------------------------
  if (userRole === 'buyer') {
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
