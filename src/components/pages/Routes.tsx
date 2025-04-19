import { Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage/HomePage.tsx";
import OAuth2Callback from "./Oauth/OAuth2Callback.tsx";
import { AuthPage } from "./AuthPage/AuthPage.tsx";
import { SearchPage } from "./SearchPage/SearchPage.tsx";
import { RecordPage } from "./RecordPage/RecordPage.tsx";
import { FortunePage } from "./FortunePage/FortunePage.tsx";
import { AnalyticsPage } from "./AnalyticsPage/AnalyticsPage.tsx";
import { MyProfilePage } from "./MyProfilePage/MyProfilePage.tsx";
import CheckIsLogin from "./Layout/CheckIsLogin.tsx";

export function Router() {
  return (
    <Routes>
      <Route element={<CheckIsLogin />}>
        <Route index path="/" element={<SearchPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
      </Route>
      <Route index path="/auth" element={<AuthPage />} />
      <Route path="/oauth2" element={<OAuth2Callback />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/fortune" element={<FortunePage />} />
      <Route path="/*" element={<div>페이지가 존재하지 않습니다.</div>} />
    </Routes>
  );
}
