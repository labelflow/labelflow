import {
  Box,
  Stack,
  Heading,
  LightMode,
  Button,
  Text,
  Center,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { DOCUMENTATION_URL } from "../../../constants";
import * as Logo from "./Brands";

export const LogoGrid = () => {
  return (
    <Box as="section" py="48" bg={useColorModeValue("gray.50", "gray.800")}>
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
          Connect seamlessly with the best machine learning tools
        </Heading>
        <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
          An added benefit of being <strong>open source</strong> is that
          LabelFlow image labeling tool can integrate with a ton of tools in the
          ecosystem, thanks to a clean <strong>API and SDKs</strong>. Image
          storage, databases, data warehouses, deployment tools and AI libraries
          all work seamlessly with LabelFlow. If you want to make it easier you
          can also export your datasets in COCO or YOLO format for example.
        </Text>
        <Center>
          <Box>
            <LightMode>
              <Button
                mt="8"
                as="a"
                href={DOCUMENTATION_URL}
                target="blank"
                size="lg"
                colorScheme="brand"
                fontWeight="bold"
              >
                Discover more
              </Button>
            </LightMode>
          </Box>
        </Center>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          mt="24"
          spacing="6"
          color={useColorModeValue("inherit", "white")}
        >
          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.python.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Python h="8" opacity={0.92} />
            <Text>Python</Text>
          </Stack>
          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://pytorch.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.PyTorch h="8" opacity={0.92} />
            <Text>PyTorch</Text>
          </Stack>
          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.tensorflow.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.TensorFlow h="8" opacity={0.92} />
            <Text>TensorFlow</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://keras.io/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Keras h="8" opacity={0.92} />
            <Text>Keras</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.postgresql.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Postgres h="8" opacity={0.92} />
            <Text>PostgreSQL</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.mysql.com/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.MySql h="8" opacity={0.92} />
            <Text>MySQL</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.snowflake.com/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Snowflake h="8" opacity={0.92} />
            <Text>Snowflake</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://cloud.google.com/bigquery/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.BigQuery h="8" opacity={0.92} />
            <Text>Google BigQuery</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://aws.amazon.com/redshift/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Redshift h="8" opacity={0.92} />
            <Text>AWS Redshift</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://aws.amazon.com/s3/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.AwsS3 h="8" opacity={0.92} />
            <Text>Amazon S3</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://cloud.google.com/storage"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.CloudStorage h="8" opacity={0.92} />
            <Text>Google Cloud Storage</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://azure.microsoft.com/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Azure h="8" opacity={0.92} />
            <Text>Microsoft Azure</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.docker.com/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Docker h="8" opacity={0.92} />
            <Text>Docker</Text>
          </Stack>

          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.typescriptlang.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Typescript h="8" opacity={0.92} />
            <Text>Typescript</Text>
          </Stack>
          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://graphql.org/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.GraphQl h="8" opacity={0.92} />
            <Text>GraphQL</Text>
          </Stack>
          <Stack
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/"
            alignItems="center"
            py="6"
            px="8"
            bg={useColorModeValue("white", "gray.900")}
            rounded={{ md: "lg" }}
            _hover={{ shadow: "lg" }}
            transitionProperty="box-shadow"
            transitionDuration="0.1s"
          >
            <Logo.Github h="8" opacity={0.92} />
            <Text>Github</Text>
          </Stack>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
