import { useEffect, useState } from 'react';
import BreadSearch from '../products/bread-search';
import type { BreadProps } from '@/interface/bread-interface';
import { useQuery } from '@tanstack/react-query';
import { getOrderRoundNow } from '@/services/order-round-apis';
import { searchBreadList } from '@/services/order-apis';
import ProductsLoading from '@/components/products/products-loading';
import BreadCardDetail from '@/components/products/bread-card-detail';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [breadList, setBreadList] = useState<BreadProps[]>([]);
  const [originBreadList, setOriginBreadList] = useState<BreadProps[]>([]);

  /** 빵 목록 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['allBreadList'],
    queryFn: searchBreadList,
  });

  const {
    isLoading: nowLoading,
    data: nowData,
    error: nowErr,
  } = useQuery({
    queryKey: ['getNowDateOrderRound'],
    queryFn: getOrderRoundNow,
  });

  /** 주문차수 빵 목록 조회 및 설정 */
  useEffect(() => {
    if (data) {
      setBreadList(data.data);
      setOriginBreadList(data.data);
    }

    // nowData && setOrderRoundBreads(nowData.data.orderRoundBreads);
  }, [data, error, nowData, nowErr]);

  /** enter key 누를때 빵 검색 기능 수행 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && breadSearch();
  };

  const breadSearch = () => {
    const regExp = /^[가-힣+$]/g; // 한글 + 1글자 이상 입력된 경우

    // 빈 값으로 검색할 경우 모든 리스트 보여주기
    if (keyword.length === 0) {
      setBreadList(originBreadList);
      return false;
    }

    if (regExp.test(keyword)) {
      // 정규표현식에 올바르다면, 텍스트에 포함되는 빵 목록을 보여준다.
      const tmpList = breadList.filter((bread) => bread.name.includes(keyword));
      // 임시 빵 목록 삽입
      setBreadList(tmpList);
    } else return false;
  };

  /** 키워드 저장 */
  const keywordSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return isLoading && nowLoading ? (
    <ProductsLoading />
  ) : (
    <div>
      <BreadSearch
        keyword={keyword}
        onChange={keywordSetting}
        onKeyDown={handleKeyDown}
        onClick={breadSearch}
      />

      {/* 주문차수 빵 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {breadList.map((bread, i) => (
          <BreadCardDetail key={i} bread={bread} />
        ))}
      </div>

      <div className="pt-40" />
    </div>
  );
}
