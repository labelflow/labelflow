import { sleep } from "@labelflow/utils";
import { createUndoStore, Effect } from "./create-undo-store";

describe(createUndoStore, () => {
  it("calls the `do` of the effect when it is performed", () => {
    const testEffect: Effect = { do: jest.fn(), undo: jest.fn() };
    createUndoStore().getState().perform(testEffect);
    expect(testEffect.do).toHaveBeenCalledTimes(1);
  });

  it("calls the `undo` of the effect when we undo the last effect", async () => {
    const testEffect: Effect = { do: jest.fn(), undo: jest.fn() };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    expect(testEffect.undo).toHaveBeenCalledTimes(1);
  });

  it("calls the `redo` of an undone effect", async () => {
    const testEffect: Effect = {
      do: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    await store.getState().redo();
    expect(testEffect.redo).toHaveBeenCalledTimes(1);
  });

  it("can undo a 'redone' effect", async () => {
    const testEffect: Effect = {
      do: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    await store.getState().redo();
    await store.getState().undo();
    expect(testEffect.undo).toHaveBeenCalledTimes(2);
  });

  it("fallbacks on `do` if no `redo` is provided", async () => {
    const testEffect: Effect = {
      do: jest.fn(),
      undo: jest.fn(),
    };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    await store.getState().redo();
    expect(testEffect.do).toHaveBeenCalledTimes(2);
  });

  it("can undo multiple effects in a row", async () => {
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
    await store.getState().undo();
    expect(testEffect2.undo).toHaveBeenCalledTimes(1);
    expect(testEffect1.undo).toHaveBeenCalledTimes(0);
    await store.getState().undo();
    expect(testEffect1.undo).toHaveBeenCalledTimes(1);
  });

  it("can redo multiple undo in a row", async () => {
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
    await store.getState().undo();
    await store.getState().undo();
    await store.getState().redo();
    expect(testEffect1.redo).toHaveBeenCalledTimes(1);
    expect(testEffect2.redo).toHaveBeenCalledTimes(0);
    await store.getState().redo();
    expect(testEffect2.redo).toHaveBeenCalledTimes(1);
  });

  it("informs the user that he can't undo some effect", () => {
    const store = createUndoStore();
    expect(store.getState().canUndo()).toBeFalsy();
  });

  it("informs the user when he can undo some effect", () => {
    const testEffect: Effect = { do: () => {}, undo: () => {} };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    expect(store.getState().canUndo()).toBeTruthy();
  });

  it("prevents redo when no effect was undone", () => {
    const store = createUndoStore();
    expect(store.getState().canRedo()).toBeFalsy();
  });

  it("allows redo when effect was undone", async () => {
    const testEffect: Effect = { do: () => {}, undo: () => {} };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    expect(store.getState().canRedo()).toBeTruthy();
  });

  it("does not performs any effect when undo is empty", async () => {
    const store = createUndoStore();
    await store.getState().undo();
    expect(store.getState().futureEffects).toHaveLength(0);
  });

  it("does not performs any effect when redo is empty", async () => {
    const store = createUndoStore();
    await store.getState().redo();
    expect(store.getState().pastEffects).toHaveLength(0);
  });

  it("resets the internal state of the store when cleared", () => {
    const testEffect: Effect = { do: () => {}, undo: () => {} };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    store.getState().clear();
    expect(store.getState().canUndo()).toBeFalsy();
  });

  it("passes the result of the do to the undo", async () => {
    const testEffect: Effect = { do: () => 0, undo: jest.fn() };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    expect(testEffect.undo).toHaveBeenCalledWith(0);
  });

  it("passes the result of the undo to the redo", async () => {
    const testEffect: Effect = { do: () => 0, undo: () => 1, redo: jest.fn() };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    await store.getState().redo();
    expect(testEffect.redo).toHaveBeenCalledWith(1);
  });

  it("accepts async function for `do` function", async () => {
    const testEffect: Effect = { do: async () => 0, undo: jest.fn() };
    const store = createUndoStore();
    store.getState().perform(testEffect);
    await store.getState().undo();
    expect(testEffect.undo).toHaveBeenCalledWith(0);
  });

  it("executes three undo not awaited", async () => {
    let state = "";
    const testEffect: Effect = {
      do: async () => {
        state += "do-";
      },
      undo: async () => {
        state += "undo-";
      },
    };

    const store = createUndoStore();
    store.getState().perform(testEffect);
    store.getState().perform(testEffect);
    store.getState().perform(testEffect);
    store.getState().undo();
    store.getState().undo();
    await store.getState().undo();

    expect(state).toEqual("do-do-do-undo-undo-undo-");
  });

  it("executes awaited async operations in the right order", async () => {
    let state = "";
    const testEffect: (index: number) => Effect = (index) => {
      return {
        do: async () => {
          await sleep(10 - index * 3);
          state += `do${index}-`;
        },
        undo: async () => {
          state += `undo${index}-`;
        },
        redo: async () => {
          state += `redo${index}-`;
        },
      };
    };

    const store = createUndoStore();

    await Promise.all([
      store.getState().perform(testEffect(1)),
      store.getState().perform(testEffect(2)),
      store.getState().perform(testEffect(3)),
      store.getState().undo(),
      store.getState().undo(),
      store.getState().undo(),
      store.getState().redo(),
      store.getState().redo(),
      store.getState().redo(),
    ]);

    expect(state).toEqual("do3-undo3-redo3-do2-undo2-redo2-do1-undo1-redo1-");
  });

  it("executes properly several async undo/redo operations", async () => {
    let state = "";
    const testEffect: (index: number) => Effect = (index) => {
      return {
        do: async () => {
          await sleep(index * 3);
          state += `do${index}-`;
        },
        undo: async () => {
          state += `undo${index}-`;
        },
        redo: async () => {
          state += `redo${index}-`;
        },
      };
    };

    const store = createUndoStore();

    store.getState().perform(testEffect(1));
    store.getState().perform(testEffect(2));
    store.getState().perform(testEffect(3));
    await store.getState().undo();
    await store.getState().redo();
    await store.getState().undo();
    await store.getState().redo();
    await store.getState().undo();
    await store.getState().redo();
    expect(state).toEqual("do1-do2-do3-undo3-redo3-undo3-redo3-undo3-redo3-");
  });

  it("does not allow to redo an undo if an effect was performed", async () => {
    const testEffect = {
      do: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    };

    const store = createUndoStore();

    store.getState().perform(testEffect);
    store.getState().undo();
    store.getState().perform(testEffect);

    expect(store.getState().canRedo()).toBeFalsy();
  });

  it("throws an error when an effect throws an error", async () => {
    const testEffect: Effect = {
      do: async () => {
        throw new Error("Crashing!");
      },
      undo: jest.fn(),
    };
    const store = createUndoStore();
    await expect(store.getState().perform(testEffect)).rejects.toEqual(
      new Error("Crashing!")
    );
  });

  it("does not store an effect that throws an error when performed", async () => {
    const testEffect: Effect = {
      do: async () => {
        throw new Error("Crashing!");
      },
      undo: jest.fn(),
    };
    const store = createUndoStore();
    await store
      .getState()
      .perform(testEffect)
      .catch(() => expect(store.getState().pastEffects).toHaveLength(0));
  });
});
