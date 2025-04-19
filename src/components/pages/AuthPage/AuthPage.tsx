import "./_AuthPage.scss";
import KakaoLoginButton from "./KakaoLoginButton";
import DreamMeBlackIcon from "../../../assets/images/dream-me-black-icon.svg?react";
import LoginBannerImage from "../../../assets/images/login-page-banner.png";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const navigate = useNavigate();

  const handleOutClick = () => {
    navigate("/fortune");
  };

  return (
    <>
      <div className="AuthContainer">
        <div className="LogoContainer">
          <DreamMeBlackIcon width="auto" height="98" />
        </div>
        <div className={"LoginBanner"}>
          <img src={LoginBannerImage} />
        </div>
        <div className="ButtonGroup">
          <KakaoLoginButton />
          <div className="NonLoginButton" onClick={handleOutClick}>
            잠깐 둘러보기
          </div>
        </div>
      </div>
    </>
  );
}
