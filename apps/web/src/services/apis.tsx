import axios from 'axios';

/** axios 생성한 것을 컴포넌트에서 사용함. */
export const client = axios.create({
  baseURL: 'http://localhost:4000',
});
