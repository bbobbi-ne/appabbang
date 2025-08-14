/**
 * 메인 로딩 페이지
 */

import { Container } from '@/styles/home';
import { Card, CardContent, Skeleton } from '@appabbang/ui';
import clsx from 'clsx';

function MainLoading() {
  const arr = Array(4).fill(0);

  return (
    <>
      <div className="flex flex-row justify-center w-full mt-30 m-auto gap-15">
        <div className="flex flex-col w-1/5 h-72">
          <Skeleton className={clsx('text-3xl mt-5 mb-5', 'md:text-2xl')}>
            <div className="space-y-2">
              <Skeleton className="h-8 w-[250px]" />
            </div>
          </Skeleton>
          <Skeleton className="w-full h-full">
            <div className={clsx('flex gap-5 justify-center', 'md:gap-2')}>
              <Skeleton className="h-[40px] pt-8 pb-8" />
            </div>
          </Skeleton>
        </div>

        <Skeleton className="w-2/5 h-72 overflow-hidden" />
      </div>

      <Container className="*:ml-[15%] *:mr-[18%]">
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="px-1 gap-2 flex flex-row items-center justify-center">
          {arr.map((_, i) => (
            <Card key={i} className="w-1/4 ">
              <Skeleton
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px 8px 0 0',
                }}
                className="h-60"
              />
              <CardContent>
                <Skeleton className="h-6 m-5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="*:ml-[15%] *:mr-[18%]">
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="flex flex-row ml-[16%] mr-[18%] gap-4">
          {/* 왼쪽 큰 이미지 Skeleton */}
          <div className="w-[40%]">
            <Skeleton className="w-full h-[400px] rounded-2xl shadow-md" />
          </div>

          {/* 오른쪽 3열 2행 이미지 Skeleton */}
          <div className="w-full h-full grid grid-cols-3 gap-4 ">
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} className="w-full h-40 rounded-2xl" />
              ))}
          </div>
        </div>
      </Container>

      <Container className="*:ml-[15%] *:mr-[18%] mb-[10%]">
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="grid grid-cols-3 grid-rows-1 h-40 ml-[16%] mr-[16%] gap-10">
          <Card className="p-5">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-16 w-40 mb-4" />
          </Card>
          <Card className="p-5">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-16 w-40 mb-4" />
          </Card>
        </div>
      </Container>
    </>
  );
}

export default MainLoading;
