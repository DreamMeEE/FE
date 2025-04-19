import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../services/authApi";

const OAuth2Callback: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processKakaoCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("인증 코드가 없습니다.");
        }

        // 추출한 코드를 백엔드 API로 전송
        const accessToken = await authApi.loginWithKakaoCode(code);

        // 액세스 토큰 저장
        localStorage.setItem("accessToken", accessToken);

        // 로그인 성공 후 메인 페이지로 리다이렉트
        navigate("/");
      } catch (error) {
        console.error("카카오 로그인 처리 실패:", error);
        setError("로그인 처리 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    processKakaoCallback();
  }, [navigate]);

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};

export default OAuth2Callback;
