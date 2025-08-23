import { useQuery } from '@tanstack/react-query';
import { CommonCodeService } from '@/services/api/common-code-service';

export function useGetCommonCodesQuery(groupName: 'order_status' | any) {
  return useQuery({
    queryKey: [`/common-code/${groupName}`, '공통코드 조회'],
    queryFn: () => CommonCodeService.getCodes(groupName),
  });
}
