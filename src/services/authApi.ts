import { api } from "./api";

export const authApi = {
  // 카카오 로그인 URL 요청
  getKakaoLoginUrl: async (): Promise<string> => {
    const response = await api.get(`/oauth2/login`);

    return response.data;
  },

  // 카카오 인증 코드로 로그인 처리
  loginWithKakaoCode: async (code: string): Promise<string> => {
    const response = await api.get(`/oauth2/callback`, {
      params: { code },
    });
    const auth: string = response.headers["authorization"];
    const [_, accessToken] = auth.split(" ");

    return accessToken;
  },
};
