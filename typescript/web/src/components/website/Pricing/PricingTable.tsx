import {
  Box,
  useColorModeValue,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  useToken,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";

import { BiCheckCircle } from "react-icons/bi";
import { columns, data } from "./_data";

export const PricingTable = () => {
  const colorToken = useColorModeValue("brand.600", "brand.400");
  const color = useToken("colors", colorToken);
  const headerBg = useColorModeValue("gray.50", "gray.800");
  // console.log(headerBg);
  return (
    <Box
      as="section"
      // bg={useColorModeValue("gray.50", "gray.800")}
      py="48"
      px={{ base: "4", md: "8" }}
      overflowX="scroll"
    >
      <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
        Labelflow pricing fits your business
      </Heading>

      <Table
        my="8"
        borderWidth="1px"
        fontSize="sm"
        size="lg"
        borderRadius="4"
        mt="24"
      >
        {/* <Thead backgroundColor={headerBg}> */}
        {data.map((row, index) => {
          if (row.type === "header") {
            return (
              <Thead backgroundColor={headerBg} key={index}>
                <Tr
                  key={index}
                  // position="sticky" top="0" // if only....
                >
                  {columns.map((column, colIndex) => {
                    const cell = row[column.accessor as keyof typeof row];

                    return (
                      <Th
                        scope="col"
                        textTransform="initial"
                        letterSpacing="initial"
                        key={colIndex}
                        fontWeight="bold"
                        // textAlign={index === 0 ? "start" : "center"}
                      >
                        {cell}
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
            );
          }
          if (row.type === "sectionHeader") {
            const column = columns[0];
            const cell = row[column.accessor as keyof typeof row];

            return (
              <Thead backgroundColor={headerBg} key={index}>
                <Tr key={index}>
                  <Th
                    colSpan={5}
                    scope="col"
                    textTransform="initial"
                    letterSpacing="initial"
                    key={index}
                    fontWeight="bold"
                    // textAlign={index === 0 ? "start" : "center"}
                  >
                    {cell}
                  </Th>
                </Tr>
              </Thead>
            );
          }
          return (
            <Tbody key={index}>
              <Tr key={index}>
                {columns.map((column, colIndex) => {
                  const cell = row[column.accessor as keyof typeof row];

                  return (
                    <Td
                      // whiteSpace="nowrap"
                      key={colIndex}
                      // textAlign={index === 0 ? "start" : "center"}
                    >
                      {cell === true ? (
                        // <Center>
                        <BiCheckCircle size="1.5em" style={{ color }} />
                      ) : (
                        // </Center>
                        cell
                      )}
                    </Td>
                  );
                })}
              </Tr>
            </Tbody>
          );
        })}
      </Table>
    </Box>
  );
};
