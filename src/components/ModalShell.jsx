import React, { useEffect, useRef, useState } from 'react';

export default function ModalShell({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const [topPos, setTopPos] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // 열릴 때 현재 스크롤 위치 기반으로 모달의 최상단 Y좌표 지정
      setTopPos(Math.max(window.scrollY + 50, 50));
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      const handleClickOutside = (e) => {
        // 모달 영역 바깥을 클릭했을 때만 닫기
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      // 이벤트 전파 지연을 위해 setTimeout 사용
      setTimeout(() => window.addEventListener('mousedown', handleClickOutside), 10);
      
      // 모달이 열리면 화면이 모달 중앙으로 스무스하게 스크롤됨
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-[200] bg-white dark:bg-[#111115] rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-2 border-indigo-500/20 dark:border-white/20 flex flex-col animate-slide-up"
      style={{ top: topPos + 'px' }}
    >
      {/* 모달 헤더 */}
      <div className="bg-slate-50 dark:bg-[#0a0a0c] px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between rounded-t-[2rem]">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <button 
          onClick={onClose} 
          className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors shadow-sm"
        >
          <span className="text-slate-500 dark:text-white font-bold text-lg">✕</span>
        </button>
      </div>
      
      {/* 모달 내부 컨텐츠 (스크롤 제한 없음, 내용 모두 출력) */}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}
