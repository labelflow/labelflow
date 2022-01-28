import { useQuery, gql } from "@apollo/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { isEmpty } from "lodash/fp";
import { ExportFormat } from "../../../graphql-types/globalTypes";
import {
  CountLabelsOfDatasetQuery,
  CountLabelsOfDatasetQueryVariables,
} from "../../../graphql-types/CountLabelsOfDatasetQuery";
import { useDataset } from "../../../hooks";

export const COUNT_LABELS_OF_DATASET_QUERY = gql`
  query CountLabelsOfDatasetQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labels {
        id
        labelClass {
          id
        }
      }
    }
  }
`;

export interface ExportModalState {
  isOpen: boolean;
  onClose: () => void;
  exportFormat: ExportFormat;
  setExportFormat: Dispatch<SetStateAction<ExportFormat>>;
  loading: boolean;
  datasetId?: string;
  numberUndefinedLabelsOfDataset: number;
  datasetSlug: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  isExportRunning: boolean;
  imagesNumber: number;
  labelsNumber: number;
  isOptionsModalOpen: boolean;
  setIsOptionsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExportModalContext = createContext({} as ExportModalState);

export interface ExportModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export type ExportModalProviderProps = PropsWithChildren<ExportModalProps>;

export const ExportModalProvider = ({
  isOpen = false,
  onClose = () => {},
  children,
}: ExportModalProviderProps) => {
  const [exportFormat, setExportFormat] = useState(ExportFormat.COCO);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const { datasetSlug, workspaceSlug } = useDataset();
  const { data, loading } = useQuery<
    CountLabelsOfDatasetQuery,
    CountLabelsOfDatasetQueryVariables
  >(COUNT_LABELS_OF_DATASET_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: isEmpty(workspaceSlug) || isEmpty(datasetSlug) || !isOpen,
  });

  const datasetId = data?.dataset.id;
  const imagesNumber: number = data?.dataset?.imagesAggregates?.totalCount ?? 0;
  const labelsNumber: number = data?.dataset?.labelsAggregates?.totalCount ?? 0;

  const numberUndefinedLabelsOfDataset: number = useMemo(() => {
    if (loading) return 0;
    const total = data?.dataset?.labels?.reduce<number>(
      (numberUndefinedLabels, label) =>
        !label?.labelClass ? numberUndefinedLabels + 1 : numberUndefinedLabels,
      0
    );
    return total ?? 0;
  }, [data, loading]);

  const value: ExportModalState = {
    isOpen,
    onClose,
    exportFormat,
    setExportFormat,
    loading,
    datasetId,
    numberUndefinedLabelsOfDataset,
    datasetSlug,
    setIsExportRunning,
    isExportRunning,
    imagesNumber,
    labelsNumber,
    isOptionsModalOpen,
    setIsOptionsModalOpen,
  };

  return (
    <ExportModalContext.Provider value={value}>
      {children}
    </ExportModalContext.Provider>
  );
};

export const useExportModal = () => {
  return useContext(ExportModalContext);
};
