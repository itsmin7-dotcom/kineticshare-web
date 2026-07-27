import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export default function PostDetail({ post, onBack, session, onOpenAuth }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  // 1. 조회수 증가 (RPC 호출)
  useEffect(() => {
    const incrementView = async () => {
      // 조회수는 DB의 rpc 함수를 사용하여 1 증가시킴 (동시성 방지)
      const { error } = await supabase.rpc('increment_view_count', { row_id: post.id });
      if (error) console.error('조회수 업데이트 에러:', error);
    };
    incrementView();
  }, [post.id]);

  // 2. 초기 데이터 (댓글 및 좋아요) 로드
  useEffect(() => {
    const loadData = async () => {
      // 댓글 패칭 (외래키 조인으로 작성자 프로필 정보 획득)
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*, profiles!author_id(username, avatar_url)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
        
      if (!commentsError) setComments(commentsData || []);

      // 전체 좋아요 갯수 패칭
      const { count: totalLikes } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      setLikesCount(totalLikes || 0);

      // 내 좋아요 상태 패칭 (로그인 한 유저에 한함)
      if (session?.user?.id) {
        const { data: myLike } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', session.user.id)
          .single();
        
        if (myLike) setIsLiked(true);
      }
    };
    
    loadData();
  }, [post.id, session]);

  // 3. 좋아요 토글 (Optimistic UI)
  const handleLikeToggle = async () => {
    if (!session) {
      onOpenAuth();
      return;
    }
    if (isLikeProcessing) return;

    setIsLikeProcessing(true);
    const prevIsLiked = isLiked;
    const prevLikesCount = likesCount;

    // 즉시 UI 업데이트 (Optimistic)
    setIsLiked(!prevIsLiked);
    setLikesCount(prevIsLiked ? prevLikesCount - 1 : prevLikesCount + 1);

    try {
      if (!prevIsLiked) {
        // 좋아요 추가
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: post.id, user_id: session.user.id }]);
        if (error) throw error;
      } else {
        // 좋아요 취소
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', session.user.id);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Like toggle error:', error);
      // 실패 시 UI 롤백
      setIsLiked(prevIsLiked);
      setLikesCount(prevLikesCount);
    } finally {
      setIsLikeProcessing(false);
    }
  };

  // 4. 댓글 작성 처리
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      onOpenAuth();
      return;
    }
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { post_id: post.id, author_id: session.user.id, content: newComment.trim() }
      ])
      .select('*, profiles!author_id(username, avatar_url)');

    if (error) {
      console.error('댓글 작성 에러:', error);
      alert('댓글 등록에 실패했습니다.');
    } else if (data) {
      setComments((prev) => [...prev, data[0]]);
      setNewComment('');
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#0a0a0c]/90 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/[0.05] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] animate-fade-in relative z-10">
      
      {/* 상단 네비게이션 */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <span className="text-xl">←</span> 목록으로 돌아가기
      </button>

      {/* 게시글 본문 영역 */}
      <article className="mb-12">
        <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-white/10 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-lg">👤</div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {post.profiles?.username || '알 수 없는 유저'}
            </span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400 font-mono">{new Date(post.created_at).toLocaleString()}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">👀 조회수 {post.view_count || 0}</span>
        </div>

        <div className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-12 min-h-[150px]">
          {post.content}
        </div>

        {/* 좋아요 토글 액션 바 */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLikeToggle}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
              isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
            좋아요 {likesCount}
          </button>
        </div>
      </article>

      {/* 댓글 영역 */}
      <section className="bg-slate-50 dark:bg-[#111115] rounded-3xl p-8 border border-slate-200 dark:border-white/[0.02]">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
          댓글 <span className="text-indigo-500">{comments.length}</span>
        </h3>

        {/* 댓글 목록 */}
        <div className="space-y-6 mb-8">
          {comments.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              첫 번째 댓글을 남겨보세요.
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{comment.profiles?.username || '알 수 없는 유저'}</span>
                    <span className="text-xs text-slate-400 font-mono">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="relative">
          <div className="relative">
            {!session && (
              <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl cursor-pointer" onClick={onOpenAuth}>
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  🔒 로그인 후 댓글 쓰기
                </span>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="따뜻한 댓글을 남겨주세요..."
              rows="3"
              className="w-full bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors resize-none text-sm"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button 
              type="submit" 
              disabled={!session || !newComment.trim()}
              className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              등록
            </button>
          </div>
        </form>

      </section>

    </div>
  );
}
