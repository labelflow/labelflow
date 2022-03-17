import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CloseButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { DOCUMENTATION_URL } from "../../constants";
import {
  CreateTutorialDatasetMutation,
  CreateTutorialDatasetMutationVariables,
} from "../../graphql-types/CreateTutorialDatasetMutation";
import { useWorkspace } from "../../hooks";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { CREATE_TUTORIAL_DATASET_MUTATION } from "./create-tutorial-dataset.mutation";
import { GET_DATASET_BY_SLUG_QUERY } from "./datasets.query";
import { GET_DATASETS_IDS_QUERY } from "./get-datasets-ids.query";

type CommonButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  href: string;
};

const CommonButton = (props: CommonButtonProps) => {
  const { children, href } = props;
  return (
    <NextLink href={href}>
      <Button
        ml={3}
        size="sm"
        alignSelf="flex-end"
        as="a"
        cursor="pointer"
        {...props}
      >
        {children}
      </Button>
    </NextLink>
  );
};

const DocumentationButton = () => (
  <CommonButton
    variant="outline"
    bgColor={useColorModeValue("white", "gray.800")}
    href={DOCUMENTATION_URL}
  >
    Documentation
  </CommonButton>
);

const StartTutorialButton = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const [createTutorialMutation] = useMutation<
    CreateTutorialDatasetMutation,
    CreateTutorialDatasetMutationVariables
  >(CREATE_TUTORIAL_DATASET_MUTATION, {
    variables: { workspaceSlug },
    refetchQueries: [
      GET_DATASET_BY_SLUG_QUERY,
      GET_DATASETS_IDS_QUERY,
      WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
    ],
  });
  return (
    <CommonButton
      colorScheme="brand"
      href={`/${workspaceSlug}/datasets/tutorial`}
      onClick={createTutorialMutation}
    >
      Start Tutorial
    </CommonButton>
  );
};

export const TutorialPrompt = () => (
  <Box
    w="100%"
    boxSizing="border-box"
    p={1}
    m={4}
    bg={useColorModeValue("white", "gray.700")}
    shadow="base"
    rounded="lg"
  >
    <Stack position="relative" spacing="1" p={3}>
      <CloseButton position="absolute" top={3} right={0} />
      <Box>
        <Text fontWeight="semibold">Start the tutorial - 3 min</Text>
        <Text fontSize="sm">
          Learn how to annotate images using basic tools like bounding boxes and
          more advanced ones like AI Assistants
        </Text>
      </Box>
      <Box flexDirection="row" alignSelf="flex-end">
        <DocumentationButton />
        <StartTutorialButton />
      </Box>
    </Stack>
  </Box>
);
