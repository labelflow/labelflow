import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { tutorialDatasets } from "@labelflow/common-resolvers/src/data/dataset-tutorial";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { PaginationProvider } from "../pagination";
import { PaginationFooter } from "../pagination/pagination-footer";
import { Spinner } from "../spinner";
import { DatasetCard } from "./dataset-card";
import { DatasetCardBox } from "./dataset-card-box";
import {
  DatasetListProps,
  DatasetListProvider,
  useDatasetList,
} from "./dataset-list.context";

export const getDatasetsQuery = gql`
  query getDatasets($where: DatasetWhereInput) {
    datasets(where: $where) {
      id
    }
  }
`;

const LoadingCard = () => (
  <DatasetCardBox>
    <Flex
      w="100%"
      h="2xs"
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Spinner color="brand.500" size="xl" />
    </Flex>
  </DatasetCardBox>
);

const Content = () => {
  const {
    loading,
    datasets,
    workspaceSlug,
    setDeleteDatasetId,
    setEditDatasetId,
  } = useDatasetList();
  return loading ? (
    <LoadingCard />
  ) : (
    <>
      {datasets.map(
        ({
          id,
          slug,
          images,
          name,
          imagesAggregates,
          labelsAggregates,
          labelClassesAggregates,
        }) => (
          <DatasetCard
            key={id}
            url={`/${workspaceSlug}/datasets/${slug}`}
            imageUrl={images[0]?.thumbnail500Url ?? undefined}
            datasetName={name}
            imagesCount={imagesAggregates.totalCount}
            labelClassesCount={labelClassesAggregates.totalCount}
            labelsCount={labelsAggregates.totalCount}
            editDataset={() => setEditDatasetId(id, "replaceIn")}
            deleteDataset={() => setDeleteDatasetId(id, "replaceIn")}
          />
        )
      )}
    </>
  );
};

const MigrateLocalDatasetsModal = ({
  hasMoreThanTutorialDataset,
}: {
  hasMoreThanTutorialDataset?: boolean;
}) => {
  const router = useRouter();
  const workspaceSlug = router?.query.workspaceSlug as string;
  const [{ hasUserTriedApp }] = useCookies(["hasUserTriedApp"]);
  const [isLocalDatasetsModalOpen, setIsLocalDatasetsModalOpen] = useBoolean();
  useEffect(() => {
    if (
      hasUserTriedApp === "true" &&
      workspaceSlug === "local" &&
      hasMoreThanTutorialDataset
    ) {
      setIsLocalDatasetsModalOpen.on();
    }
  }, [hasMoreThanTutorialDataset, hasUserTriedApp, workspaceSlug]);
  return (
    <Modal
      isOpen={isLocalDatasetsModalOpen}
      onClose={setIsLocalDatasetsModalOpen.off}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="md">🚨 Migrate Your Local Datasets Now!</Heading>
        </ModalHeader>
        <ModalBody>
          <Text>
            Migrate your local datasets to an online workspace before next
            Monday (Feb 14th). Check{" "}
            <Link
              color="brand.600"
              href="https://docs.labelflow.ai/labelflow/import-dataset/migrate-a-local-dataset"
              isExternal
            >
              this tutorial
            </Link>{" "}
            to easily migrate your local datasets.
            <br />
            <Text fontWeight="bold" pt="4">
              All your local datasets will be otherwise lost.
            </Text>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={setIsLocalDatasetsModalOpen.off}
            colorScheme="brand"
            aria-label="I Understand"
          >
            I Understand
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DatasetList = (props: DatasetListProps) => {
  const { workspaceSlug } = props;
  const { data: datasetsResult, loading: totalCountLoading } = useQuery<{
    datasets: Pick<
      DatasetType,
      | "id"
      | "name"
      | "slug"
      | "images"
      | "imagesAggregates"
      | "labelClassesAggregates"
      | "labelsAggregates"
    >[];
  }>(getDatasetsQuery, {
    variables: { where: { workspaceSlug } },
    skip: workspaceSlug == null,
  });
  const tutorialId = tutorialDatasets[0].id;
  const hasMoreThanTutorialDataset =
    datasetsResult &&
    (datasetsResult?.datasets.length > 1 ||
      (datasetsResult?.datasets.length === 1 &&
        datasetsResult?.datasets[0].id !== tutorialId));

  return (
    <PaginationProvider
      itemCount={datasetsResult?.datasets.length ?? 0}
      perPageOptions={[25, 50, 100]}
    >
      <MigrateLocalDatasetsModal
        hasMoreThanTutorialDataset={hasMoreThanTutorialDataset}
      />
      {totalCountLoading ? (
        <LoadingCard />
      ) : (
        <DatasetListProvider {...props}>
          <Content />
          <PaginationFooter />
        </DatasetListProvider>
      )}
    </PaginationProvider>
  );
};
