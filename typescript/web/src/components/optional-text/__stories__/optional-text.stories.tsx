import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { OptionalText } from "..";
import { chakraDecorator, storybookTitle } from "../../../utils/storybook";
import { TEST_CASES } from "../optional-text.fixtures";

export default {
  title: storybookTitle(OptionalText),
  decorators: [chakraDecorator],
};

export const Default = () => (
  <Table>
    <Thead>
      <Tr>
        <Td>Props</Td>
        <Td>Expected</Td>
        <Td>Actual</Td>
      </Tr>
    </Thead>
    <Tbody>
      {TEST_CASES.map(([props, expected], index) => {
        const { hideEmpty, text, error } = props;
        const addBgColor =
          !isNil(hideEmpty) || (isEmpty(text) && isEmpty(error));
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Tr key={index}>
            <Td>{JSON.stringify(props)}</Td>
            <Td>{expected}</Td>
            <Td>
              <OptionalText
                bgColor={addBgColor ? "#cccccc" : undefined}
                {...props}
              />
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);
