import "./_TopBar.scss";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "@assets/images/arrow-left.svg?react";

interface TopBarProps {
  onPrevClick?: () => void;
  leftText?: string;
  rightText?: string;
}

export default function TopBar({ leftText, onPrevClick, rightText }: TopBarProps) {
  const navigate = useNavigate();

  const handlePrevButtonClick = () => {
    if (onPrevClick) {
      onPrevClick();
      return;
    }

    navigate(-1);
  };

  return (
    <div className="TopBar">
      <div className="Left">
        <button className="PrevButton" onClick={() => handlePrevButtonClick()}>
          <ArrowLeft className="LeftIcon" />
        </button>
        <div className="LeftText">{leftText}</div>
      </div>
      <div className="Right">
        <div className="RightText">{rightText}</div>
      </div>
    </div>
  );
}
