import MockDate from "mockdate";

export const initMockedDate = () => {
  MockDate.set("2021-05-31 12:00:00");
};

export const incrementMockedDate = (increment: number) => {
  MockDate.set(new Date(Date.now() + increment));
};
