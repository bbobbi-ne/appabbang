import useToast from '@/hooks/useToast';
import axios from 'axios';

/** axios 생성한 것을 컴포넌트에서 사용함. */
const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** 전체 빵 목록 조회 */
export async function searchBreadList() {
  const breadStatus = 10; // 판매중
  return client.get(`/breads?breadStatus=${breadStatus}`);
}

/** 배송방법 목록 조회 */
export async function searchDeliveryList() {
  return client.get(`/delivery-methods/active`);
}

/** 은행코드 목록 */
export async function searchBankList() {
  return client.get(`/common-code/bank_code`);
}

const { addToast } = useToast();

export async function insertOrders(data: any) {
  client
    .post('/orders', data)
    .then(({ status }) => {
      status === 201
        ? addToast({
            message: '주문이 등록되었습니다.',
            type: 'success',
          })
        : addToast({
            message: '주문이 실패되었습니다.',
            type: 'error',
          });
    })
    .catch(({ status }) => {
      status === 400 &&
        addToast({
          message: '주문 등록하는 과정에서 문제가 발생했습다. 관리자 확인이 필요합니다.',
          type: 'error',
        });
    });
}
