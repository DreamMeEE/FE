import classNames from "classnames";
import RadialChart from "../../common/RadialChart/RadialChart.tsx";
import { api } from "../../../services/api.ts";
import { useEffect, useState } from "react";
import { calculateSleepPercentage } from "../../pages/RecordPage/RecordPage.tsx";
import "./_OneMonthRadialChart.scss";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type OneMonthItem = {
  day: number;
  rate: string;
  time: number;
  id: number;
};

export function OneMonthRadialChart({
  selectedDay,
  setSelectedDay,
  setIsOneMonthModalOpen,
}: {
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  setIsOneMonthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [oneMonthData, setOneMonthData] = useState<OneMonthItem[]>([]);
  const getOneMonthData = () => {
    return api.get<OneMonthItem[]>(`/calendar/month?year=2025&month=4&day=${selectedDay}`);
  };

  useEffect(() => {
    getOneMonthData().then((res) => {
      setOneMonthData([
        {
          day: 0,
          rate: "0",
          time: 0,
          id: 0,
        },
        {
          day: 0,
          rate: "0",
          time: 0,
          id: 0,
        },
        ...res.data,
      ]);
    });
  }, []);

  return (
    <div className="OneMonthRadialChart">
      <div className="RadialChartList">
        {/*@todo ? getCUrrentWeekDates는 뭐지
          이거를 weekly로 가져와야 함.
        */}
        {oneMonthData.map((el, index) => (
          <div
            className="RadialChartItem"
            onClick={() => {
              if (el.id !== null && el.id !== 0) {
                setSelectedDay(el.day);
                setIsOneMonthModalOpen(false);
              }
            }}
          >
            {/* 30개 들어오니까 index가 7일 때마다 0으로 초기화되어야 함.*/}
            <div className="Day">{WEEKDAYS[index]}</div>
            <div
              className={classNames("Date", {
                isToday: selectedDay === el.day,
              })}
            >
              {el.day !== 0 && el.day}
            </div>
            <div style={{ visibility: el.day !== 0 ? "visible" : "hidden" }}>
              <RadialChart
                satisfactionPercentage={calculateSleepPercentage(el?.time ?? 0)}
                sleepPercentage={Number(el?.rate) * 10 ?? 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
