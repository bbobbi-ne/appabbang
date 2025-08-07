import { useEffect, useState } from 'react';
import BreadSearch from '../projects/bread-search';
import type { BreadProps } from '@/interface/bread-interface';
import { useQuery } from '@tanstack/react-query';
import { searchBreadList } from '@/services/apis';
import ProductsLoading from '../projects/products-loading';
import ProductsBreadCard from '../projects/products-bread-card';
import BreadCardDetail from '../projects/bread-card-detail';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  Card,
  CardContent,
  CardTitle,
} from '@appabbang/ui';
import { X } from 'lucide-react';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [breadList, setBreadList] = useState<BreadProps[]>([]);
  const [originBreadList, setOriginBreadList] = useState<BreadProps[]>([]);

  /** 빵 목록 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['allBreadList'],
    queryFn: searchBreadList,
  });

  /** 주문차수 빵 목록 조회 및 설정 */
  useEffect(() => {
    if (data) {
      setBreadList(data.data);
      setOriginBreadList(data.data);
    }
  }, [data, error]);

  /** enter key 누를때 빵 검색 기능 수행 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && breadSearch();
  };

  const breadSearch = () => {
    const regExp = /^[가-힣+$]/g; // 한글 + 1글자 이상 입력된 경우
    const tmpList = Array<BreadProps>();
    let tmpCount = 0;

    // 빈 값으로 검색할 경우 모든 리스트 보여주기
    if (keyword.length === 0) {
      setBreadList(originBreadList);
      return false;
    }

    if (regExp.test(keyword)) {
      // 정규표현식에 올바르다면, 텍스트에 포함되는 빵 목록을 보여준다.
      breadList?.map((data, _) => {
        const breadNm = data.name;

        if (breadNm.includes(keyword)) {
          tmpList.length === 0 && tmpList.push(data); // 데이터 0건이면 하나는 삽입

          tmpList?.map((tmpBread, _) => {
            tmpBread.no === tmpBread.no ? tmpCount++ : null;
          });

          tmpCount === 0 ? tmpList.push(data) : null;
        }
      });

      // 임시 빵 목록 삽입
      setBreadList(tmpList);
    } else return false;
  };

  /** 키워드 저장 */
  const keywordSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onBreadCardClick = () => {};

  const onClick = () => {};

  return isLoading ? (
    <ProductsLoading />
  ) : (
    <div className="flex flex-col items-center justify-center">
      <BreadSearch
        keyword={keyword}
        onChange={keywordSetting}
        onKeyDown={handleKeyDown}
        onClick={breadSearch}
      />

      {/* 주문차수 빵 목록 */}
      <div className="flex flex-row flex-wrap gap-10 justify-center">
        {breadList.map((bread, i) => (
          <AlertDialog key={i}>
            <BreadCardDetail bread={bread} onClick={onClick} />
          </AlertDialog>
        ))}
      </div>
    </div>
  );
}
