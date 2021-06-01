import { useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useStore } from "../connectors/zundo-effects";
import { Layout } from "../components/layout";

const IndexPage = () => {
  const [bearsCount, setBearsCount] = useState(0);

  const increaseBearPopulationEffect = () => ({
    do: () => {
      setBearsCount((previousBearCount) => previousBearCount + 1);
    },
    undo: () => {
      setBearsCount((previousBearCount) => previousBearCount - 1);
    },
  });

  const { perform, undo, redo, canRedo, canUndo } = useStore();
  const increaseBearPopulation = () => perform(increaseBearPopulationEffect());

  return (
    <Layout>
      <h1>Hello world</h1>
      <h1>{bearsCount} around here ...</h1>
      <ButtonGroup>
        <Button onClick={increaseBearPopulation}>one up</Button>
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
