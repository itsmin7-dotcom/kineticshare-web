import React from 'react';
import ModalShell from '../ModalShell';

export default function UploadModal({ isOpen, onClose }) {
  const handleSubmit = () => {
    alert('검증 컨트랙트가 실행되었습니다. 데이터 정합성 검사 후 등록됩니다.');
    onClose();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="새 궤적 데이터 업로드">
      <div className="flex flex-col gap-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">데이터 자산명</label>
          <input 
            type="text" 
            placeholder="예: 정밀 바리스타 핸드드립 모션 텐서" 
            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">상세 설명</label>
          <textarea 
            rows="4" 
            placeholder="동작의 특성, 호환 하드웨어, 주의사항을 상세히 적어주세요." 
            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">로봇 형태</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold">
              <option value="bipedal">2족 보행 (Bipedal)</option>
              <option value="quadruped">4족 보행 (Quadruped)</option>
              <option value="arm">다관절 암 (Robotic Arm)</option>
              <option value="drone">드론 (Drone)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">모션 타입</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold">
              <option value="locomotion">이동 (Locomotion)</option>
              <option value="grasping">파지 (Grasping)</option>
              <option value="simulation">시뮬레이션</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">제어 환경</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold">
              <option value="ros1">ROS 1</option>
              <option value="ros2">ROS 2</option>
              <option value="pytorch">PyTorch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">토큰 가격 (KNT)</label>
            <input 
              type="number" 
              placeholder="예: 1200" 
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-extrabold" 
            />
          </div>
        </div>

        {/* 파일 업로드 존 */}
        <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">📁</span>
          </div>
          <p className="text-base font-bold text-indigo-900 dark:text-indigo-200 mb-1">궤적 데이터 파일 드롭 (또는 클릭)</p>
          <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 font-medium">.bag, .csv, .pt 형식 지원 (최대 5GB)</p>
        </div>
        
        {/* 액션 버튼 */}
        <div className="pt-6 mt-4 border-t border-slate-200 dark:border-white/5 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2"
          >
            데이터 등록 및 검증 요청
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
