import React, { useEffect } from 'react';

export default function ModalShell({ isOpen, onClose, title, children }) {
  // ESC 키 이벤트 감지
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* 바깥 배경 (Backdrop) 클릭 시 모달 닫기 */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* 모달 윈도우 */}
      <div className="bg-white dark:bg-[#111115] rounded-[2rem] w-full max-w-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-white/10 flex flex-col relative z-10 transform transition-transform">
        
        {/* 모달 헤더 (Sticky) */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between z-20 rounded-t-[2rem]">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-slate-500 dark:text-white font-bold">✕</span>
          </button>
        </div>
        
        {/* 모달 내부 컨텐츠 (스크롤 가능 영역) */}
        <div className="max-h-[80vh] overflow-y-auto hide-scrollbar p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
