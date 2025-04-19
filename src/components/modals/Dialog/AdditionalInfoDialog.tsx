import Dialog from "./Dialog";
import { useNavigate } from "react-router-dom";
import RadialChart from "../../common/RadialChart/RadialChart.tsx";

// export default function AdditionalInfoDialog({
//   open,
//   onOpenChange,
//   hasCancel = true,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   hasCancel?: boolean;
// }) {
//   const navigate = useNavigate();
//
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <Dialog.Content hasCancel={hasCancel} onAction={() => {}}>
//         파티에 참여하기 위해서는
//         <br />
//         추가정보 입력이 필요합니다.
//       </Dialog.Content>
//     </Dialog>
//   );
// }

export function DreamCategoryDialog({
  open,
  onOpenChange,
  hasCancel = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasCancel?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content hasCancel={hasCancel} onAction={() => {}}>
        <div className="CategoryDetailContainer">
          <div className={"CategoryContainerTitle"}>꿈 카테고리 의미</div>
          <div className={"CategoryContainerSubTitle"}>꿈 카테고리 의미</div>
          <div className="CategoryList">
            <div className={"CategoryItem"}>
              <div className="CategoryName" style={{ background: "#626262" }}>
                잡몽
              </div>
              <div className={"CategoryDesc"}>의미 없이 욕망이 반영된 꿈</div>
            </div>
            <div className={"CategoryItem"}>
              <div className="CategoryName" style={{ background: "#EE2026" }}>
                허몽
              </div>
              <div className={"CategoryDesc"}>몸이 안 좋을 때나 많이 꾸는 우울한 꿈</div>
            </div>
            <div className={"CategoryItem"}>
              <div className="CategoryName" style={{ background: "#6FCCDD" }}>
                영몽
              </div>
              <div className={"CategoryDesc"}>조상 등이 나타나는 영적 경고 꿈</div>
            </div>
            <div className={"CategoryItem"}>
              <div className="CategoryName" style={{ background: "#FBB039" }}>
                정몽
              </div>
              <div className={"CategoryDesc"}>염려하던 일이 반영되거나 실현되는 꿈</div>
            </div>
            <div className={"CategoryItem"}>
              <div className="CategoryName" style={{ background: "#3954A5" }}>
                심몽
              </div>
              <div className={"CategoryDesc"}>평소 생각이나 걱정이 반영된 꿈</div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export function RadialGraphGuideDialog({
  open,
  onOpenChange,
  hasCancel = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasCancel?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content hasCancel={hasCancel} onAction={() => {}}>
        <div className="RadialGraphGuideDialogContainer">
          <div className={"GuideTitle"}>
            <div className={"TitleTop"}>트래커 가이드</div>
            <div className={"TitleBottom"}>수면/꿈을 기록하면 트래커에 적용됩니다.</div>
          </div>
          <div className={"GuideGraphContainer"}>
            <div className={"GoalText"}>목표 수면 달성</div>
            <RadialChart width={200} height={200} satisfactionPercentage={40} sleepPercentage={70} />
            <div className={"RateText"}>수면 만족도</div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
