import { gql, useMutation, useQuery } from "@apollo/client";
import NextLink from "next/link";
import {
  Box,
  Kbd,
  Text,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  chakra,
  Divider,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  RiCheckboxBlankCircleFill,
  RiArrowRightSLine,
  RiPencilFill,
  RiCheckFill,
} from "react-icons/ri";
import { useMemo, useState, useEffect } from "react";
import { KeymapButton } from "../../../../components/keymap-button";
import { ImportButton } from "../../../../components/import-button";
import { ExportButton } from "../../../../components/export-button";
import { Meta } from "../../../../components/meta";
import { Layout } from "../../../../components/layout";
import type { Project as ProjectType } from "../../../../graphql-types.generated";
import { ProjectTabBar } from "../../../../components/layout/tab-bar/project-tab-bar";

const ArrowRightIcon = chakra(RiArrowRightSLine);
const CircleIcon = chakra(RiCheckboxBlankCircleFill);
const PenIcon = chakra(RiPencilFill);
const CheckIcon = chakra(RiCheckFill);

export const projectLabelClassesQuery = gql`
  query getProjectLabelClasses($projectId: ID!) {
    project(where: { id: $projectId }) {
      id
      name
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

const updateLabelClassNameMutation = gql`
  mutation updateLabelClassName($id: ID!, $name: String!) {
    updateLabelClass(where: { id: $id }, data: { name: $name }) {
      id
      name
    }
  }
`;

type ClassItemProps = {
  id: string;
  name: string;
  color: string;
  shortcut: string | null;
  edit: boolean;
  setEditClassId: (classId: string | null) => void;
};

const ClassItem = ({
  id,
  name,
  color,
  shortcut,
  edit,
  setEditClassId,
}: ClassItemProps) => {
  const [editName, setEditName] = useState<string | null>(null);
  const [updateLabelClassName] = useMutation(updateLabelClassNameMutation);
  useEffect(() => {
    if (edit) {
      setEditName(name);
    } else {
      setEditName(null);
    }
  }, [edit]);
  return (
    <Flex alignItems="center" height="10">
      <CircleIcon
        flexShrink={0}
        flexGrow={0}
        color={color}
        fontSize="2xl"
        ml="2"
        mr="2"
      />

      {edit && editName != null ? (
        <Input
          variant="flushed"
          flexGrow={1}
          isTruncated
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      ) : (
        <Text flexGrow={1} isTruncated>
          {name}
        </Text>
      )}

      {shortcut && (
        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
          {shortcut}
        </Kbd>
      )}

      {edit && editName != null ? (
        <IconButton
          variant="ghost"
          aria-label={`Edit class ${name} name`}
          icon={<CheckIcon flexShrink={0} flexGrow={0} color="gray.600" />}
          h="8"
          w="8"
          mr="2"
          minWidth="8"
          onClick={() => {
            setEditClassId(null);
            updateLabelClassName({
              variables: { id, name: editName },
              refetchQueries: ["getProjectLabelClasses"],
            });
          }}
        />
      ) : (
        <IconButton
          variant="ghost"
          aria-label={`Edit class ${name} name`}
          icon={<PenIcon flexShrink={0} flexGrow={0} color="gray.600" />}
          h="8"
          w="8"
          mr="2"
          minWidth="8"
          onClick={() => setEditClassId(id)}
        />
      )}
    </Flex>
  );
};

const ClassesPage = () => {
  const router = useRouter();
  const projectId = router?.query?.projectId as string;

  const [editClassId, setEditClassId] = useState<string | null>(null);

  const { data: projectResult, loading } = useQuery<{
    project: ProjectType;
  }>(projectLabelClassesQuery, {
    variables: {
      projectId,
    },
  });

  const projectName = projectResult?.project.name;
  const labelClasses = projectResult?.project.labelClasses ?? [];

  const labelClassWithShortcut = useMemo(
    () =>
      labelClasses.map((labelClass, index) => ({
        ...labelClass,
        shortcut: index > 9 ? null : `${(index + 1) % 10}`,
      })),
    [labelClasses]
  );

  return (
    <>
      <Meta title="Labelflow | Classes" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            spacing="8px"
            sx={{ "*": { display: "inline !important" } }}
            separator={<ArrowRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <NextLink href="/projects">
                <BreadcrumbLink>Projects</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <NextLink href={`/projects/${projectId}`}>
                <BreadcrumbLink>{projectName}</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Classes</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={<ProjectTabBar currentTab="classes" projectId={projectId} />}
      >
        <Flex flexDirection="column" alignItems="center">
          <Box bg="white" m="10" borderRadius="lg" maxWidth="2xl" minWidth="xl">
            <>
              <Text
                margin="2"
                marginLeft="4"
                fontWeight="bold"
                alignSelf="center"
                justifySelf="center"
              >{`${labelClassWithShortcut.length} Classes`}</Text>
              <Divider />
              {!loading &&
                labelClassWithShortcut.map(({ id, name, color, shortcut }) => (
                  <ClassItem
                    key={id}
                    id={id}
                    name={name}
                    color={color}
                    shortcut={shortcut}
                    edit={editClassId === id}
                    setEditClassId={setEditClassId}
                  />
                ))}
            </>
          </Box>
        </Flex>
      </Layout>
    </>
  );
};

export default ClassesPage;
