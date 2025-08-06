import { Card, CardContent, CardTitle } from '@appabbang/ui';

export default function BrandPage() {
  const onClick = () => {
    window.location.href = `https://www.instagram.com/appabbang`;
  };

  return (
    <div className="mb-40">
      <h1 className="text-center">"파티셰 아빠의 따뜻한 빵, 이제 문 앞에서 만나요."</h1>

      <div className="mt-30 *:text-center">
        <h3 className="text-2xl font-bold m-5">이야기</h3>
        <p>
          30년 경력의 파티셰였던 아버지와 함께, 집에서 즐길 수 있는 고급 수제 디저트를 만들고자
          시작한 브랜드입니다. <br />
          '빵을 굽는 손'을 놓지 않았던 아버지의 정성과 직접 구운 따뜻한 행복을 이제 여러분의 식탁에
          따뜻하게 전하고자 합니다.
        </p>

        <p className="font-bold m-5">#가족의정성 #따뜻함 #장인정신 #신뢰 #작지만진심있는브랜드</p>
      </div>

      <div className="mt-20 *:text-center flex flex-col items-center">
        <h3 className="text-2xl font-bold m-5">아빠의 세심한 픽!</h3>
        <p>
          우리는 고객의 다양한 취향과 라이프스타일을 고려하여 세심하게 선별된 제품 라인업을
          제공합니다.
        </p>

        {/* 1 */}
        <Card className="m-5 flex flex-row lg:w-3/6 md:w-3/6 sm:w-3/6">
          <img className="w-30 h-30 rounded-2xl m-5" src="/images/sogumbbang.jpg" alt="빵이미지" />
          <CardContent className="mt-5 flex flex-col items-start">
            <CardTitle className="text-[18px] mb-5">요즘 가장 예쁜 한 입, 아빠가 구워요.</CardTitle>
            <div className="text-[16px] *:text-left">
              <p>소금빵부터 크루아상, 미니타르트까지 ✨</p>
              <p>겉바속촉의 정석, 감성 디저트 모음❤</p>
              <p>이거 안 먹을 수 없겠는 걸?️</p>
            </div>
          </CardContent>
        </Card>

        {/* 2 */}
        <Card className="m-5 flex flex-row lg:w-3/6 md:w-3/6 sm:w-3/6">
          <img
            className="w-30 h-30 rounded-2xl m-5"
            src="/images/ssalbbang.jpeg"
            alt="건강빵이미지"
          />
          <CardContent className="mt-5 flex flex-col items-start">
            <CardTitle className="text-[18px] mb-5">가족의 아침이 더 건강하게!</CardTitle>
            <div className="text-[16px] *:text-left">
              <p>밀가루없이 쌀로 제조한 부드럽고 쫄~깃하며</p>
              <p>아이까지 건강하게 먹을 수 있는 빵을 원하시나요?</p>
              <p>그렇다면 당신의 픽은 바로 아빠빵입니다.</p>
            </div>
          </CardContent>
        </Card>

        {/* 3 */}
        <Card className="m-5 flex flex-row lg:w-3/6 md:w-3/6 sm:w-3/6">
          <img className="w-30 h-30 rounded-2xl m-5" src="/images/present.jpg" alt="선물이미지" />
          <CardContent className="mt-5 flex flex-col items-start">
            <CardTitle className="text-[18px] mb-5">감사의 마음까지 따뜻하게 굽습니다.</CardTitle>
            <div className="text-[16px] *:text-left">
              <p>커다란 감사한 마음은 언제나 전달하기 참 어렵죠.</p>
              <p>달콤한 디저트와 함께 전달하는 것은 어떨까요?</p>
              <p>아빠방이 힘껏 돕겠습니다.</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-20 *:text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold">더 많은 소식은?</h3>
          <img
            className="w-50 h-50 rounded-full border m-5 cursor-pointer"
            src="/images/appabbang_logo_p.png"
            alt="logo"
            onClick={onClick}
          />
          <p className="flex flex-row items-center justify-center *:m-2">
            <span>
              <img className="w-5 h-5" src="/images/instagram.png" alt="인스타그램이미지" />{' '}
            </span>
            Imstagram에서 최신 소식을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
