import { BottomBar } from "../../common/BottomBar/BottomBar";
import "./_RecordPage.scss";
import BottomSheet from "../../common/BottomSheet/BottomSheet.tsx";
import { ChangeEvent, PropsWithChildren, useEffect, useState } from "react";
import { date } from "../../../dayjs.ts";
import classNames from "classnames";
import { DreamCategory, dreamCategoryList } from "../../pages/FortunePage/FortunePage.tsx";
import HelpIcon from "../../../assets/images/help-icon.svg?react";
import BlucClockIcon from "../../../assets/images/blue-clock-icon.svg?react";
import PlusIcon from "../../../assets/images/plus-icon.svg?react";
import AlertIcon from "../../../assets/images/alert-icon.svg?react";
import EditIcon from "../../../assets/images/edit-icon.svg?react";
import RadialChart from "../../common/RadialChart/RadialChart.tsx";
import BlueHelpIcon from "../../../assets/images/blue-help-icon.svg?react";
import CalenderIcon from "../../../assets/images/calender-icon.svg?react";

type WeeklyData = {
  day: number;
  rate: string;
  time: number;
  id: number;
};
const getWeeklyData = async (selectedDate: number) => {
  // @desc 어차피 하루 할거니까 api 하드코딩
  return api.get<WeeklyData[]>(`/calendar/week?year=2025&month=4&day=${selectedDate}`);
};

export interface FormData {
  sleepStart: string; // LocalDateTime
  sleepEnd: string; // LocalDateTime
  note: string; // String 메모
  rate: string; // String 만족도
  title: string; // String 꿈 제목
  content: string; // String 꿈내용
  categories: DreamCategory[]; // List<String> 꿈 카테고리
  issueDetail: string; // String /// 이거는 보류 !!!! 공백으로 주셔도 되요! 피그마보니깐 없네요
  comment: string;
  imageUrl: string; // String
  dreamCategory: DreamCategory; // String
  flag: boolean; // 분석 후 들어왔다면 true
  diaryCategory: DreamCategory;
}

type GetDiaryDetailRes = {
  id: number;
  sleepStart: string; // "22:30:00";
  sleepEnd: string; // "07:00:00";
  note: string; //"평소보다 늦게 잠듦";
  rate: string; //"2";
  title: string; //"불나는 꿈";
  content: string; //"우리 집이 불타는 꿈을 꾸었음";
  diaryCategory: string; // "점몽";
  time: string; //  "8시간 30분";
  flag: boolean;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const getCurrentDate = () => {
  return date().date();
};

// RadialChart에서 수면 시간 전달할 때 쓰임
export const calculateSleepPercentage = (sleepHours: number) => {
  // 일단 권장 수면 시간인 8시간으로 고정하여 계산.
  const recommended = 8;

  if (sleepHours >= recommended) {
    return 100;
  }

  return Math.floor((sleepHours / recommended) * 100);
};

export function RecordPage() {
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDate());
  const [open, setOpen] = useState(false);
  const [isNewSleepCategory, setIsNewSleepCategory] = useState(true);
  const currentDate = date().format("YYYY년 M월 DD일 ddd요일");
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
    flag: false,
    diaryCategory: DreamCategory.잡몽,
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [todaySleepData, setTodaySleepData] = useState<GetDiaryDetailRes | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isGraphHelpModalOpen, setIsGraphHelpModalOpen] = useState(false);
  const [isOneMonthModalOpen, setIsOneMonthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Record Page
  const yearAndMonth = date().format("YYYY년 M월");

  const handleSaveClick = async () => {
    // @todo flag가 true일 경우, false일 경우 분기 처리하여 요청 보내도록 할 수 있어야 함.
    try {
      // 시간 맞는 타입으로 변경해야 함. 2025-04-13T23:30:00

      // 지금 formData.sleepEnd가 안 들어감.
      const { sleepStart, sleepEnd } = getSleepDateTimeStrings(formData.sleepStart, formData.sleepEnd);
      const newFormData = {
        ...formData,
        sleepStart,
        sleepEnd,
        content: todaySleepData?.content,
      };

      if (isEdit) {
        // edit에 필요 없는 필드 빼서 보내야 함.
        // 해당 게시물이 날짜로 변환해줘야 함.
        const { sleepStart, sleepEnd } = getSleepDateTimeStrings(
          formData.sleepStart,
          formData.sleepEnd,
          date().year(2025).month(3).date(selectedDay), // month는 0부터 시작
        );

        const editDreamRes = await api.patch(`/dream`, {
          id: todaySleepData?.id,
          sleepStart,
          sleepEnd,
          note: formData.note,
          rate: formData.rate,
          title: formData.title,
          content: formData.content,
          diaryCategory: formData.diaryCategory,
        });
      } else {
        const createDreamData = await api.post("/dream", newFormData);
      }
      // /record로 이동하고 페이지 새로고침
      location.href = "/record";
    } catch (err) {
      // @todo Alert 띄우기
      if (err instanceof AxiosError) {
        alert(`에러 발생 ${err?.response?.data.message ?? ""}`);
      }
    }
  };

  const getCurrentWeekDates = () => {
    return weeklyData;
    // const startOfWeek = date().startOf("week"); // 일요일
    // const weekDates = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day").date());
    // console.log("weekDates", weekDates);
    // return weekDates;
  };

  // @desc 현재 날짜의 오늘의 수면 데이터 가져오고 state로 저장
  const getTodaySleepDataAndSet = async (resWeeklyData: WeeklyData[]) => {
    // day는 17 이런 17일 날짜임
    // 날짜 선택해서 state로 저장한 후 여기서 currentDate로 사용하면 됨.
    const todaySleepData = resWeeklyData.find((el) => el.day === selectedDay);
    // 만약 오늘 안 만들었으면 못 보내게
    if (!todaySleepData) {
      return;
    }

    if (!todaySleepData.id) {
      return;
    }

    // 선택된 날짜 상세 정보 가져오기
    // selectedDay의 id를 가져와야 함.
    const selectedDayInfo = resWeeklyData.find((el) => {
      return el.day === selectedDay;
    });

    //현재 선택한 날짜 이전의 날짜가 들어가고 있음.
    // 처음 날짜가 없음.
    // selectedDayInfo?.id 이게 처음 들어왔을 때 지금 없음.
    console.log("selectedDayInfo", selectedDayInfo);
    const getDiaryDetailRes = await api.get<GetDiaryDetailRes>(`/dream/diary/${selectedDayInfo?.id}`);
    setTodaySleepData(getDiaryDetailRes.data);
  };

  const getAndSetWeeklyData = async () => {
    // weeklydate를 현재 날짜를 기준으로가 아니도록 변경해야 함.
    // 클릭된 날짜로 설정해서

    const getWeeklyDataRes = await getWeeklyData(selectedDay);
    // 4월을 가져왔는데
    // 거기서 날짜를 하나 선택하겠지
    // 그러면 state로 관리를 하면서
    // getTodaySleepDataAndSet에 넣고
    // 그리고 일주일만의 데이터를 가져오려면
    ///api/calendar/week?year=2025&month=4&day=17 이런 식으로 day를 넣어서 일주일치를 가져옴.

    // 그리고 state로 관리된 선택된 날짜에 대한 id의 수면 관련 정보를 가져옴.

    setWeeklyData(getWeeklyDataRes.data);
    getTodaySleepDataAndSet(getWeeklyDataRes.data);
  };

  const [isEdit, setIsEdit] = useState(false);
  type GetDiaryDetailRes = {
    id: number;
    sleepStart: string; // "22:30:00";
    sleepEnd: string; // "07:00:00";
    note: string; //"평소보다 늦게 잠듦";
    rate: string; //"2";
    title: string; //"불나는 꿈";
    content: string; //"우리 집이 불타는 꿈을 꾸었음";
    diaryCategory: string; // "점몽";
    time: string; //  "8시간 30분";
    flag: boolean;
  };

  const handleEditClick = () => {
    // console.log(todaySleepData)
    const { note, rate, title, content, diaryCategory, sleepStart, sleepEnd } = todaySleepData!;
    setFormData((prev) => ({
      ...prev,
      note,
      rate,
      title,
      content,
      diaryCategory: diaryCategory as any,
      sleepStart,
      sleepEnd,
    }));
    setIsEdit(true);
    // bottomSheet 열어버리기
    setOpen(true);
  };

  const patchEdit = () => {
    type EditReq = {
      id: 3;
      sleepStart: "2025-04-20T22:00:00";
      sleepEnd: "2025-04-21T08:00:00";
      note: "깊이 잠든 느낌이었음";
      rate: "4";
      title: "이상한 꿈을 꿨다";
      content: "산에서 곰을 만났는데 도망치다가 하늘을 날았다";
      diaryCategory: "잡몽";
    };

    /*
     * todaySleepData가 상세 데이터임
     *
     * edit을 눌렀을 때
     * formdata에 todatySleepData를 넣어주고
     * bottomSheet를 열어주면 됨.
     *
     * 근데 수정이라는 플래그가 있어야 eidt, post를 분리할 수 있을테니까
     *
     * edit 클릭 시 isEdit을 true로 두고
     * 모달 닫았을 때는 isEdit을 false로 두면 됨.
     *
     * */
  };

  useEffect(() => {
    getAndSetWeeklyData();

    // weeklyData가 없는 상태에서 getAndSetWeeklyData 사용하면 데이터 못 가져옴.
    // selectedDay radial chart 클릭 시 이전에 클릭한 값이 selectedDay가 되어버림.
  }, [weeklyData.length, selectedDay]);

  return (
    <div className="RecordPageContainer">
      <DreamCategoryDialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen} hasCancel={false} />
      <div className="Header">
        {/* @TODO 클릭 시 아래 컨텐츠가 한 달로 바뀌도록 */}
        <div
          className={"Label"}
          onClick={() => {
            setIsOneMonthModalOpen(true);
          }}
        >
          {yearAndMonth}
          <CalenderIcon width={24} height={24} />
        </div>
        {isOneMonthModalOpen ? (
          <div
            onClick={() => {
              setIsOneMonthModalOpen(false);
            }}
          >
            닫기
          </div>
        ) : (
          <div>
            <BlueHelpIcon
              width={24}
              height={24}
              onClick={() => {
                setIsGraphHelpModalOpen(true);
              }}
            />
          </div>
        )}
      </div>
      {isGraphHelpModalOpen && (
        <RadialGraphGuideDialog open={isGraphHelpModalOpen} onOpenChange={setIsGraphHelpModalOpen} hasCancel={false} />
      )}
      {isOneMonthModalOpen && (
        <OneMonthRadialChart
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          setIsOneMonthModalOpen={setIsOneMonthModalOpen}
        />
      )}
      <>
        {!isOneMonthModalOpen && (
          <>
            <div className="RadialChartList">
              {/*@todo ? getCUrrentWeekDates는 뭐지
          이거를 weekly로 가져와야 함.
        */}
              {getCurrentWeekDates().map((el, index) => (
                <div
                  className="RadialChartItem"
                  onClick={() => {
                    if (el.id !== null && el.id !== 0) {
                      setSelectedDay(el.day);
                    }
                  }}
                >
                  <div className="Day">{WEEKDAYS[index]}</div>
                  <div
                    className={classNames("Date", {
                      isToday: selectedDay === el.day,
                    })}
                  >
                    {el.day}
                  </div>
                  <RadialChart
                    satisfactionPercentage={calculateSleepPercentage(weeklyData[index]?.time ?? 0)}
                    sleepPercentage={Number(weeklyData[index]?.rate) * 10 ?? 0}
                  />
                </div>
              ))}
            </div>
            <div className="TodaySleep">
              <div className={"Label"}>
                <div className={"Text"}>오늘의 수면</div>
                {todaySleepData?.sleepStart !== undefined ? (
                  <EditIcon className={"EditIcon"} onClick={handleEditClick} />
                ) : (
                  <div onClick={() => setOpen(true)}>
                    <PlusIcon width={24} height={24} />
                  </div>
                )}
              </div>

              {todaySleepData?.sleepStart === undefined ? (
                <div className={"Content"}>
                  <div className="SleepEmpty">
                    <div className="Top">수면을 기록해주세요!</div>
                    <div className="Bottom">‘+’ 를 눌러 오늘의 수면을 기록해보세요!</div>
                  </div>
                  <div className="DreamEmpty">
                    <div className="Top">오늘의 꿈이 아직 없어요!</div>
                    <div className="Bottom">‘+’ 를 눌러 오늘의 꿈을 기록해보세요!</div>
                  </div>
                </div>
              ) : (
                <div className={"Content isNotEmpty"}>
                  <div className="SleepScore">
                    <div className="Time">
                      <BlucClockIcon className="BlueClockIcon" />
                      {todaySleepData?.sleepStart} ~ {todaySleepData?.sleepEnd} ({todaySleepData?.time})
                    </div>
                    <div className="Score">{todaySleepData?.rate}점</div>
                  </div>
                  <div className="DreamContent">
                    <div className="TitleContainer">
                      <div className="Title">
                        <div className="TitleText">{todaySleepData?.title}</div>
                        {todaySleepData?.diaryCategory && (
                          <div className="TitleCategory">{todaySleepData?.diaryCategory}</div>
                        )}
                      </div>
                      {todaySleepData?.flag && (
                        <div
                          className="DreamCategoryDetailButton"
                          onClick={async () => {
                            // @todo 클릭시 분석 스텝 보여주기 페이지로 넘어가도록 구현.

                            /**
                             * 1. flag가 true 녀석의 id를 가져와서
                             * 2. 해당 id로 개별 꿈 기록 API 요청
                             * 3.
                             */

                            type OneDreamResponse = {
                              comment: string;
                              imageUrl: string;
                              headImage: string;
                              headComment: string;
                            };

                            // id는 어디서 가져오냐 todaySleepData.id
                            const dreamRes = await api.get<OneDreamResponse>(`/openai/content/${todaySleepData.id}`);

                            const newStateData = {
                              dreamContent: todaySleepData?.content, // 내용
                              replyDreamData: { ...dreamRes.data, category: todaySleepData?.diaryCategory },
                            };

                            navigate("/analytics", {
                              state: newStateData,
                            });
                          }}
                        >
                          <AlertIcon className="AlertIcon" />
                        </div>
                      )}
                    </div>
                    <div className="DreamContentText">{todaySleepData?.content}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="SleepRate">
              <div className={"Label"}>수면 만족도</div>
              <div className={"Content"}>
                <WeeklyChart selectedDay={selectedDay} />
              </div>
            </div>
            <BottomSheet open={open} onOpenChange={setOpen}>
              <BottomSheet.Trigger asChild>
                {/*<PlusIcon width={24} height={24} />*/}
                <div></div>
              </BottomSheet.Trigger>
              <BottomSheet.Content>
                <div className="RecordDialogContent">
                  <div className="Header">
                    <div className="HeaderCurrentDate">{currentDate}</div>
                    <BottomSheet.Close asChild>
                      <div className="HeaderCloseButton">닫기</div>
                    </BottomSheet.Close>
                  </div>
                  <div className="Category">
                    <div
                      className={classNames("NewSleepCategory", {
                        isSelected: isNewSleepCategory,
                      })}
                      onClick={() => setIsNewSleepCategory(true)}
                    >
                      새 수면
                    </div>
                    <div
                      className={classNames("NewDreamCategory", {
                        isSelected: !isNewSleepCategory,
                      })}
                      onClick={() => setIsNewSleepCategory(false)}
                    >
                      새 꿈
                    </div>
                  </div>
                  {isNewSleepCategory ? (
                    <div className="NewSleep">
                      <SleepTimePicker
                        setSleepStart={(sleepStart: string) => {
                          setFormData((prev) => ({ ...prev, sleepStart: sleepStart }));
                        }}
                        setSleepEnd={(sleepEnd: string) => {
                          setFormData((prev) => ({ ...prev, sleepEnd: sleepEnd }));
                        }}
                      />
                      <div className="MemoContainer">
                        <div className="MemoLabel">메모</div>
                        <input
                          className="MemoInput"
                          placeholder={"수면 중 특이사항이 있었나요?"}
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                      </div>
                      <div className="SleepRateContainer">
                        <div className="TimePickerTextContainer">
                          <div className="TimePickerLabel">수면 만족도</div>
                          <div className="TimePickerTotal">{formData.rate}점</div>
                        </div>
                        <input
                          className={"SleepRateInput"}
                          onChange={(e) => {
                            setFormData({ ...formData, rate: e.target.value });
                          }}
                          type="range"
                          min={0}
                          max={10}
                          value={formData.rate}
                        />
                      </div>
                      <div className="Bottom">
                        <div className="SaveButton" onClick={handleSaveClick}>
                          저장하기
                        </div>
                      </div>
                    </div>
                  ) : (
                    // @Desc 새 꿈
                    <div className="NewDream">
                      <div className="MemoContainer">
                        <div className="MemoLabel">제목</div>
                        <input
                          className="MemoInput"
                          placeholder={"수면을 기록해주세요!"}
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="MemoContainer">
                        <div className="MemoLabel">꿈 내용</div>
                        <input
                          className="MemoInput"
                          placeholder={"수면을 기록해주세요!"}
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                      </div>
                      <div className="DreamCategoryContainer">
                        <div className="DreamCategoryTextContainer">
                          <div className="Label">카테고리</div>
                          <HelpIcon
                            className="CategoryDetailButton"
                            onClick={() => {
                              setIsHelpModalOpen(true);
                            }}
                          />
                        </div>
                        <div className="CategoryList">
                          {dreamCategoryList.map((category, index) => (
                            <div
                              key={index}
                              className={classNames("CategoryItem", {
                                isSelected: formData.diaryCategory === category,
                              })}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  diaryCategory: category,
                                }));
                              }}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/*<div className="AnalysisContainer">*/}
                      {/*  <div className="Label">꿈 분석</div>*/}
                      {/*  <div className="AnalysisButton">지난 분석 보기</div>*/}
                      {/*</div>*/}
                      <div className="Bottom">
                        <div className="SaveButton" onClick={handleSaveClick}>
                          저장하기
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </BottomSheet.Content>
            </BottomSheet>

            <BottomBar />
          </>
        )}
      </>
    </div>
  );
}

// 인터페이스 정의
interface SleepTimePickerProps {
  initialBedTime?: string;
  initialWakeTime?: string;
  onSave?: (bedTime: string, wakeTime: string, durationMinutes: number) => void;
  minSleepHours?: number;
  setSleepStart: (start: string) => any;
  setSleepEnd: (end: string) => any;
}

function SleepTimePicker({
  initialBedTime = "22:00",
  initialWakeTime = "08:00",
  onSave,
  minSleepHours = 1,
  setSleepStart,
  setSleepEnd,
}: SleepTimePickerProps) {
  const [bedTime, setBedTime] = useState<string>(initialBedTime);
  const [wakeTime, setWakeTime] = useState<string>(initialWakeTime);
  const [error, setError] = useState<string>("");

  // 시간 문자열을 분 단위로 변환하는 함수
  const timeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // 두 시간 사이의 간격을 계산하는 함수 (24시간 형식 고려)
  const getTimeDifference = (time1: string, time2: string): number => {
    let diff = timeToMinutes(time2) - timeToMinutes(time1);
    if (diff <= 0) {
      diff += 24 * 60; // 자정을 넘기는 경우 (예: 밤 10시 - 아침 8시)
    }
    return diff;
  };

  // 시간 변경 처리 함수
  const handleBedTimeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBedTime(e.target.value);
    // 22:30
    setSleepStart(e.target.value);
  };

  const handleWakeTimeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWakeTime(e.target.value);
    // 변경 안 하면 기본 값으로 해야 함.
    setSleepEnd(e.target.value);
  };

  // 저장 핸들러
  const handleSave = (): void => {
    if (!error && onSave) {
      const durationMinutes = getTimeDifference(bedTime, wakeTime);
      onSave(bedTime, wakeTime, durationMinutes);
    }
  };

  // 수면 시간 계산
  const sleepDuration = getTimeDifference(bedTime, wakeTime);
  const sleepHours = Math.floor(sleepDuration / 60);
  const sleepMinutes = sleepDuration % 60;

  useEffect(() => {
    setSleepStart(bedTime);
    setSleepEnd(wakeTime);
  }, []);

  return (
    <div className="TimePickerContainer">
      <div className="TimePickerTextContainer">
        <div className="TimePickerLabel">수면 시간</div>
        <div className="TimePickerTotal">
          총 {sleepHours}시간 {sleepMinutes}분
        </div>
      </div>
      <div className="SleepTimeContainer">
        <div className="TimeInputContainer">
          <div className="TimeInputWrapper">
            <label className="TimeLabel">취침 시간</label>
            <input type="time" value={bedTime} onChange={handleBedTimeChange} className="TimeInput" />
          </div>

          <div className="TimeSeparator">-</div>

          <div className="TimeInputWrapper">
            <label className="TimeLabel">기상 시간</label>
            <input type="time" value={wakeTime} onChange={handleWakeTimeChange} className="TimeInput" />
          </div>
        </div>
      </div>
    </div>
  );
}

// @desc weekly chart
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../../../services/api.ts";
import { AxiosError } from "axios";
import { DreamCategoryDialog, RadialGraphGuideDialog } from "../../modals/Dialog/AdditionalInfoDialog.tsx";
import { useNavigate } from "react-router-dom";
import { OneMonthRadialChart } from "../../pages/RecordPage/OneMonthRadialChart.tsx";

export default function WeeklyChart({ selectedDay }: { selectedDay: number }) {
  const [weeklyData, setWeeklyData] = useState([
    { day: "일", value: 0 },
    { day: "월", value: 0 },
    { day: "화", value: 0 },
    { day: "수", value: 0 },
    { day: "목", value: 0 },
    { day: "금", value: 0 },
    { day: "토", value: 0 },
  ]);

  const getAndSetWeeklyData = async () => {
    // @desc 어차피 하루 할거니까 api 하드코딩
    const response = await getWeeklyData(selectedDay);
    const data = response.data.map((item, index) => ({
      day: weeklyData[index].day,
      value: +item.rate,
    }));
    setWeeklyData(data);
  };

  useEffect(() => {
    getAndSetWeeklyData();
  }, []);

  return (
    <div className="weekly-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={weeklyData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
          <YAxis domain={[0, 10]} ticks={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
          <Tooltip />
          <Line
            // 둥글게 이어짐.
            // type="monotone"
            dataKey="value"
            stroke="#9CA3AF"
            strokeWidth={2}
            dot={(props) => {
              if (props.payload.value > 0) {
                return <circle cx={props.cx} cy={props.cy} r={6} fill="#3B82F6" />;
              } else {
                return <circle cx={props.cx} cy={props.cy} r={6} fill="#9CA3AF" />;
              }
            }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 서버로 보낼 시간 정하는 로직
// function getSleepDateTimeStrings(sleepTime: string, wakeTime: string, now = date()) {
//   const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
//   const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
//
//   // 취침 시간이 00시 이후면 오늘 날짜, 23시 이하이면 어제 날짜 사용
//   const isAfterMidnight = sleepHour < 12; // 00~11시는 자정 넘긴 것
//
//   const sleepDate = isAfterMidnight ? now : now.subtract(1, "day");
//   const wakeDate = now;
//
//   const sleepStart = sleepDate.hour(sleepHour).minute(sleepMinute).second(0).format("YYYY-MM-DDTHH:mm:ss");
//
//   const sleepEnd = wakeDate.hour(wakeHour).minute(wakeMinute).second(0).format("YYYY-MM-DDTHH:mm:ss");
//
//   return { sleepStart, sleepEnd };
// }

function getSleepDateTimeStrings(
  sleepTime: string,
  wakeTime: string,
  targetDate = date(), // 기본값은 현재 날짜
) {
  const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

  // 취침 시간이 00시 이후면 target 날짜, 23시 이하이면 하루 전 날짜 사용
  const isAfterMidnight = sleepHour < 12; // 00~11시는 자정 넘긴 것
  const sleepDate = isAfterMidnight ? targetDate : targetDate.subtract(1, "day");
  const wakeDate = targetDate;

  const sleepStart = sleepDate.hour(sleepHour).minute(sleepMinute).second(0).format("YYYY-MM-DDTHH:mm:ss");
  const sleepEnd = wakeDate.hour(wakeHour).minute(wakeMinute).second(0).format("YYYY-MM-DDTHH:mm:ss");

  return { sleepStart, sleepEnd };
}

type BottomSheetCompProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & PropsWithChildren;

export function BottomSheetComp({ children, formData, setFormData, open, setOpen }: BottomSheetCompProps) {
  const currentDate = date().format("YYYY년 M월 DD일 ddd요일");
  const [isNewSleepCategory, setIsNewSleepCategory] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSaveClick = async () => {
    // @todo flag가 true일 경우, false일 경우 분기 처리하여 요청 보내도록 할 수 있어야 함.
    try {
      // 시간 맞는 타입으로 변경해야 함. 2025-04-13T23:30:00

      // 지금 formData.sleepEnd가 안 들어감.
      const { sleepStart, sleepEnd } = getSleepDateTimeStrings(formData.sleepStart, formData.sleepEnd);
      const newFormData = { ...formData, sleepStart, sleepEnd };

      const createDreamData = await api.post("/dream", newFormData);
      // /record로 이동하고 페이지 새로고침
      location.href = "/record";
    } catch (err) {
      // @todo Alert 띄우기
      if (err instanceof AxiosError) {
        alert(`에러 발생 ${err?.response?.data.message ?? ""}`);
      }
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={setOpen}>
      <BottomSheet.Trigger asChild>{children}</BottomSheet.Trigger>
      <BottomSheet.Content>
        <div className="RecordDialogContent">
          <DreamCategoryDialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen} hasCancel={false} />
          <div className="Header">
            <div className="HeaderCurrentDate">{currentDate}</div>
            <BottomSheet.Close asChild>
              <div className="HeaderCloseButton">닫기</div>
            </BottomSheet.Close>
          </div>
          <div className="Category">
            <div
              className={classNames("NewSleepCategory", {
                isSelected: isNewSleepCategory,
              })}
              onClick={() => setIsNewSleepCategory(true)}
            >
              새 수면
            </div>
            <div
              className={classNames("NewDreamCategory", {
                isSelected: !isNewSleepCategory,
              })}
              onClick={() => setIsNewSleepCategory(false)}
            >
              새 꿈
            </div>
          </div>
          {isNewSleepCategory ? (
            <div className="NewSleep">
              <SleepTimePicker
                setSleepStart={(sleepStart: string) => {
                  setFormData((prev) => ({ ...prev, sleepStart: sleepStart }));
                }}
                setSleepEnd={(sleepEnd: string) => {
                  setFormData((prev) => ({ ...prev, sleepEnd: sleepEnd }));
                }}
              />
              <div className="MemoContainer">
                <div className="MemoLabel">메모</div>
                <input
                  className="MemoInput"
                  placeholder={"수면 중 특이사항이 있었나요?"}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <div className="SleepRateContainer">
                <div className="TimePickerTextContainer">
                  <div className="TimePickerLabel">수면 만족도</div>
                  <div className="TimePickerTotal">{formData.rate}점</div>
                </div>
                <input
                  className={"SleepRateInput"}
                  onChange={(e) => {
                    setFormData({ ...formData, rate: e.target.value });
                  }}
                  type="range"
                  min={0}
                  max={10}
                  value={formData.rate}
                />
              </div>
              <div className="Bottom">
                <div className="SaveButton" onClick={handleSaveClick}>
                  저장하기
                </div>
              </div>
            </div>
          ) : (
            // @Desc 새 꿈
            <div className="NewDream">
              <div className="MemoContainer">
                <div className="MemoLabel">제목</div>
                <input
                  className="MemoInput"
                  placeholder={"수면을 기록해주세요!"}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="MemoContainer">
                <div className="MemoLabel">꿈 내용</div>
                <input
                  className="MemoInput"
                  placeholder={"수면을 기록해주세요!"}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="DreamCategoryContainer">
                <div className="DreamCategoryTextContainer">
                  <div className="Label">카테고리</div>
                  <HelpIcon
                    className="CategoryDetailButton"
                    onClick={() => {
                      setIsHelpModalOpen(true);
                    }}
                  />
                </div>
                <div className="CategoryList">
                  {dreamCategoryList.map((category, index) => (
                    <div
                      key={index}
                      className={classNames("CategoryItem", {
                        isSelected: formData.dreamCategory === category,
                      })}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          dreamCategory: category,
                        }));
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              {/*<div className="AnalysisContainer">*/}
              {/*  <div className="Label">꿈 분석</div>*/}
              {/*  <div className="AnalysisButton">지난 분석 보기</div>*/}
              {/*</div>*/}
              <div className="Bottom">
                <div className="SaveButton" onClick={handleSaveClick}>
                  저장하기
                </div>
              </div>
            </div>
          )}
        </div>
      </BottomSheet.Content>
    </BottomSheet>
  );
}
