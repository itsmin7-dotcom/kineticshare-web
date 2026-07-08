import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const mockBounties = [
  { id: 'bty-001', title: '테슬라 옵티머스 2세대 과일 깎기 동작', hardware: 'Tesla Optimus Gen 2', reward: 5500, deadline: '2026-08-01', status: 'OPEN', description: '사과와 배를 깎는 미세 손가락 제어(27 DoF 이상) 궤적 데이터가 필요합니다.' },
  { id: 'bty-002', title: 'Unitree H1 계단 오르기 알고리즘 보완용', hardware: 'Unitree H1', reward: 3200, deadline: '2026-07-20', status: 'OPEN', description: '경사도 30도 이상의 계단을 오를 때의 동적 평형 유지 관절 데이터 수배.' },
  { id: 'bty-003', title: 'Figure 01 커피 머신 조작', hardware: 'Figure 01', reward: 4800, deadline: '2026-07-25', status: 'OPEN', description: '에스프레소 머신 포터필터 장착 및 다이얼 조작 세밀 동작 세트.' }
];

export default function BountyBoard({ userRole }) {
  const [bounties, setBounties] = useState(mockBounties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBounty = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      alert('신규 바운티 의뢰가 성공적으로 등록되었습니다.');
    }, 1500);
  };

  // [1] 검증자(Validator) 예외 처리 뷰
  if (userRole === 'validator') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-10">
        <div className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-2xl p-16 rounded-[3rem] border border-slate-200 dark:border-white/[0.05] shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col items-center text-center max-w-xl w-full">
          <div className="w-24 h-24 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <span className="text-5xl">🛡️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">접근 제한됨</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
            검증자 노드는 바운티 의뢰 및 수주에 직접 참여할 수 없습니다.<br/>
            대시보드에서 데이터 품질 심사에 집중해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20 relative z-10">
      
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-500/30 font-extrabold uppercase tracking-widest">
              REVERSE BOUNTY
            </span>
            <span className="text-sm font-bold text-slate-500 dark:text-gray-400">맞춤형 데이터 의뢰소</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            바운티 게시판
          </h1>
        </div>

        {/* 수요자(Buyer) 뷰: 신규 의뢰 작성 CTA 버튼 */}
        {userRole === 'buyer' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-lg hover:brightness-110 transition-all shadow-[0_10px_20px_rgba(147,72,234,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 text-2xl font-normal leading-none">+</span> 
            <span className="relative z-10">신규 맞춤형 데이터 의뢰</span>
          </button>
        )}
      </div>

      {/* 수요자 모달 폼 (React Portal) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" style={{ WebkitTransform: 'translateZ(0)' }}>
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all duration-500 animate-fade-in" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-3xl border border-white/50 dark:border-white/[0.08] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.9)] p-10 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">신규 바운티 의뢰 등록</h2>
            
            <form onSubmit={handleCreateBounty} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">바운티 제목</label>
                <input type="text" required placeholder="예: Unitree H1용 문 열기 동작 데이터" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">타겟 로봇 기종</label>
                  <select className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors appearance-none">
                    <option value="tesla">Tesla Optimus Gen 2</option>
                    <option value="unitree">Unitree H1</option>
                    <option value="figure">Figure 01</option>
                    <option value="other">기타 커스텀 하드웨어</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">현상금 규모 (KNT)</label>
                  <input type="number" required min="100" placeholder="5000" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-mono font-bold transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">필요 모션 상세 설명</label>
                <textarea required rows="4" placeholder="데이터 수집 환경 및 필수 충족 요건을 상세히 기술해주세요." className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors resize-none"></textarea>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">취소</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-full bg-purple-600 text-white font-extrabold text-lg hover:bg-purple-700 transition-all shadow-[0_10px_20px_rgba(147,72,234,0.3)] disabled:opacity-70 disabled:cursor-wait">
                  {isSubmitting ? '스마트 컨트랙트 에스크로 등록 중...' : '바운티 게시 및 예치'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 바운티 리스트 영역 (공급자/수요자 공통 뷰) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bounties.map((bounty) => (
          <div key={bounty.id} className="bento-card bento-card-interactive p-8 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-primary/20 text-blue-600 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-primary/30 font-extrabold shadow-sm transition-colors">
                  {bounty.hardware}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  마감: {bounty.deadline}
                </span>
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {bounty.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6">
                {bounty.description}
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] transition-colors">
              <div className="flex justify-between items-end mb-6">
                <p className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">현상금</p>
                <p className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {bounty.reward.toLocaleString()} <span className="text-sm text-slate-500 font-bold">KNT</span>
                </p>
              </div>

              {/* 공급자(Provider) 뷰: 의뢰 수락 버튼 노출 */}
              {userRole === 'provider' ? (
                <button className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-sm hover:bg-slate-800 dark:hover:bg-gray-200 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <span>🚀</span> 의뢰 수락 및 납품
                </button>
              ) : (
                <button disabled className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-extrabold text-sm border border-slate-200 dark:border-white/5 cursor-not-allowed">
                  현재 진행 중인 의뢰
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
