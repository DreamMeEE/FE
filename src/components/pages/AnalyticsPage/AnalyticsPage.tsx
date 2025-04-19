import { useFunnel } from "../../../utils/hooks/useFunnel";
import "./_AnalyticsPage.scss";
import TopBar from "../../common/TopBar/TopBar.tsx";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherIcon from "../../../assets/images/teacher.svg?react";
import PolygonLeftIcon from "../../../assets/images/polygon-left.svg?react";
import CloudIcon from "../../../assets/images/cloud.svg?react";
import DreamMeIcon from "../../../assets/images/dream-me.svg?react";
import LoadingBarIcon from "../../../assets/images/loading-bar.svg?react";
import BrainImage from "../../../assets/images/search-character-x2.png";
import { useEffect, useState } from "react";
import { api } from "../../../services/api.ts";
import { BottomSheetComp } from "../../pages/RecordPage/RecordPage.tsx";
import { FormData } from "../../pages/RecordPage/RecordPage.tsx";
import { DreamCategory } from "../../pages/FortunePage/FortunePage.tsx";

const analyzeStep = ["analysis", "brainImage", "dreamImage"] as const;
type AnalyzeStep = (typeof analyzeStep)[number];
type DreamWithBrainCommentResponse = {
  headImageUrl: string;
  headContent: string;
};

export function AnalyticsPage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sleepStart: "",
    sleepEnd: "",
    note: "",
    rate: "5",
    title: "",
    content: "",
    categories: [],
    issueDetail: "",
    comment: "",
    imageUrl: "",
    dreamCategory: DreamCategory.잡몽,
    flag: true,
    diaryCategory: DreamCategory.잡몽,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { Funnel, Step, setStep, step } = useFunnel<AnalyzeStep>("analysis");
  const findIndex = analyzeStep.findIndex((el) => el === step);
  const isLastStep = findIndex === analyzeStep.length - 1;
  const date = dayjs();
  const currentDate = date.format("YY.M.DD");
  const navigate = useNavigate();
  const location = useLocation();
  const [dreamAnalysis, setDreamAnalysis] = useState("");
  // dreamContent 정보
  const [dreamCommentData, setDreamCommentData] = useState({
    comment: "",
    category: "",
    flag: false,
  });
  // dreamWithBrain 정보
  const [dreamWithBrain, setDreamWithBrain] = useState({
    headImageUrl: "",
    headContent: "",
  });
  const [dreamImage, setDreamImageUrl] = useState("");

  // 꿈 내용 분석 요청
  const postDreamContent = async () => {
    const { dreamContent } = location.state;

    type DreamCommentResponse = {
      comment: string;
      category: string;
      flag: boolean;
    };

    type DreamImageResponse = {
      imageUrl: string;
    };

    const dreamCommentRes = await api.post<DreamCommentResponse>("/openai/comment", {
      topic: dreamContent,
    });

    const { comment, flag, category } = dreamCommentRes.data;
    setDreamCommentData(dreamCommentRes.data);
    setDreamAnalysis(comment);
    // formData에 꿈 분석 내용 저장
    setFormData((prev) => ({
      ...prev,
      comment: dreamCommentRes.data.comment,
    }));
    setIsLoading(false);

    // 2. 꿈 과학적 분석 (비동기로 요청)
    const dreamWithBrainComment = api
      .get<DreamWithBrainCommentResponse>(`/openai/head?category=${category}`)
      .then((res) => {
        const { headImageUrl, headContent } = res.data;
        setDreamWithBrain({ headImageUrl, headContent });
      });

    // 3. 꿈 이미지 생성 (비동기)
    const dreamImageComment = api
      .post<DreamImageResponse>("/openai/image", {
        topic: dreamContent,
      })
      .then((res) => {
        const { imageUrl } = res.data;
        setDreamImageUrl(imageUrl);
        setFormData((prev) => ({
          ...prev,
          imageUrl,
        }));
      });
  };

  const nextStep = () => {
    const nextIndex = findIndex + 1;
    if (nextIndex < analyzeStep.length) {
      setStep(analyzeStep[nextIndex]);
      return;
    }

    // @desc 마지막 단계
  };

  const prevStep = () => {
    const prevIndex = findIndex - 1;
    if (prevIndex >= 0) {
      setStep(analyzeStep[prevIndex]);
      return;
    }

    // @desc 첫 단계
  };

  const recordDream = () => {};

  const goToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    /**
     *                       comment: string;
     *                         imageUrl: string;
     *                         headImage: string;
     *                         headComment: string;
     *                         category: string
     *
     */
    const isReply = location.state?.replyDreamData?.comment;
    if (isReply) {
      // 꿈 분석 이미지 넣기
      setIsLoading(false);
      setDreamCommentData({
        category: location.state.replyDreamData.category,
        comment: location.state.comment,
        flag: true,
      });
      setDreamAnalysis(location.state.replyDreamData.comment);
      setDreamImageUrl(location.state.replyDreamData.imageUrl);
      setDreamWithBrain({
        headImageUrl: location.state.replyDreamData.headImage,
        headContent: location.state.replyDreamData.headComment,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        content: location.state.dreamContent,
        comment: dreamAnalysis,
        imageUrl: dreamImage,
      }));
      postDreamContent();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="AnalyticsLoadingPage">
        <div className="Middle">
          <div className="LoadingBar">
            <LoadingBarIcon className="LoadingBarIcon" />
          </div>
          <div className="CloudIconGroup">
            <CloudIcon className="CloudIcon" />
            <CloudIcon className="CloudIcon" />
          </div>
          <div className="TextGroup">
            <div className="TextTop">꿈 분석 중</div>
            <div className="TextBottom">무의식의 단서를 찾는 중이에요</div>
          </div>
        </div>
        <div className="Bottom">
          <DreamMeIcon className="DreamMeIcon" />
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar leftText={"해석"} rightText={currentDate} />
      <div className="SearchStep">
        <div className="StepProgressList">
          {analyzeStep.map((_, i) => (
            <div className={i <= findIndex ? "StepProgressItem isActive" : "StepProgressItem"} />
          ))}
        </div>
        <Funnel>
          <Step name="analysis">
            <div className="Step1">
              <div className="Question">{location.state.dreamContent}</div>
              <div className="AnswerContainer">
                <div className="Teacher">
                  <TeacherIcon className="TeacherIcon" />
                  <div className="Tooltip">
                    일단 꿈에 대해 해석해볼까요
                    <PolygonLeftIcon className="PolygonLeftIcon" />
                  </div>
                </div>
                <div className="AnswerList">
                  <div className="AnswerItem">{dreamAnalysis}</div>
                </div>
              </div>
            </div>
          </Step>
          <Step name="brainImage">
            <div className="Step1">
              <div className="Question">{location.state.dreamContent}</div>
              <div className="AnswerContainer">
                <div className="Teacher">
                  <TeacherIcon className="TeacherIcon" />
                  <div className="Tooltip">
                    {dreamCommentData.category}은 이런 원리로 이뤄져 있어요
                    <PolygonLeftIcon className="PolygonLeftIcon" />
                  </div>
                </div>
                <div className="AnswerList">
                  <div className="AnswerItem">{dreamWithBrain.headContent}</div>
                  <div className="DreamImage">
                    {dreamWithBrain.headImageUrl === "" ? (
                      <div className="DreamImageLoading">이미지를 생성중입니다!</div>
                    ) : (
                      <img src={dreamWithBrain.headImageUrl} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Step>
          <Step name="dreamImage">
            <div onClick={() => setStep("dreamImage")}>
              <div className="Step1">
                <div className="Question">{location.state.dreamContent}</div>
                <div className="AnswerContainer">
                  <div className="Teacher">
                    <TeacherIcon className="TeacherIcon" />
                    <div className="Tooltip">
                      꿈에서 본 장면을 그려볼게요
                      <PolygonLeftIcon className="PolygonLeftIcon" />
                    </div>
                  </div>
                  <div className="AnswerList">
                    <div className="DreamImage">
                      {dreamImage === "" ? (
                        <div className="DreamImageLoading">이미지를 생성중입니다!</div>
                      ) : (
                        <img src={dreamImage} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Step>
        </Funnel>
        <div className="MoveButtonGroup">
          {isLastStep ? (
            <>
              <div className="CloseButton" onClick={goToHome}>
                닫기
              </div>
              {
                //   다시보기로 들어왔으면 기록하기 보이면 안 됨.
                !location.state?.replyDreamData?.comment && (
                  <BottomSheetComp formData={formData} setFormData={setFormData} open={open} setOpen={setOpen}>
                    <div className="NextButton" onClick={recordDream}>
                      기록하기
                    </div>
                  </BottomSheetComp>
                )
              }
            </>
          ) : (
            <>
              <div className="PrevButton" onClick={prevStep}>
                이전
              </div>
              <div className="NextButton" onClick={nextStep}>
                다음
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
