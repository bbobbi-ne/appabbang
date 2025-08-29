import { useQuery } from '@tanstack/react-query';
import { CommonCodeService } from '@/services/api/common-code-service';

export function useGetCommonCodesQuery(groupName: 'order_status' | 'bank_code') {
  return useQuery({
    queryKey: [`/common-code/${groupName}`, '공통코드 조회'],
    queryFn: () => CommonCodeService.getCodes(groupName),
  });
}

// common-code 가 아니지만 일단 여기에 배치
export function useGetDeliveryMethodsQuery() {
  return useQuery({
    queryKey: ['/delivery-methods/active'],
    queryFn: () => CommonCodeService.deliveryMethods(),
  });
}
