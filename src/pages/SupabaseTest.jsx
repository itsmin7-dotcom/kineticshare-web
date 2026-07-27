import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export default function SupabaseTest({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 새 글 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Dev Tester');

  // 데이터 로드
  const fetchPosts = async () => {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      setErrorMsg(error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 글 작성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { title, content, author }
      ])
      .select();

    if (error) {
      console.error('Error inserting post:', error);
      setErrorMsg(error.message);
    } else {
      // 입력 폼 초기화 및 새로고침
      setTitle('');
      setContent('');
      if (data) {
        setPosts(prev => [data[0], ...prev]);
      } else {
        fetchPosts(); // fallback
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] animate-fade-in relative z-10 flex flex-col gap-8 pb-10">
      
      <div className="flex justify-between items-end">
        <div>
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/30 uppercase tracking-widest mb-3 inline-block">Database Integration</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Supabase 게시판 테스트</h1>
          <p className="text-sm text-slate-500 font-medium">BaaS 통신 환경(Read/Create)이 정상 구축되었는지 검증합니다.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          돌아가기
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-4 rounded-xl text-red-600 dark:text-red-400 font-medium text-sm">
          오류 발생: {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 좌측: 새 글 작성 폼 벤토 카드 */}
        <div className="lg:col-span-1 bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-2xl rounded-[2rem] p-8 border border-slate-200 dark:border-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] h-fit sticky top-24">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">새 글 작성</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">제목</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-green-500 outline-none transition-colors"
                placeholder="예: 첫 번째 테스트 글"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">작성자</label>
              <input 
                type="text" 
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-green-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">본문 내용</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows="5"
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-green-500 outline-none transition-colors resize-none"
                placeholder="내용을 입력하세요..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-green-500 text-white font-extrabold text-sm hover:bg-green-600 transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? '데이터베이스 기록 중...' : '게시글 등록하기 (Insert)'}
            </button>
          </form>
        </div>

        {/* 우측: 게시글 목록 벤토 그리드 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">최근 작성된 글</h2>
            <button onClick={fetchPosts} className="text-sm font-medium text-slate-500 hover:text-green-500 transition-colors">
              ↻ 새로고침
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-50">
              <div className="w-10 h-10 border-4 border-slate-200 dark:border-white/10 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">데이터를 불러오는 중입니다...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-12 text-center">
              <span className="text-4xl block mb-4">📭</span>
              <p className="text-slate-500 font-medium">등록된 게시글이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-2">좌측 폼을 이용해 첫 번째 데이터를 생성해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-[#111115] p-6 rounded-2xl border border-slate-200 dark:border-white/[0.05] shadow-sm hover:border-green-500/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-500 transition-colors">{post.title}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-bold text-slate-500">{post.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
