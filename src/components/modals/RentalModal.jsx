import React, { useState } from 'react';
import ModalShell from '../ModalShell';

export default function RentalModal({ isOpen, onClose }) {
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  
  const equipments = [
    { id: 'xsens', name: 'Xsens Awinda 스타터 킷', desc: '관성식 모션 캡처 수트 (최대 6시간/일)', price: 450, icon: '🦿' },
    { id: 'optitrack', name: 'OptiTrack Flex 13 패키지', desc: '광학식 카메라 8대 + 마커 세트 (실내 필수)', price: 1200, icon: '🎥' },
    { id: 'unitree', name: 'Unitree H1 (Bipedal)', desc: '개발용 2족 보행 로봇 본체 대여', price: 3500, icon: '🤖' },
    { id: 'optimus', name: 'Optimus Arm (6 DoF)', desc: '다관절 협동 로봇 팔 및 제어기', price: 800, icon: '🦾' },
  ];

  const toggleEquipment = (id) => {
    setSelectedEquipments(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedEquipments.reduce((sum, id) => {
    return sum + equipments.find(e => e.id === id).price;
  }, 0);

  const handleSubmit = () => {
    if (selectedEquipments.length === 0) return;
    alert(`${selectedEquipments.length}개의 장비 대여 신청이 완료되었습니다.`);
    onClose();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="장비 대여 신청">
      <div className="flex flex-col gap-6">
        
        <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
          외부 스튜디오나 자가 환경에서 궤적 데이터를 추출하기 위한 전문 하드웨어를 저렴한 비용에 대여해 드립니다. 
          원하시는 하드웨어를 다중 선택해 주세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {equipments.map(eq => (
            <div 
              key={eq.id}
              onClick={() => toggleEquipment(eq.id)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-4 cursor-pointer relative overflow-hidden group ${
                selectedEquipments.includes(eq.id)
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 shadow-md' 
                : 'bg-white dark:bg-[#111115] border-slate-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/50'
              }`}
            >
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 pointer-events-none">
                {eq.icon}
              </div>
              
              <div className="flex justify-between items-start z-10 relative">
                <div className="text-3xl bg-white dark:bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                  {eq.icon}
                </div>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                  selectedEquipments.includes(eq.id) 
                  ? 'bg-amber-500 border-amber-500' 
                  : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {selectedEquipments.includes(eq.id) && <span className="text-white text-sm font-bold">✓</span>}
                </div>
              </div>
              
              <div className="z-10 relative">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg mb-1">{eq.name}</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 h-8">{eq.desc}</p>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-baseline gap-1">
                  <span className="font-black text-amber-600 dark:text-amber-500 text-xl">{eq.price.toLocaleString()}</span>
                  <span className="text-xs font-bold text-amber-600/60 dark:text-amber-500/60">KNT / 1일</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 dark:bg-white rounded-2xl p-6 flex items-center justify-between shadow-xl mt-2">
          <div>
            <div className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">총 예상 비용 (1일 기준)</div>
            <div className="font-black text-white dark:text-slate-900 text-3xl">
              {totalPrice.toLocaleString()} <span className="text-lg">KNT</span>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={selectedEquipments.length === 0}
            className={`px-8 py-4 rounded-xl font-black transition-all ${
              selectedEquipments.length > 0 
              ? 'bg-amber-500 text-white hover:bg-amber-400 shadow-[0_10px_20px_rgba(245,158,11,0.3)] hover:scale-105' 
              : 'bg-slate-800 dark:bg-slate-200 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            장비 대여 신청
          </button>
        </div>
        
      </div>
    </ModalShell>
  );
}
