import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@appabbang/ui';
import LoginForm from '@/components/login/login-form';
import KakaoLoginButton from '@/components/login/kakao-login-button';
import LoginGuestForm from '../login/login-guest-form';

function LoginPage() {
  const [customer, guest] = ['customer', 'guest'];

  return (
    <div className="p-4 flex flex-col items-center">
      <Tabs defaultValue={customer}>
        <TabsList>
          <TabsTrigger value={customer}>회원</TabsTrigger>
          <TabsTrigger value={guest}>비회원</TabsTrigger>
        </TabsList>

        {/* 회원 로그인 */}
        <TabsContent value={customer}>
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">회원 로그인</CardTitle>
              <CardDescription className="text-center text-xs">
                환영합니다! 아빠빵 서비스를 이용해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoginForm />
              <KakaoLoginButton />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 비회원 로그인 */}
        <TabsContent value={guest}>
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">비회원 로그인</CardTitle>
              <CardDescription className="text-center text-xs">
                비회원 고객님의 주문내역을 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoginGuestForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LoginPage;
