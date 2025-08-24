import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@appabbang/ui';
import LoginForm from '@/components/login/login-form';
import KakaoLoginButton from '@/components/login/kakao-login-button';

function LoginPage() {
  return (
    <div className="p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">로그인</CardTitle>
          <CardDescription className="text-center text-xs">
            환영합니다! 아빠빵 서비스를 이용해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <LoginForm />
          <KakaoLoginButton />
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
