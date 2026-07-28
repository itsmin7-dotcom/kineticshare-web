import React, { useState } from 'react';
import ModalShell from '../ModalShell';
import { supabase } from '../../lib/supabaseClient';

export default function UploadModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'bipedal',
    motion: 'locomotion',
    env: 'ros1',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert('자산명과 가격은 필수 입력 항목입니다.');
      return;
    }

    try {
      setIsLoading(true);

      // Supabase assets 테이블에 데이터 Insert 요청
      const { data, error } = await supabase
        .from('assets')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            category: formData.motion, // motion 값을 DB에서는 category 등 적절한 컬럼에 매핑
            env: formData.env,
            price: Number(formData.price),
            dof: formData.type === 'arm' ? 6 : 12, // 임시 계산
            hz: 500, // 임시 하드코딩
            // created_at 등은 DB 자동 생성
          }
        ]);

      if (error) {
        throw error;
      }

      alert('데이터가 성공적으로 등록 및 검증 요청되었습니다!');
      
      // 상태 초기화 및 모달 닫기
      setFormData({ name: '', description: '', type: 'bipedal', motion: 'locomotion', env: 'ros1', price: '' });
      onClose();

    } catch (err) {
      console.error('업로드 실패:', err.message);
      alert('데이터 등록 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="새 궤적 데이터 업로드">
      <div className="flex flex-col gap-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">데이터 자산명</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 정밀 바리스타 핸드드립 모션 텐서" 
            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">상세 설명</label>
          <textarea 
            rows="4" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="동작의 특성, 호환 하드웨어, 주의사항을 상세히 적어주세요." 
            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">로봇 형태</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold"
            >
              <option value="bipedal">2족 보행 (Bipedal)</option>
              <option value="quadruped">4족 보행 (Quadruped)</option>
              <option value="arm">다관절 암 (Robotic Arm)</option>
              <option value="drone">드론 (Drone)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">모션 타입</label>
            <select 
              name="motion"
              value={formData.motion}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold"
            >
              <option value="locomotion">이동 (Locomotion)</option>
              <option value="grasping">파지 (Grasping)</option>
              <option value="simulation">시뮬레이션</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">제어 환경</label>
            <select 
              name="env"
              value={formData.env}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold"
            >
              <option value="ros1">ROS 1</option>
              <option value="ros2">ROS 2</option>
              <option value="pytorch">PyTorch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">토큰 가격 (KNT)</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
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
            disabled={isLoading}
            className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-lg">↻</span> 업로드 중...
              </>
            ) : (
              <>
                데이터 등록 및 검증 요청
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
