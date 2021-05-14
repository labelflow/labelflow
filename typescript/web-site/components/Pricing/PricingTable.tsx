import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  useToken,
  Tfoot,
  Tr,
  Center,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";

import { GiBarefoot, GiRunningShoe, GiConverseShoe } from "react-icons/gi";
import { BiSupport, BiCheckCircle } from "react-icons/bi";
import { columns, data } from "./_data";

import { ActionButton } from "./ActionButton";
import { PricingCard } from "./PricingCard";

export const PricingTable = () => {
  const colorToken = useColorModeValue("brand.600", "brand.400");
  const color = useToken("colors", colorToken);
  const headerBg = useColorModeValue("gray.50", "gray.800");
  // console.log(headerBg);
  return (
    <Box
      id="pricing"
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
                  {columns.map((column, index) => {
                    const cell = row[column.accessor as keyof typeof row];

                    return (
                      <Th
                        scope="col"
                        textTransform="initial"
                        letterSpacing="initial"
                        key={index}
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
                {columns.map((column, index) => {
                  const cell = row[column.accessor as keyof typeof row];

                  return (
                    <Td
                      // whiteSpace="nowrap"
                      key={index}
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
