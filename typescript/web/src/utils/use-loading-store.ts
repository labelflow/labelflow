import create from "zustand";

type TutorialLoadingState = {
  tutorialDatasetLoading: boolean;
  setTutorialDatasetLoading: (value: boolean) => void;
};

export const useTutorialLoadingStore = create<TutorialLoadingState>((set) => ({
  tutorialDatasetLoading: false,
  setTutorialDatasetLoading: (newValue: boolean) =>
    set(() => ({ tutorialDatasetLoading: newValue })),
}));
