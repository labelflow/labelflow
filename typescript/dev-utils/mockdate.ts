import MockDate from "mockdate";

const mockedDate = "2021-05-31 12:00:00";

export const initMockedDate = () => {
  MockDate.set(mockedDate);
};

export const incrementMockedDate = (increment: number) => {
  MockDate.set(new Date(Date.now() + increment));
};
