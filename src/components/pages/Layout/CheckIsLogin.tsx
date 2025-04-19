import { PropsWithChildren, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../MyProfilePage/MyProfilePage.tsx";

type Props = {
  redirect?: "/login" | "/home";
} & PropsWithChildren;

export default function CheckIsLogin({ redirect = "/login" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);

  // 마이페이지 정보 가져오기
  useEffect(() => {
    getUserInfo()
      .then((res) => {
        setIsLogin(true);
      })
      .catch((err) => navigate(`/auth`, { replace: true }));
  }, []);

  if (!isLogin) {
    navigate("/auth");
    return;
  }

  return <Outlet />;
}
