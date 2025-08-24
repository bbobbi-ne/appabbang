/**
 * session 정보를 전역으로 사용하기 위해 상태관리 채용
 */

import { create } from 'zustand';

interface AccessTokenState {
  accessToken: string;
  set: (token: string) => void;
  reset: () => void;
}

interface EmailCodeState {
  code: string;
  set: (code: string) => void;
  reset: () => void;
}

/**
 * accessToken 기본설정
 */
export const useAccessTokenStore = create<AccessTokenState>((set) => ({
  accessToken: sessionStorage.getItem('accessToken') || '',
  set: (accessToken: string) => set({ accessToken }),
  reset: () => {
    sessionStorage.removeItem('accessToken');
    set({ accessToken: '' });
  },
}));

/**
 * 이메일 인증코드 설정
 */
export const useEmailCodeStore = create<EmailCodeState>((set) => ({
  code: sessionStorage.getItem('code') || '',
  set: (code: string) => set({ code }),
  reset: () => {
    sessionStorage.removeItem('code');
    set({ code: '' });
  },
}));
