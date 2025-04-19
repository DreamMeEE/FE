# FE-DOCS

- [프로젝트 정보](#프로젝트-정보)
- [폴더 정보](#폴더-정보)
- [전역 모달](#전역-모달-생성시-주의-사항)
  - [전역 모달 생성시 주의 사항](#전역-모달-생성시-주의-사항)
  - [전역 모달 등록 방법](#전역-모달-등록-방법)
  - [전역 모달 호출 방법](#전역-모달-호출-방법)
  - [전역 모달 닫는 방법](#전역-모달-닫는-방법)
- [다국어 적용 방법](#다국어-적용-방법)

## 프로젝트 정보

- node: v20.11.0 (20+)
- npm 대신 yarn을 사용해주세요.
- IDE의 prettier 설정 반드시 부탁드립니다.

## 폴더 정보

- components
  - common: 두 번 이상 재사용되는 컴포넌트를 관리합니다.
  - modals: 모달을 관리합니다.
  - pages: _ApplicationRoutes에서_ 라우팅되는 페이지의 컴포넌트를 관리합니다. (pages/ExampleComponent를 참고해주세요.)
    - hooks 해당 컴포넌트에서 사용되는 커스텀 훅을 관리합니다.
- services: api 요청 함수를 관리합니다.
- utils: 여러 곳에서 재사용되는 로직들을 관리합니다.

## 전역 모달 생성시 주의 사항

모달 생성시 `ExampleModal`을 참고해주세요.

전역 모달을 생성할 때는 `ModalProps` 타입을 상속받아야 합니다.

```typescript
// example
export interface ModalProps {
  id: string;
  setModalClose: (callback: Function) => void;
}

export interface ErrorModalProps extends ModalProps {
  close: Function;
  text: string;
}
```

전역 모달 컴포넌트에서 `props`로 해당 모달의 id와 `setModalClose` 함수가 전달됩니다.
따라서 전역으로 사용될 모달 컴포넌트를 생성할 때는 Modal 인터페이스를 상속받아서 사용해야 합니다.

## 전역 모달 등록 방법

전역으로 사용할 모달은 `src/constants/ModalList.ts` 파일의 `MODAL_LIST`에 등록합니다.

```typescript
export const MODAL_LIST = {
  errorModal: ErrorModal,
  userDecisionModal: UserDecisionModal,
  alertModal: ExampleModal,
} as const;
```

## 전역 모달 호출 방법

전역 모달을 사용할 컴포넌트에서 `useModal` 훅을 사용하여 `setModalOpen` 함수를 호출합니다.

`setModalOpen` 함수는 두 번째 인자로 `MODAL_LIST에` 등록한 모달 컴포넌트의 `props`를 전달해야 합니다.

`setModalOpen`함수는 해당 모달의 `id`를 반환합니다.
해당 `id`를 `setModalClose`의 첫 번째 인자로 전달하여 모달을 직접 삭제하는 것도 가능합니다.

```jsx
<button
  onClick={() =>
    setModalOpen("alertModal", {
      bodyText: "modal body",
      headerText: "Header",
      onConfirm: () => {
        console.log("확인 버튼 클릭");
      },
    })
  }
>
  alertModal 열기
</button>
```

## 전역 모달 닫는 방법

`useModal` 훅의 `setModalClose` 함수를 호출하여 모달을 닫을 수 있습니다. 해당 함수에 모달의 `id`를 반드시 전달해야 합니다.
단, 모달 컴포넌트 내부에서 모달을 닫는 로직을 실행하려면 `props`에서 `setModalClose`함수를 전달받아서 콜백 함수만 전달하시면 됩니다.

콜백 함수는 동기, 비동기 함수 모두 전달할 수 있습니다. 비동기 로직이 끝난 후 모달이 닫힙니다.

## 다국어 적용 방법

다국어를 지원하기 위해서는 `constants/localization` 폴더에 언어 정보를 `.ts` 파일로 정의합니다.

`useLanguage` 훅을 사용하여 `getLanguageTextData` 함수를 가져와서 사용하면 됩니다.

```typescript
getLanguageTextData("Hello");
```

만약 보간법이 필요하다면 아래와 같이 사용하시면 됩니다.

```typescript
getLanguageTextData("WELCOME", { name: "", age: "" });
```

만약 정적으로 저장된 텍스트 정보가 아니라 서버에서 받아온 텍스트라면 `getMultilingualText`함수를 사용하시면 됩니다.

```typescript
getMultilingualText(ITEM.NAME, ITEM.EN_NAME);
```
