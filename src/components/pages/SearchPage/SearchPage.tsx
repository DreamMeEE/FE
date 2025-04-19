import { BottomBar } from "../../common/BottomBar/BottomBar";
import "./_SearchPage.scss";
import SearchCharacter from "../../../assets/images/search-character-x2.png";
import SearchIcon from "../../../assets/images/search-icon.svg?react";
import ProfileIcon from "../../../assets/images/profile-icon.svg?react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SearchPage() {
  const [dreamContent, setDreamContent] = useState("");
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // 분석 페이지로 보내기
    navigate("/analytics", {
      state: {
        dreamContent,
      },
    });
  };

  const goToMyPage = () => {
    navigate("/my-profile");
  };

  return (
    <div className="SearchPageContainer">
      <div className={"UserProfileButton"} onClick={goToMyPage}>
        <ProfileIcon className={"ProfileIcon"} />
      </div>
      <div className="Content">
        <div className="LogoContainer">
          <img className="SearchCharacterImage" src={SearchCharacter} />
          <div className="Title">
            과학적인 꿈해석을
            <br />
            물어보세요
          </div>
        </div>
        <div className="SearchGroup">
          {/*<div className="Tooltip">*/}
          {/*  <b>악몽을 꾸는 이유</b>를 검색해 보세요*/}
          {/*</div>*/}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              placeholder="꿈에 대해 적어보세요"
              onChange={(e) => {
                setDreamContent(e.target.value);
              }}
              value={dreamContent}
            />
            <button className="SearchButton" onClick={handleSearchClick} type={"submit"}>
              <SearchIcon className="SearchIcon" />
            </button>
          </form>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
