import { undoMiddleware } from "zundo";
import create, { State, StateCreator } from "zustand";
import { client } from "../apollo-client";
import { SideEffectState, sideEffect } from "./side-effect-middleware";

/**
 * The state type. Note that it extends UndoState
 */
export interface StoreState extends SideEffectState {
  bears: number;
}

// creates a store with undo/redo capability
const domainStore = create<StoreState>((set) => ({
  bears: 0,
  //   setState: (newState)=> set((state) => newState
  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
}));

/**
 * The state creator and resolver functions
 */
const useUndoStore = createSuperUndoStore((set, get) => ({}));

const increment = () => ({
  do: () => {
    domainStore.setState((state) => ({ count: state.count + 1 }));
  },
  undo: () => {
    domainStore.setState((state) => ({ count: state.count - 1 }));
  },
  redo: () => {
    domainStore.setState((state) => ({ count: state.count + 1 }));
  },
});

const createLabel = () => {
  return {
    do: async () => {
      const { data } = await client.mutate({
        mutation: `mutation create`,
        variables: {},
      });

      // passed to undo
      return data.id;
    },
    undo: async (id) => {
      const { data } = await client.mutate({
        mutation: `mutation softDelete`,
        variables: { id },
      });
      // passed to redo
      return id;
    },
    redo: (id) => {
      const { data } = await client.mutate({
        mutation: `mutation restore`,
        variables: { id },
      });

      // passed to the next undo
      return id;
    },
  };
};

const deleteLabel = (id: string) => {
  const labelBeforeDeletion;

  return {
    do: async () => {
      const { data } = await client.query({
        query: `query labelData`,
        variables: { id },
      });

      labelBeforeDeletion = data;

      await client.mutate({
        mutation: `mutation hardDelete`,
        variables: { id },
      });
    },
    undo: async () => {
      const { data } = await client.mutate({
        mutation: `mutation create`,
        variables: { data: labelBeforeDeletion },
      });
    },
    redo: () => {
      const { data } = await client.mutate({
        mutation: `mutation hardDelete`,
        variables: { id },
      });
    },
  };
};

const selectTool = (tool: string) => {
  let previousTool;

  return {
    do: () => {
      domainStore.setState((state) => {
        previousTool = state.selectedTool;
        return { selectedTool: tool };
      });
    },
    undo: async () => {
      domainStore.setState((state) => ({ selectedTool: previousTool }));
    },
    redo: () => {
      domainStore.setState((state) => ({ selectedTool: tool }));
    },
  };
};

const Component = () => {
  const store = useUndoStore();

  return (
    <>
      <button onClick={() => store.perform(increment())} />
      <button onClick={() => store.perform(createLabel())} />
      <button onClick={() => store.perform(deleteLabel("id-toto"))} />
      <button onClick={() => store.undo()} />
      <button onClick={() => store.redo()} />
    </>
  );
};
