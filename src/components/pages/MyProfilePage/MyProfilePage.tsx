import "./_MyProfilePage.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../common/TopBar/TopBar.tsx";
import ProfileIcon from "../../../assets/images/profile-icon.svg?react";
import BottomLogo from "../../../assets/images/dream-me.svg?react";
import KakaoVerify from "../../../assets/images/kakao-verify.svg?react";
import { api } from "../../../services/api.ts";

export type MyProfileRes = {
  name: string;
  profile: string;
  recordCnt: number;
  dreamCnt: number;
  rate: number;
  startTime: string;
  endTime: string; //"08:00:00",
  time: string; // "13시간 20분"
};

export const getUserInfo = async () => {
  return api.get<MyProfileRes>("/users/mypage");
};

export function MyProfilePage() {
  const [userInfo, setUserInfo] = useState<MyProfileRes>({
    name: "",
    profile: "",
    recordCnt: 0,
    dreamCnt: 0,
    rate: 0,
    startTime: "",
    endTime: "",
    time: "",
  });

  const getUserInfoAndSet = async () => {
    const res = await getUserInfo();
    setUserInfo(res.data);
  };

  useEffect(() => {
    getUserInfoAndSet();
  }, []);

  return (
    <div className="MyProfilePage">
      <TopBar leftText={"마이페이지"} />

      <div className={"UserInfo"}>
        <div className={"ProfileImage"}>
          {userInfo.profile ? <img src={userInfo.profile} /> : <ProfileIcon width={164} height={164} />}
        </div>
        <div className={"Name"}>
          {userInfo.name}
          <KakaoVerify className={"KakaoVerifyIcon"} width={24} height={24} />
        </div>
      </div>

      <div className={"DreamInfo"}>
        <div className={"Left"}>
          <div className={"Title"}>나의 꿈 기록</div>
          <div className={"Score"}>{userInfo.recordCnt}회</div>
        </div>
        <div className={"Right"}>
          <div className={"Title"}>수면 만족도</div>
          <div className={"Score"}>
            <strong>{userInfo.rate}점</strong>/10
          </div>
        </div>
      </div>

      <div className={"GoalSleepTime"}>
        <div className="Header">
          <div className="Label">목표 수면 시간</div>
          <div className={"TotalSleepTime"}>총 {userInfo.time}</div>
        </div>

        <div className={"TimePicker"}>
          <div className={"StartTime"}>
            <div className={"Label"}>시작</div>
            <div className={"Value"}>{userInfo.startTime}</div>
          </div>
          ~
          <div className={"EndTime"}>
            <div className={"Label"}>종료</div>
            <div className={"Value"}>{userInfo.endTime}</div>
          </div>
        </div>
      </div>

      <div className={"BottomLogo"}>
        <BottomLogo width={123} height={33} />
      </div>
    </div>
  );
}
