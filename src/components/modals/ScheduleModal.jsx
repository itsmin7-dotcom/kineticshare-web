import React, { useState } from 'react';
import ModalShell from '../ModalShell';

export default function ScheduleModal({ isOpen, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const slots = [
    { id: 1, time: '09:00 - 11:00', location: '판교 랩스 (OptiTrack)', status: 'available' },
    { id: 2, time: '11:00 - 13:00', location: '성수 랩스 (Xsens)', status: 'full' },
    { id: 3, time: '14:00 - 16:00', location: '대전 R&D (Vicon)', status: 'available' },
    { id: 4, time: '16:00 - 18:00', location: '판교 랩스 (OptiTrack)', status: 'available' },
  ];

  const handleSubmit = () => {
    if (!selectedSlot) return;
    alert('스튜디오 예약이 확정되었습니다. 마이페이지에서 예약 내역을 확인하세요.');
    onClose();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="스튜디오 캘린더 현황">
      <div className="flex flex-col gap-6">
        
        {/* 달력 UI 모의 구현 */}
        <div className="bg-slate-50 dark:bg-black/30 rounded-2xl p-6 border border-slate-200 dark:border-white/5 flex items-center justify-between mb-4">
          <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400">←</button>
          <div className="text-lg font-black text-slate-900 dark:text-white">2026년 7월 30일 (목)</div>
          <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400">→</button>
        </div>

        <h3 className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">시간대별 스튜디오 슬롯</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {slots.map(slot => (
            <div 
              key={slot.id}
              onClick={() => slot.status === 'available' && setSelectedSlot(slot.id)}
              className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                slot.status === 'full' 
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/[0.02] border-transparent' 
                : selectedSlot === slot.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md cursor-pointer' 
                  : 'bg-white dark:bg-[#111115] border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer'
              }`}
            >
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-lg mb-1">{slot.time}</div>
                <div className="text-sm text-slate-500 dark:text-gray-400 font-medium">{slot.location}</div>
              </div>
              <div>
                {slot.status === 'full' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs">예약 마감</span>
                ) : (
                  <span className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                    selectedSlot === slot.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    {selectedSlot === slot.id ? '선택됨 ✓' : '여유 (선택 가능)'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!selectedSlot}
            className={`px-8 py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center gap-2 ${
              selectedSlot 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:shadow-blue-500/50' 
              : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
            }`}
          >
            예약 확정
            <span className="text-lg">📅</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
