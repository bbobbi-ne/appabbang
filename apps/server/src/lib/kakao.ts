class Kakao {
  key: string | undefined;
  redirectUri: string;

  constructor() {
    this.key = process.env.KAKAO_REST_KEY;
    this.redirectUri = `http://localhost:3000/callback/kakao`;
  }

  /**
   * @description 카카오 인가코드를 받기위한 URL 가져오기
   */
  getAuthCodeURL() {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
  }

  /**
   * @description 토큰 발급하기
   * @param code 인가코드
   */
  async getToken(code: string) {
    const params = {
      client_id: this.key,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    };

    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      body: new URLSearchParams(params as Record<string, string>),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data: any = await response.json();

    if (!data) {
      throw new Error('토큰 발급 실패');
    }

    const tokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    return tokenData;
  }

  /**
   * @description 유저 정보 가져오기
   * @param token 액세스 토큰
   */
  async getUserData(token: string) {
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: any = await response.json();

    if (!data) {
      throw new Error('유저 정보 가져오기 실패');
    }

    const userData = {
      nickname: data.kakao_account.profile.nickname,
    };

    return userData;
  }
}

export const KakaoClient = new Kakao();
