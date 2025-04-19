import { BottomBar } from "../../common/BottomBar/BottomBar";
import "./_FortunePage.scss";
import { useFunnel } from "../../../utils/hooks/useFunnel.tsx";
import { useState } from "react";
import { api } from "../../../services/api.ts";
import FortuneDecorationIcon from "../../../assets/images/fortune-decoration-icon.svg?react";
import DreamMeIcon from "../../../assets/images/dream-me.svg?react";
import FortuneStarIcon from "../../../assets/images/fortune-loading-star-icon.svg?react";
import PrevWhiteIcon from "../../../assets/images/prev-white.svg?react";
import FortuneLoadingBar from "../../../assets/images/fortune-loading-bar.png";
import FortuneInitImage from "../../../assets/images/fortune-init-image.png";
import FortuneStartLoop from "../../../assets/images/fortune-start-loop.svg?react";
import FortuneStartText from "../../../assets/images/fortune-start-text.png";
import FortuneStartCenter from "../../../assets/images/fortune-start-center.png";
import FortuneStartNextButton from "../../../assets/images/fortune-start-next-button.png";
import classNames from "classnames";

// 파일 분리
export enum DreamCategory {
  잡몽 = "잡몽",
  허몽 = "허몽",
  영몽 = "영몽",
  정몽 = "정몽",
  심몽 = "심몽",
}

export enum FortuneCategory {
  Fortune = "총운",
  WORK = "직장운",
  LOVE = "애정운",
  STUDY = "학업/시험운",
  MONEY = "재물운",
  HEALTH = "건강운",
}

interface FormData {
  dreamCategories: DreamCategory[];
  dreamDetail: string;
  fortuneCategory: FortuneCategory;
}

enum FakeCategory {
  ONE = "😈악몽",
  two = "🏃도망침",
  three = "🌪️재난",
  four = "🐰동물",
  five = "🍀횡재",
  siz = "💪건강",
  seven = "🏠가족",
  eight = "👭친구",
  nine = "❤️사랑",
  ten = "💰돈",
  eleven = "기타",
}

export const fakeCategoryList = Object.keys(FakeCategory).map((key) => FakeCategory[key as keyof typeof FakeCategory]);

export const dreamCategoryList = Object.keys(DreamCategory).map(
  (key) => DreamCategory[key as keyof typeof DreamCategory],
);
export const fortuneCategoryList = Object.keys(FortuneCategory).map(
  (key) => FortuneCategory[key as keyof typeof FortuneCategory],
);

const fortuneStep = ["start", "init", "dreamCategory", "fakeCategory", "detail", "fortuneCategory", "summary"] as const;
type FortuneStep = (typeof fortuneStep)[number];

export function FortunePage() {
  const { Funnel, Step, setStep, step } = useFunnel<FortuneStep>("start");
  const [formData, setFormData] = useState<FormData>({
    dreamCategories: [],
    dreamDetail: "",
    fortuneCategory: FortuneCategory.Fortune,
  });

  const setDreamCategories = (dreamCategories: DreamCategory[]) => {
    setFormData((prev) => ({ ...prev, dreamCategories }));
  };

  const setDreamDetail = (dreamDetail: string) => {
    setFormData((prev) => ({ ...prev, dreamDetail }));
  };

  const setFortuneCategory = (fortuneCategory: FortuneCategory) => {
    setFormData((prev) => ({ ...prev, fortuneCategory }));
  };

  const findIndex = fortuneStep.findIndex((el) => el === step);

  const nextStep = () => {
    const nextIndex = findIndex + 1;
    if (nextIndex < fortuneStep.length) {
      setStep(fortuneStep[nextIndex]);
      return;
    }

    // @desc 마지막 단계
    // api.post("/fortune", formData)
  };

  const prevStep = () => {
    const prevIndex = findIndex - 1;
    if (prevIndex >= 0) {
      setStep(fortuneStep[prevIndex]);
      return;
    }
  };

  console.log();

  // @desc Dream Category 페이지
  const [isSelectedFakeCategoryName, setIsSelectedFakeCategoryName] = useState<FakeCategory>(FakeCategory.ONE);
  const [xxxdreamCategories, setXXXDreamCategories] = useState<DreamCategory>(DreamCategory.잡몽);
  const handleDreamCategoryClick = (category: DreamCategory) => {
    setXXXDreamCategories(category);
  };

  // 현재 요소가 선택되어 있는지 확인
  const isSelected = (category: DreamCategory) => {
    return xxxdreamCategories.includes(category);
  };

  // @desc detail 페이지
  const [xxxdreamDetail, setXxxDreamDetail] = useState<string>("");
  const handleDreamDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXxxDreamDetail(event.target.value);
  };

  // @desc fortuneCategory 페이지
  const [xxxfortuneCategory, setXXXFortuneCategory] = useState<FortuneCategory>(FortuneCategory.Fortune);
  const handleFortuneCategoryClick = (category: FortuneCategory) => {
    setXXXFortuneCategory(category);
  };

  type FortuneSummaryRes = {
    text: string;
    image: string;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<FortuneSummaryRes>();

  // @desc Summary스텝으로 이동하면서 운세 api 요청 보내고 loading UI 보여주기
  const handleGoToSummaryClick = async () => {
    type FortuneRequest = {
      dreamCategory: string; //"동물";
      topic: string; // "나 벌에 쏘이는 꿈을 꾸었는데 운세 좀 봐줘";
      luckyCategory: string; // "총운";
    };

    const fortuneRequest: FortuneRequest = {
      dreamCategory: xxxdreamCategories,
      topic: xxxdreamDetail,
      luckyCategory: xxxfortuneCategory,
    };

    setIsLoading(true);
    const result = await api.post<FortuneSummaryRes>("/openai/lucky", fortuneRequest);
    setSummaryData(result.data);
    setIsLoading(false);
    setStep("summary");
  };

  if (isLoading) {
    return (
      <div className="FortuneLoading">
        <div className="LoadingText">운세를 보는 중이에요...</div>
        <div className="LoadingImage">
          <img src={FortuneLoadingBar} className={"FortuneLoadingBar"} />
          <FortuneStarIcon className={"FortuneStarIcon"} width={170} height={164} />
        </div>
        <div className="BottomLogo">
          <DreamMeIcon width={124} height={33} />
        </div>
      </div>
    );
  }

  return (
    <div className="FortunePageContainer">
      {/* 첫 번째 스텝에서는 보이지 않도록 */}
      <div
        className={classNames("PrevButton", {
          hide: findIndex === 0,
        })}
        onClick={prevStep}
      >
        <PrevWhiteIcon className={"PrevIcon"} />
      </div>
      <Funnel>
        {/*<Step name={"banner"}>banner</Step>*/}
        <Step name={"start"}>
          <div className={"FortuneStartStep"}>
            <div className={"FortuneStartStepTop"}>
              <FortuneStartLoop className="FortuneStartLoop" />
              <img className={"TextImage"} src={FortuneStartText} />
              <div className={"SubTitle"}>당신의 무의식이 지금 가장 진실해요</div>
            </div>
            <div className={"FortuneStartStepCenter"}>
              <img src={FortuneStartCenter} />
            </div>
            <img className={"NextButton"} src={FortuneStartNextButton} onClick={nextStep} />
          </div>
        </Step>
        <Step name={"init"}>
          <div className={"FortuneInitStep"}>
            <div className={"Text"}>
              예측은 믿음이 아닌 통찰의 결과죠.
              <br />
              당신의 운명이
              <br />
              조용히 말을 걸고 있습니다.
            </div>
            <div className={"FortuneInitLogo"}>
              <img src={FortuneInitImage} />
            </div>
            <div onClick={nextStep} className="NextButton">
              다음으로
            </div>
          </div>
        </Step>
        <Step name={"dreamCategory"}>
          <div className="DreamCategoryStep">
            <div className={"Text"}>오늘 꾼 꿈은 어떤 꿈 인가요?</div>
            <div className="CategoryList">
              {dreamCategoryList.map((dreamCategoryItem) => (
                <div
                  className={`CategoryItem ${isSelected(dreamCategoryItem) ? "selected" : ""}`}
                  onClick={() => handleDreamCategoryClick(dreamCategoryItem)}
                >
                  {dreamCategoryItem}
                </div>
              ))}
            </div>
            <div onClick={nextStep} className="NextButton">
              다음으로
            </div>
          </div>
        </Step>
        <Step name={"fakeCategory"}>
          <div className="DreamCategoryStep">
            <div className={"Text"}>오늘 꾼 꿈은 어떤 꿈 인가요?</div>
            <div className="CategoryList">
              {fakeCategoryList.map((fakeCategoryItem) => (
                <div
                  className={`CategoryItem ${isSelectedFakeCategoryName === fakeCategoryItem ? "selected" : ""}`}
                  onClick={() => setIsSelectedFakeCategoryName(fakeCategoryItem)}
                >
                  {fakeCategoryItem}
                </div>
              ))}
            </div>
            <div onClick={nextStep} className="NextButton">
              다음으로
            </div>
          </div>
        </Step>
        <Step name={"detail"}>
          <div className="DreamDetailStep">
            <div className={"Text"}>더 자세히 말해줄래요?</div>
            <div className={"SubText"}>자세하게 적어주면 운세가 더 명확해져요.</div>
            <div className={"TextArea"}>
              <input className={"DreamDetailInput"} placeholder={"꿈 내용을 적어주세요. (선택)"} />
            </div>
            <div
              onClick={() => {
                const dreamDetailElement = document.querySelector(".DreamDetailInput") as HTMLInputElement | null;
                setXxxDreamDetail(dreamDetailElement?.value ?? "");
                nextStep();
              }}
              className="NextButton"
            >
              다음으로
            </div>
          </div>
        </Step>
        <Step name={"fortuneCategory"}>
          <div className="FortuneCategoryStep">
            <div className="Text">어떤 운세가 궁금하신가요?</div>
            <div className="FortuneCategoryList">
              {fortuneCategoryList.map((fortuneCategoryItem) => (
                <div
                  className={`FortuneCategoryItem ${xxxfortuneCategory === fortuneCategoryItem ? "selected" : ""}`}
                  onClick={() => handleFortuneCategoryClick(fortuneCategoryItem)}
                >
                  {fortuneCategoryItem}
                </div>
              ))}
            </div>
            <div className={"ResultButton"} onClick={handleGoToSummaryClick}>
              결과 보기!
            </div>
          </div>
        </Step>
        <Step name={"summary"}>
          <div className="SummaryStep">
            <div className="Decoration">
              <FortuneDecorationIcon className="DecorationIcon" />
            </div>
            <div className="ImageContainer">
              <img src={summaryData?.image} />
            </div>
            <div className="Title">"일상 속 즐거움을 찾아볼까요?"</div>
            <div className="SummaryText">{summaryData?.text}</div>
          </div>
        </Step>
      </Funnel>
      <BottomBar />
    </div>
  );
}
