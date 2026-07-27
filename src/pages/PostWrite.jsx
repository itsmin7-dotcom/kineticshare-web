import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function PostWrite({ session, onOpenAuth }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('일반'); // 기본 카테고리
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 마운트 시 세션 체크. 없으면 Auth 띄우고 뒤로가기
  useEffect(() => {
    if (!session) {
      onOpenAuth();
      navigate('/community');
    }
  }, [session, navigate, onOpenAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          title: title.trim(), 
          content: content.trim(), 
          category: category, 
          author_id: session.user.id 
        }
      ]);

    if (error) {
      console.error('글 작성 에러:', error);
      setErrorMsg('게시글 작성 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    } else {
      // 성공 시 커뮤니티 홈으로 강제 이동
      navigate('/community');
    }
  };

  if (!session) return null; // 마운트 직후 리다이렉션 보호용

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] p-8 lg:p-12 border border-slate-200 dark:border-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-fade-in relative z-10">
      
      <button 
        onClick={() => navigate('/community')}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <span className="text-xl">←</span> 취소하고 돌아가기
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">새 글 작성</h2>
        <p className="text-slate-500 text-sm mt-2">커뮤니티에 새로운 인사이트를 공유해 보세요.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">말머리 (카테고리)</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors cursor-pointer"
            >
              <option value="일반">일반 (General)</option>
              <option value="질문">질문 (Q&A)</option>
              <option value="정보">정보 (Info)</option>
              <option value="거래">거래 (Trade)</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">제목</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors text-lg font-bold"
            placeholder="직관적인 제목을 입력해 주세요."
          />
        </div>

        {/* 본문 입력 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">본문 내용</label>
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows="10"
            className="w-full bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors resize-y leading-relaxed text-sm"
            placeholder="내용을 작성해 주세요. (Markdown은 현재 지원하지 않습니다.)"
          ></textarea>
        </div>

        {/* 제출 액션 바 */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
          >
            {isSubmitting ? '데이터베이스 전송 중...' : '게시글 등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
