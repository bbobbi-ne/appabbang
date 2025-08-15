/**
 * 마이페이지 한정으로만 전역으로 사용할 고객 정보.
 * 민감정보는 피하고 기본정보만 등록할 것.
 */

import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

interface ICustomerProps {
  no: number | null;
  id: string | '';
  name: string | '';
  defaultAddressNo: number | null;
  isServiceTermsAgreed: boolean | null;
  isPrivacyTermsAgreed: boolean | null;
  isMarketingTermsAgreed: boolean | null;
  type: string | null;

  // 필요 민감정보
  // mobileNumber
  // providerId
  // providerType
  // refreshToken
}

interface CustomerState {
  customer: ICustomerProps;
  set: (customer: ICustomerProps) => void;
  reset: () => void;
}

const sessionStoragePersist: PersistStorage<any> = {
  getItem: (name: string) => {
    const item = sessionStorage.getItem(name);
    if (!item) return null;

    try {
      return JSON.parse(item); // string → object 변환
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value)); // object → string 변환
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

/**
 * 고객정보 기본설정
 */
export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: {
        no: null,
        id: '',
        name: '',
        defaultAddressNo: null,
        isServiceTermsAgreed: null,
        isPrivacyTermsAgreed: null,
        isMarketingTermsAgreed: null,
        type: '',
      },
      set: (customer: ICustomerProps) => set({ customer }),
      reset: () =>
        set({
          customer: {
            no: null,
            id: '',
            name: '',
            defaultAddressNo: null,
            isServiceTermsAgreed: null,
            isPrivacyTermsAgreed: null,
            isMarketingTermsAgreed: null,
            type: '',
          },
        }),
    }),
    {
      name: 'customer-store', // localStorage key
      storage: sessionStoragePersist, // 세션 스토리지에도 가능
    },
  ),
);
