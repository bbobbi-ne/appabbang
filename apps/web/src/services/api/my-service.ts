import type { addresssDailogForm } from '@/validate/address-form.schema';
import client from '@/services/axios';

type OrderItemsType = {
  no: number;
  breadNo: number;
  breadImageUrl: string;
  allergyInfo: string;
  breadName: string;
  countryOfOrigin: string;
  quantity: number;

  totalPrice: number;
  unitPrice: number;

  createdAt: string;
  updatedAt: string;

  orderNo: number;
};

type OrdersType = {
  no: number;

  address: string;
  addressDetail: string;
  zipcode: string;

  deliveryMethodFee: number;
  deliveryMethodName: string;
  discountAmount: number;
  totalPrice: number;
  trackingNumber: string;
  message: string;
  orderItems: OrderItemsType[];
  orderStatus: string;
  orderStatusName: string;
  isPaymentRefundTermsAgreed: boolean;
  isPrivacyTermsAgreed: boolean;
  isServiceTermsAgreed: boolean;
  memo: string;
  orderNumber: string;
  orderPw: string;

  ordererName: string;
  ordererMobile: string;
  recipientMobile: string;
  recipientName: string;

  customerNo: number;
  couponNo: number;
  orderRoundNo: number;

  createdAt: string;
  updatedAt: string;
};

export const MyService = {
  /** 내 정보 조회 */
  getCustomerInfo: async () => {
    const response = await client.get('/my');
    return response.data;
  },
  /** 내 정보 수정 */
  updateCustomer: async (data: { mobileNumber: string }) => {
    await client.put('/my', data);
  },
  /** 내 비밀번호 수정 */
  updateCustomerPw: async (data: { pw: string; pwModify: string }) => {
    await client.put('/my/pw', data);
  },
  /** 내 배송지 목록 조회 */
  getAddressList: async () => {
    const response = await client.get('/my/addresses');
    return response.data;
  },
  /** 내 배송지 조회 */
  getAddressOne: async (no: number) => {
    const response = await client.get(`/my/addresses/${no}`);
    return response.data;
  },
  /** 내 배송지 저장 */
  createAddress: async (data: addresssDailogForm) => {
    await client.post('/my/addresses', data);
  },
  /** 내 배송지 수정 */
  updateAddress: async (no: number, data: addresssDailogForm) => {
    await client.put(`/my/addresses/${no}`, data);
  },
  /** 내 배송지 삭제 */
  deleteAddress: async (no: number) => {
    await client.delete(`/my/addresses/${no}`);
  },
  /** 내 주문서 목록 조회 */
  getOrders: async (): Promise<OrdersType[]> => {
    const response = await client.get('/my/orders');
    return response.data;
  },
  /** 내 주문서 조회 */
  getOrder: async (no: number) => {
    const response = await client.get(`/my/order/${no}`);
    return response.data;
  },
  /** 내 주문 취소 */
  cancelOrder: async (no: number, data: { canceledReason: string }) => {
    await client.post(`/my/order/${no}/cancel`, data);
  },
  /** 내 주문 배송(수령) 조회 */
  getOrderDelivery: async (no: number): Promise<any> => {
    const response = await client.get(`/my/order/${no}/delivery`);
    return response.data;
  },
  /** 주문내역의 배송지 조회 */
  getOrderAddress: async (no: number) => {
    const response = await client.get(`/my/order/${no}/address`);
    return response.data;
  },
  /** 주문내역의 배송지 수정 */
  updateOrderAddress: async (no: number, data: addresssDailogForm) => {
    await client.put(`/my/order/${no}/address`, data);
  },
};
