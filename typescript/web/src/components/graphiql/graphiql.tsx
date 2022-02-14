import GraphiQLOriginal from "graphiql";
import "graphiql/graphiql.css";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Flex } from "@chakra-ui/react";

export const GraphiQL = ({ url }: { url: string }) => {
  const fetcher = createGraphiQLFetcher({
    url,
  });

  return (
    <Flex grow={1}>
      <GraphiQLOriginal
        fetcher={fetcher}
        editorTheme="dracula"
        defaultVariableEditorOpen
        defaultSecondaryEditorOpen
        headerEditorEnabled
        shouldPersistHeaders
      />
    </Flex>
  );
};
