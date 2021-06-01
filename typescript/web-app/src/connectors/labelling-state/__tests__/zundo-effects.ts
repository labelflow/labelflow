import { createUndoStore, Effect } from "../zundo-effects";

test("It calls the `do` of the effect when it is performed", () => {
  const testEffect: Effect = { do: jest.fn(), undo: jest.fn() };

  createUndoStore().getState().perform(testEffect);

  expect(testEffect.do).toHaveBeenCalledTimes(1);
});

test("It calls the `undo` of the effect when we undo the last effect", () => {
  const testEffect: Effect = { do: jest.fn(), undo: jest.fn() };
  const store = createUndoStore();

  store.getState().perform(testEffect);
  store.getState().undo();

  expect(testEffect.undo).toHaveBeenCalledTimes(1);
});

test("It calls the `redo` of an undone effect", () => {
  const testEffect: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  };
  const store = createUndoStore();

  store.getState().perform(testEffect);
  store.getState().undo();
  store.getState().redo();

  expect(testEffect.redo).toHaveBeenCalledTimes(1);
});

test("It can undo a 'redone' effect", () => {
  const testEffect: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  };
  const store = createUndoStore();

  store.getState().perform(testEffect);
  store.getState().undo();
  store.getState().redo();
  store.getState().undo();

  expect(testEffect.undo).toHaveBeenCalledTimes(2);
});

test("It fallbacks on `do` if no `redo` is provided", () => {
  const testEffect: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
  };
  const store = createUndoStore();

  store.getState().perform(testEffect);
  store.getState().undo();
  store.getState().redo();

  expect(testEffect.do).toHaveBeenCalledTimes(2);
});

test("It can undo multiple effects in a row", () => {
  const testEffect1: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
  };

  const testEffect2: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
  };
  const store = createUndoStore();

  store.getState().perform(testEffect1);
  store.getState().perform(testEffect2);
  store.getState().undo();
  expect(testEffect2.undo).toHaveBeenCalledTimes(1);
  expect(testEffect1.undo).toHaveBeenCalledTimes(0);
  store.getState().undo();
  expect(testEffect1.undo).toHaveBeenCalledTimes(1);
});

test("It can redo multiple undo in a row", () => {
  const testEffect1: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  };

  const testEffect2: Effect = {
    do: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
  };
  const store = createUndoStore();

  store.getState().perform(testEffect1);
  store.getState().perform(testEffect2);
  store.getState().undo();
  store.getState().undo();

  store.getState().redo();
  expect(testEffect1.redo).toHaveBeenCalledTimes(1);
  expect(testEffect2.redo).toHaveBeenCalledTimes(0);

  store.getState().redo();
  expect(testEffect1.redo).toHaveBeenCalledTimes(1);
});
