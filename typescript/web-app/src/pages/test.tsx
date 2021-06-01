import { useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useUndoStore } from "../connectors/zundo-effects";
import { useLabellingStore } from "../connectors/labelling-state";
import { Layout } from "../components/layout";

const IndexPage = () => {
  const fishes = useLabellingStore((state) => state.fishes);

  const increaseBearPopulationEffect = () => ({
    do: () => {
      useLabellingStore.setState((state) => ({
        fishes: state.fishes + 1,
      }));
    },
    undo: () => {
      useLabellingStore.setState((state) => ({
        fishes: state.fishes - 1,
      }));
    },
  });

  const { perform, undo, redo, canRedo, canUndo } = useUndoStore();

  return (
    <Layout>
      <h1>Hello world</h1>
      <h1>{fishes} around here ...</h1>
      <ButtonGroup>
        <Button onClick={() => perform(increaseBearPopulationEffect())}>
          one up
        </Button>
        <Button onClick={undo} disabled={!canUndo()}>
          undo
        </Button>
        <Button onClick={redo} disabled={!canRedo()}>
          redo
        </Button>
      </ButtonGroup>
    </Layout>
  );
};

export default IndexPage;
