import React from "react";
import { authApi } from "../../../services/authApi";
import "./KakaoLoginButton.scss";
import KakaoLogo from "@assets/images/kakao.svg?react";

const KakaoLoginButton: React.FC = () => {
  const handleKakaoLogin = async () => {
    try {
      // 카카오 로그인 URL 요청
      const loginUrl = await authApi.getKakaoLoginUrl();

      // 카카오 로그인 페이지로 리다이렉트
      window.location.href = loginUrl;
    } catch (error) {
      console.error("카카오 로그인 URL 요청 실패:", error);
    }
  };

  return (
    <button onClick={handleKakaoLogin} className={"Button"}>
      <KakaoLogo className="Icon" />
      카카오 계정으로 계속하기
    </button>
  );
};

export default KakaoLoginButton;
