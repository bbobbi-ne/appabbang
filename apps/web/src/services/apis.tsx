import axios from 'axios';

/** axios 생성한 것을 컴포넌트에서 사용함. */
const client = axios.create({
  baseURL: 'http://localhost:4000',
});

/** 전체 빵 목록 조회 */
export async function searchBreadList() {
  const breadStatus = 10; // 판매중
  return client.get(`/breads?breadStatus=${breadStatus}`);
}
