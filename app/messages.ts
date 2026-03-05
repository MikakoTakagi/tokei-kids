export const messages = {
  ja: {
    start: "スタート",
    end: "おしまい",
    duration: "分間",
    placeholder: "何分後にする？",
    minute: "分",
    cancel: "取り消し",
    finished: "おしまい",
    goBack: "もどる",
  },
  en: {
    start: "Start",
    end: "End",
    duration: "min",
    placeholder: "How many minutes?",
    minute: "min",
    cancel: "Cancel",
    finished: "Time's Up!",
    goBack: "Back",
  },
  zh: {
    start: "开始",
    end: "结束",
    duration: "分钟",
    placeholder: "几分钟后？",
    minute: "分",
    cancel: "取消",
    finished: "结束啦！",
    goBack: "返回",
  },
  ko: {
    start: "시작",
    end: "종료",
    duration: "분",
    placeholder: "몇 분 후로 할까요?",
    minute: "분",
    cancel: "취소",
    finished: "끝났어요!",
    goBack: "돌아가기",
  },
};

export type Lang = keyof typeof messages;
