import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@appabbang/ui';
import LoginForm from '../login/login-form';
import KakaoLoginButton from '../login/kakao-login-button';

function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 p-24">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="inline">사용자 로그인</CardTitle>
          </div>
          <CardDescription>로그인 후 사용이 가능합니다!</CardDescription>
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
