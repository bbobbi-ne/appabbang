import { CommonCode } from '@/api/CommonCode';
import { DeliveryMethods } from '@/api/DeliveryMethods';
import { CustomHttpClient } from '../httpclient-instance';

const commonCodeApi = new CommonCode(new CustomHttpClient());
const deliveryMethodApi = new DeliveryMethods(new CustomHttpClient());

export const CommonCodeService = {
  getCodes: async (
    groupName:
      | 'user_role'
      | 'bread_status'
      | 'material_type'
      | 'order_status'
      | 'purchase_status'
      | 'delivery_type'
      | 'image_target_type'
      | 'discount_type'
      | 'provider_type'
      | 'bank_code',
  ) => {
    const response = await commonCodeApi.commonCodeDetail(groupName);
    return response.data;
  },

  // common-code 가 아니지만 일단 여기에 배치
  deliveryMethods: async () => {
    const response = await deliveryMethodApi.activeList();
    return response.data;
  },
};
