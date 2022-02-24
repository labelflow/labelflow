import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useQueryParam } from "use-query-params";
import { Authenticated } from "../../../components/auth";
import { CookieBanner } from "../../../components/cookie-banner";
import { DatasetList, NewDatasetCard } from "../../../components/datasets";
import { DeleteDatasetModal } from "../../../components/datasets/delete-dataset-modal";
import { UpsertDatasetModal } from "../../../components/datasets/upsert-dataset-modal";
import { Layout } from "../../../components/layout";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Meta } from "../../../components/meta";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { UpdatePlanBanner } from "../../../components/workspaces/update-plan-banner";
import { WorkspaceStatus } from "../../../graphql-types";
import { useWorkspace } from "../../../hooks";
import { BoolParam, IdParam } from "../../../utils/query-param-bool";

const Body = () => {
  const { slug: workspaceSlug, status } = useWorkspace();
  const { isReady } = useRouter();
  const isWorkspaceActive =
    status === WorkspaceStatus.active ||
    status === WorkspaceStatus.trialing ||
    status === WorkspaceStatus.incomplete;
  const shouldDisplayUpdateBanner = !isWorkspaceActive;

  const [isCreatingDataset, setIsCreatingDataset] = useQueryParam(
    "modal-create-dataset",
    BoolParam
  );
  const [editDatasetId, setEditDatasetId] = useQueryParam(
    "modal-edit-dataset",
    IdParam
  );
  const [deleteDatasetId, setDeleteDatasetId] = useQueryParam(
    "alert-delete-dataset",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editDatasetId) {
      setEditDatasetId(null, "replaceIn");
    }

    if (isCreatingDataset) {
      setIsCreatingDataset(false, "replaceIn");
    }

    if (deleteDatasetId) {
      setDeleteDatasetId(null, "replaceIn");
    }
  }, [
    editDatasetId,
    isCreatingDataset,
    deleteDatasetId,
    setEditDatasetId,
    setIsCreatingDataset,
    setDeleteDatasetId,
  ]);

  return (
    <>
      {shouldDisplayUpdateBanner && <UpdatePlanBanner />}
      <Meta title="LabelFlow | Datasets" />
      <CookieBanner />
      <Layout
        tabBar={<WorkspaceTabBar currentTab="datasets" />}
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Datasets</Text>,
        ]}
      >
        <UpsertDatasetModal
          isOpen={isCreatingDataset || editDatasetId != null}
          onClose={onClose}
          datasetId={editDatasetId}
        />

        <DeleteDatasetModal
          isOpen={deleteDatasetId != null}
          onClose={onClose}
          datasetId={deleteDatasetId}
          workspaceSlug={workspaceSlug as string}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewDatasetCard
            disabled={!isReady}
            addDataset={() => {
              setIsCreatingDataset(true, "replaceIn");
            }}
          />
          <DatasetList
            workspaceSlug={workspaceSlug}
            setDeleteDatasetId={setDeleteDatasetId}
            setEditDatasetId={setEditDatasetId}
          />
        </Flex>
      </Layout>
    </>
  );
};

const DatasetPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default DatasetPage;
