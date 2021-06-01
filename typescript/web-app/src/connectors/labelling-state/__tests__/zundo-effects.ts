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

test("It should not be able to undo when no effect was performed", () => {
  const store = createUndoStore();

  expect(store.getState().canUndo()).toBeFalsy();
});

test("It should be able to undo when effect was performed", () => {
  const testEffect: Effect = {
    do: () => {},
    undo: () => {},
  };

  const store = createUndoStore();
  store.getState().perform(testEffect);

  expect(store.getState().canUndo()).toBeTruthy();
});

test("It should not be able to redo when no effect was undone", () => {
  const store = createUndoStore();

  expect(store.getState().canRedo()).toBeFalsy();
});

test("It should be able to redo when effect was undone", () => {
  const testEffect: Effect = {
    do: () => {},
    undo: () => {},
  };

  const store = createUndoStore();
  store.getState().perform(testEffect);
  store.getState().undo();

  expect(store.getState().canRedo()).toBeTruthy();
});

test("Undo nothing should not have effect when no effect was performed", () => {
  const store = createUndoStore();
  store.getState().undo();

  expect(store.getState().futureEffects).toHaveLength(0);
});

test("Redo nothing should not have effect when no effect was performed", () => {
  const store = createUndoStore();
  store.getState().redo();

  expect(store.getState().prevEffects).toHaveLength(0);
});

test("It should reset internal state of the store when cleared", () => {
  const testEffect: Effect = {
    do: () => {},
    undo: () => {},
  };

  const store = createUndoStore();
  store.getState().perform(testEffect);

  store.getState().clear();
  expect(store.getState().canUndo()).toBeFalsy();
});

test("It passes the result of the do to the undo", () => {
  const testEffect: Effect = {
    do: () => 0,
    undo: jest.fn(),
  };

  const store = createUndoStore();
  store.getState().perform(testEffect);
  store.getState().undo();

  expect(testEffect.undo).toHaveBeenCalledWith(0);
});

test("It passes the result of the undo to the redo", () => {
  const testEffect: Effect = {
    do: () => 0,
    undo: () => 1,
    redo: jest.fn(),
  };

  const store = createUndoStore();
  store.getState().perform(testEffect);
  store.getState().undo();
  store.getState().redo();

  expect(testEffect.redo).toHaveBeenCalledWith(1);
});
