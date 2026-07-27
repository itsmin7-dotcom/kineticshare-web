import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../utils/supabase/client';

export default function AuthModal({ onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLoginMode) {
        // 로그인 처리
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose(); // 성공 시 모달 닫기
      } else {
        // 회원가입 처리
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        
        if (data?.user) {
          // 회원가입 성공 시, 프로필 생성 (id: UUID 매칭)
          const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const username = 'User_' + randomSuffix;
          
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, username }
          ]);
          
          if (profileError) {
            console.error('Profile Creation Error:', profileError);
            throw new Error('인증은 완료되었으나, 프로필 생성 중 오류가 발생했습니다.');
          }
          onClose(); // 성공 시 모달 닫기
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      // 자체 에러 메시지 렌더링
      setErrorMsg(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 배경 딤 처리 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* 모달 폼 컴포넌트 */}
      <div className="bg-white dark:bg-[#0f0f13] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center mb-4 text-2xl">
            {isLoginMode ? '🔐' : '✨'}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isLoginMode ? '플랫폼 로그인' : 'KineticShare 가입'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {isLoginMode ? '세션을 확보하여 데이터를 안전하게 거래하세요.' : '새로운 로봇 데이터 마켓에 합류하세요.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">이메일 계정</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
              placeholder="hello@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
              placeholder="6자리 이상 입력"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? '인증 처리 중...' : isLoginMode ? '로그인 (Sign In)' : '회원가입 및 프로필 생성'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg('');
            }}
            className="text-sm font-bold text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            {isLoginMode ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
