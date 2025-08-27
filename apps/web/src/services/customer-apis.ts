/**
 * 유저 APIs
 */

import client from './axios';

/** 카카오 인가코드 받기 */
export async function getKakaoCode() {
  client.get(`http://localhost:4000/auth/kakao/url`).then((response) => {
    document.location.href = response.data.url;
  });
}
