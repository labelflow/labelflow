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
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  RiCheckboxBlankCircleFill,
  RiArrowRightSLine,
  RiPencilFill,
  RiCheckFill,
  RiCloseFill,
  RiDeleteBin5Fill,
} from "react-icons/ri";
import { useMemo, useState, useEffect, useCallback } from "react";
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
const CloseIcon = chakra(RiCloseFill);
const DeleteIcon = chakra(RiDeleteBin5Fill);

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
  projectId: string;
};

const ClassItem = ({
  id,
  name,
  color,
  shortcut,
  edit,
  setEditClassId,
  projectId,
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

  const updateLabelClassNameWithOptimistic = useCallback(() => {
    setEditClassId(null);
    updateLabelClassName({
      variables: { id, name: editName },
      optimisticResponse: {
        updateLabelClass: {
          id,
          name: editName,
          color,
          __typeName: "LabelClass",
        },
      },
      update: (cache, { data: { updateLabelClass } }) => {
        const projectCacheResult = cache.readQuery<{
          project: {
            id: string;
            name: string;
            labelClasses: {
              id: string;
              name: string;
              color: string;
            }[];
          };
        }>({
          query: projectLabelClassesQuery,
          variables: { projectId },
        });
        if (projectCacheResult?.project == null) {
          throw new Error(`Missing project with id ${projectId}`);
        }
        const { project } = projectCacheResult;
        const updatedProject = {
          ...project,
          labelClasses: project.labelClasses.map((labelClass) =>
            labelClass.id !== id ? labelClass : { ...updateLabelClass }
          ),
        };
        cache.writeQuery({
          query: projectLabelClassesQuery,
          data: { project: updatedProject },
        });
      },
    });
  }, [editName, id, projectId, setEditClassId]);

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
          onKeyPress={(e) => {
            if (e.key === "Enter" && editName !== "") {
              updateLabelClassNameWithOptimistic();
            }
          }}
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
        <>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label="Cancel"
            aria-label="Cancel"
          >
            <IconButton
              variant="ghost"
              aria-label={`Edit class ${name} name`}
              icon={<CloseIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              mr="2"
              minWidth="8"
              onClick={() => setEditClassId(null)}
            />
          </Tooltip>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label="Save"
            aria-label="Save"
          >
            <IconButton
              variant="ghost"
              aria-label={`Edit class ${name} name`}
              icon={<CheckIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              mr="2"
              minWidth="8"
              onClick={updateLabelClassNameWithOptimistic}
              disabled={editName === ""}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label={`Edit name of class ${name}`}
            aria-label={`Edit name of class ${name}`}
          >
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
          </Tooltip>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label={`Delete class ${name}`}
            aria-label={`Delete class ${name}`}
          >
            <IconButton
              variant="ghost"
              aria-label={`Delete class ${name}`}
              icon={<DeleteIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              mr="2"
              minWidth="8"
              disabled
            />
          </Tooltip>
        </>
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
                    projectId={projectId}
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
