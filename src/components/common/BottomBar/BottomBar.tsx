import "./_BottomBar.scss";
import { NavLink } from "react-router-dom";
import SearchIcon from "../../../assets/images/search-icon.svg?react";
import StarIcon from "../../../assets/images/start-icon.svg?react";
import ListIcon from "../../../assets/images/list-icon.svg?react";

export function BottomBar() {
  return (
    <div className="BottomBar">
      <NavLink to="/" className={({ isActive }) => (isActive ? "isActive item" : "item")}>
        <SearchIcon className="Icon" />
        <label>검색</label>
      </NavLink>
      <NavLink to="/record" className={({ isActive }) => (isActive ? "isActive item" : "item")}>
        <StarIcon className="Icon" />
        <label>기록하기</label>
      </NavLink>
      <NavLink to="/fortune" className={({ isActive }) => (isActive ? "isActive item" : "item")}>
        <ListIcon className="Icon" />
        <label>운세보기</label>
      </NavLink>
    </div>
  );
}
