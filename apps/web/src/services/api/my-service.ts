import { My } from '@/api/My';
import { CustomHttpClient } from '../httpclient-instance';
import type {
  AddressesCreatePayload,
  AddressesUpdatePayload,
  OrdersAddressUpdatePayload,
  OrdersCancelPartialUpdatePayload,
  UpdateMyPasswordPayload,
  UpdateMyProfilePayload,
} from '@/api/data-contracts';
import { refreshCreate } from './auth-service';

const myApi = new My(new CustomHttpClient({}, refreshCreate));

export const MyService = {
  /** 내 요약정보 조회 */
  getCustomerSummaryInfo: async () => {
    const response = await myApi.summaryList();
    return response.data;
  },
  /** 내 정보 조회 */
  getCustomerInfo: async () => {
    const response = await myApi.getMy();
    return response.data;
  },
  /** 내 연락처 조회 */
  getMyContact: async () => {
    const response = await client.get('/my/contact');
    return response.data;
  },
  /** 내 정보 수정 */
  updateCustomer: async (data: UpdateMyProfilePayload) => {
    await myApi.updateMyProfile(data);
  },
  /** 내 비밀번호 수정 */
  updateCustomerPw: async (data: UpdateMyPasswordPayload) => {
    await myApi.updateMyPassword(data);
  },
  /** 내 배송지 목록 조회 */
  getAddressList: async () => {
    const response = await myApi.addressesList();
    return response.data;
  },
  /** 내 배송지 조회 */
  getAddressOne: async (no: number) => {
    const response = await myApi.addressesDetail(no);
    return response.data;
  },
  /** 내 배송지 저장 */
  createAddress: async (data: AddressesCreatePayload) => {
    await myApi.addressesCreate(data);
  },
  /** 내 배송지 수정 */
  updateAddress: async (no: number, data: AddressesUpdatePayload) => {
    await myApi.addressesUpdate(no, data);
  },
  /** 내 배송지 삭제 */
  deleteAddress: async (no: number) => {
    await myApi.addressesDelete(no);
  },
  /** 내 주문서 목록 조회 */
  getOrders: async () => {
    const response = await myApi.ordersList();
    return response.data;
  },
  /** 내 주문서 조회 */
  getOrder: async (no: number) => {
    const response = await myApi.ordersDetail(no);
    return response.data;
  },
  /** 내 주문 취소 */
  cancelOrder: async (no: number, data: OrdersCancelPartialUpdatePayload) => {
    await myApi.ordersCancelPartialUpdate(no, data);
  },
  /** 내 주문 배송(수령) 조회 */
  getOrderDelivery: async (no: number) => {
    const response = await myApi.ordersDeliveryList(no);
    return response.data;
  },
  /** 주문내역의 배송지 조회 */
  getOrderAddress: async (no: number) => {
    const response = await myApi.ordersAddressList(no);
    return response.data;
  },
  /** 주문내역의 배송지 수정 */
  updateOrderAddress: async (no: number, data: OrdersAddressUpdatePayload) => {
    await myApi.ordersAddressUpdate(no, data);
  },
  getCouponList: async () => {
    const response = await myApi.couponsList();
    return response.data;
  },
  /** 특정 주문차수에 내 주문이 있는지 확인 (취소, 환불 제외) - 주문서 접근 확인 용도 */
  checkHasOrder: async (no: number) => {
    const response = await client.get(`/my/order/${no}/has-order`);
    return response.data;
  },
};
