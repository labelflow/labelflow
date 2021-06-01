import { Button, ButtonGroup } from "@chakra-ui/react";
import { useStore } from "../connectors/labelling-state";
import { Layout } from "../components/layout";

const IndexPage = () => {
  const bears = useStore((state) => state.bears);
  const increasePopulation = useStore((state) => state.increasePopulation);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const undoEffect = useStore((state) => state.undoEffect);
  const redoEffect = useStore((state) => state.redoEffect);

  return (
    <Layout>
      <h1>Hello world</h1>
      <h1>{bears} around here ...</h1>
      <ButtonGroup>
        <Button onClick={increasePopulation}>one up</Button>
        <Button onClick={undo}>undo</Button>
        <Button onClick={redo}>redo</Button>
        <Button onClick={undoEffect}>undoEffect</Button>
        <Button onClick={redoEffect}>redoEffect</Button>
      </ButtonGroup>
    </Layout>
  );
};

export default IndexPage;
