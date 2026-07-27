import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useNavigate, Link } from 'react-router-dom';

export default function CommunityBoard({ session, onOpenAuth }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 필터 및 검색 상태
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const categories = ['All', '일반', '질문', '정보', '거래'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*, profiles!author_id(username)')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      
      if (searchKeyword.trim()) {
        query = query.ilike('title', `%${searchKeyword.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
  };

  return (
    <div className="min-h-[85vh] animate-fade-in relative z-10 flex flex-col gap-8 pb-10">
      
      {/* 헤더 컨트롤 패널: 검색 및 카테고리 */}
      <div className="bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] border border-slate-200 dark:border-white/[0.05] p-6 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              💬 커뮤니티 보드
            </h1>
            <p className="text-sm text-slate-500 mt-2">로봇 공학과 AI 토큰 생태계에 대한 자유로운 논의</p>
          </div>
          
          <button 
            onClick={() => {
              if (!session) return onOpenAuth();
              navigate('/community/write');
            }}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
          >
            <span className="text-lg">+</span> 새 글 작성
          </button>
        </div>

        {/* 탭 & 검색바 */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-t border-slate-200 dark:border-white/10 pt-6">
          
          {/* 카테고리 탭 */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat === 'All' ? '전체 보기' : cat}
              </button>
            ))}
          </div>

          {/* 검색 바 */}
          <form onSubmit={handleSearch} className="relative w-full lg:w-80">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="게시글 제목 검색..."
              className="w-full bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-full px-5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-500">
              🔍
            </button>
          </form>
          
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1">
        {loading ? (
          /* 스켈레톤 로딩 UX */
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white dark:bg-[#111115] p-6 rounded-2xl border border-slate-200 dark:border-white/[0.05] animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center"><div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10"></div><div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded"></div></div>
                  <div className="flex gap-3"><div className="w-12 h-4 bg-slate-200 dark:bg-white/10 rounded"></div></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-white/[0.02] rounded-3xl border border-slate-200 dark:border-white/[0.05]">
            <span className="text-5xl mb-4 block opacity-50">📭</span>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">게시글이 없습니다.</h3>
            <p className="text-slate-500 mt-2">조건에 맞는 글을 찾을 수 없거나 아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => navigate(`/community/${post.id}`)}
                className="bg-white dark:bg-[#111115] p-6 rounded-2xl border border-slate-200 dark:border-white/[0.05] shadow-sm hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* 카테고리 배지 */}
                    {post.category && (
                      <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono hidden sm:block">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-5 whitespace-pre-wrap line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/[0.02] pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-bold text-slate-500">{post.profiles?.username || '알 수 없는 유저'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><span className="text-base">👀</span> {post.view_count || 0}</span>
                    <span className="flex items-center gap-1"><span className="text-base">❤️</span> {post.like_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
