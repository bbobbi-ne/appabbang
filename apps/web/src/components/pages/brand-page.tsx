import { Card, CardContent, CardTitle } from '@appabbang/ui';

export default function BrandPage() {
  const onClick = () => {
    window.open(`https://www.instagram.com/appabbang`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-40">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-primary text-center text-4xl font-bold">아빠빵</h1>
        <h3 className="text-gray-400 text-center text-xl font-bold">appabbang</h3>
        <p className="text-center text-2xl font-bold pt-2 relative break-keep">
          "파티셰 아빠의 따뜻한 빵, 이제 문 앞에서 만나요."
          <span className="hidden sm:block absolute bottom-[-4px] left-0 w-full h-4 bg-secondary rounded-sm -z-10"></span>
        </p>
      </div>

      <div className="pt-4" />

      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          <p className="text-center break-keep">
            30년 경력의 파티셰였던 아버지와 함께, 집에서 즐길 수 있는 고급 수제 디저트를 만들고자
            시작한 브랜드입니다.
          </p>
          <p className="text-center break-keep">
            '빵을 굽는 손'을 놓지 않았던 아버지의 정성과 직접 구운 따뜻한 행복을 이제 여러분의
            식탁에 따뜻하게 전하고자 합니다.
          </p>
        </div>
        <p className="font-bold flex flex-row items-center justify-center gap-4 flex-wrap">
          <span className="text-primary">#가족의정성</span>
          <span className="text-primary">#따뜻함</span>
          <span className="text-primary">#장인정신</span>
          <span className="text-primary">#신뢰</span>
          <span className="text-primary">#작지만진심있는브랜드</span>
        </p>
      </div>

      <div className="pt-40" />

      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-center text-2xl font-bold">아빠의 세심한 픽!</h3>
        <p className="text-center break-keep">
          다양한 취향과 라이프스타일을 고려해, 한 사람 한 사람에게 어울리는 제품 라인업을
          준비했습니다.
        </p>

        <div className="pt-4 space-y-8 w-full">
          <BrandCard
            title="요즘 가장 예쁜 한 입, 아빠가 구워요."
            descriptionElement={
              <div>
                <p className="break-keep">소금빵부터 크루아상, 미니타르트까지 ✨</p>
                <p className="break-keep">겉바속촉의 정석, 감성 디저트 모음❤</p>
                <br />
                <p className="break-keep">이거 안 먹을 수 없겠는 걸?</p>
              </div>
            }
            imageUrl="/images/brand-card1.png"
            imageName="빵이미지"
          />

          <BrandCard
            title="가족의 아침이 더 건강하게!"
            descriptionElement={
              <div>
                <p className="break-keep">밀가루없이 쌀로 제조한 부드럽고 쫄깃하며</p>
                <p className="break-keep">아이까지 건강하게 먹을 수 있는 빵을 원하시나요?</p>
                <br />
                <p className="break-keep">그렇다면 당신의 픽은 바로 아빠빵입니다.</p>
              </div>
            }
            imageUrl="/images/brand-card2.jpg"
            imageName="건강빵이미지"
          />

          <BrandCard
            title="감사의 마음까지 따뜻하게 굽습니다."
            descriptionElement={
              <div>
                <p className="break-keep">커다란 감사한 마음은 언제나 전달하기 참 어렵죠.</p>
                <p className="break-keep">달콤한 디저트와 함께 전달하는 것은 어떨까요?</p>
                <br />
                <p className="break-keep">아빠빵이 힘껏 돕겠습니다.</p>
              </div>
            }
            imageUrl="/images/brand-card3.jpg"
            imageName="선물이미지"
          />
        </div>
      </div>

      <div className="pt-40" />

      <div className="flex flex-col items-center justify-center gap-4">
        <h3 className="text-center text-2xl font-bold">더 많은 소식은?</h3>
        <img
          className="w-40 h-40 rounded-full cursor-pointer shadow-lg hover:outline-2 hover:outline-primary"
          src="/images/appabbang_logo_p.png"
          alt="logo"
          onClick={onClick}
        />
        <div className="flex flex-row items-center justify-center gap-2">
          <img className="w-5 h-5" src="/images/instagram.png" alt="인스타그램이미지" />
          <p className="text-center text-gray-500">아빠빵 인스타그램에서 확인해주세요!</p>
        </div>
      </div>
    </div>
  );
}

const BrandCard = ({
  title,
  descriptionElement,
  imageUrl,
  imageName,
}: {
  title: string;
  descriptionElement: React.ReactNode;
  imageUrl: string;
  imageName: string;
}) => {
  return (
    <Card className="flex flex-col items-center justify-center w-full p-4 gap-8 sm:flex-row sm:items-start sm:justify-start">
      <img
        className="w-30 h-30 mx-auto rounded-2xl sm:w-40 sm:h-40 sm:mx-0"
        src={imageUrl}
        alt={imageName}
      />
      <CardContent className="flex flex-col items-start p-0">
        <CardTitle className="text-lg pb-4 text-center sm:text-left w-full">{title}</CardTitle>
        <div className="text-base text-center sm:text-left">{descriptionElement}</div>
      </CardContent>
    </Card>
  );
};
