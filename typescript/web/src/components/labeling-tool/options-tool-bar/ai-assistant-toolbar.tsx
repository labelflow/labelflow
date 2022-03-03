import { gql, useMutation } from "@apollo/client";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuProps,
  Text,
  Tooltip,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiAssistant, AI_ASSISTANTS } from "@labelflow/common-resolvers";
import { isEmpty, isNil } from "lodash/fp";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import {
  LabelType,
  RunAiAssistantMutation,
  RunAiAssistantMutationVariables,
  RunAiAssistantMutation_runAiAssistant,
} from "../../../graphql-types";
import { useDatasetImage } from "../../../hooks";
import { keymap } from "../../../keymap";
import { trackEvent } from "../../../utils";
import {
  BetaBadge,
  ComboBox,
  ComboBoxProps,
  getLabelIconName,
  LABELS_ICONS,
} from "../../core";
import { useApolloErrorToast, useSuccessToast } from "../../toast";
import {
  GET_IMAGE_LABELS_QUERY,
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
} from "../openlayers-map/queries";

const RUN_AI_ASSISTANT_MUTATION = gql`
  mutation RunAiAssistantMutation(
    $aiAssistantId: ID!
    $imageId: ID!
    $useAutoPolygon: Boolean
  ) {
    runAiAssistant(
      data: {
        aiAssistantId: $aiAssistantId
        imageId: $imageId
        useAutoPolygon: $useAutoPolygon
      }
    ) {
      labels
      labelClasses
    }
  }
`;

export type AiAssistantState = {
  aiAssistant: AiAssistant;
  setAiAssistant: (value: AiAssistant) => void;
  useAutoPolygon: boolean;
  toggleUseAutoPolygon: () => void;
  runAiAssistant: () => void;
  loading: boolean;
};

const AiAssistantContext = createContext({} as AiAssistantState);

export const useAiAssistant = () => useContext(AiAssistantContext);

export type AiAssistantProviderProps = PropsWithChildren<{}>;

const getRunSuccessToastDescription = (
  aiAssistantName: string,
  { labels, labelClasses }: RunAiAssistantMutation_runAiAssistant
) => {
  const labelCount = labels.length ?? 0;
  const classCount = labelClasses.length ?? 0;
  const labelS = labelCount > 1 ? "s" : "";
  const classES = classCount > 1 ? "es" : "";
  const classText = classCount > 0 ? ` and ${classCount} class${classES}` : "";
  return `${aiAssistantName} created ${labelCount} label${labelS}${classText}.`;
};

const useRunSuccessToast = (aiAssistantName: string) => {
  const showToast = useSuccessToast({ title: "AI Assistant" });
  return useCallback(
    (data: RunAiAssistantMutation | undefined) => {
      if (isNil(data)) return;
      const description = getRunSuccessToastDescription(
        aiAssistantName,
        data.runAiAssistant
      );
      showToast({ description });
    },
    [aiAssistantName, showToast]
  );
};

type RunAiAssistantOptions = Partial<
  Pick<RunAiAssistantMutationVariables, "useAutoPolygon">
> &
  Pick<AiAssistantState, "aiAssistant">;

const useRunAiAssistant = ({
  aiAssistant: { id: aiAssistantId, name: aiAssistantName },
  useAutoPolygon,
}: RunAiAssistantOptions): [() => void, boolean] => {
  const { id: imageId } = useDatasetImage();
  const [runAiAssistant, { loading }] = useMutation<
    RunAiAssistantMutation,
    RunAiAssistantMutationVariables
  >(RUN_AI_ASSISTANT_MUTATION, {
    variables: { aiAssistantId, imageId, useAutoPolygon },
    refetchQueries: [
      GET_IMAGE_LABELS_QUERY,
      GET_LABEL_CLASSES_OF_DATASET_QUERY,
    ],
    onError: useApolloErrorToast(),
    update: (cache) => cache.evict({ id: `Image:${imageId}` }),
  });
  const showSuccessToast = useRunSuccessToast(aiAssistantName);
  const handleRun = useCallback(async () => {
    if (isEmpty(aiAssistantId)) return;
    trackEvent("runAiAssistant", { aiAssistantId, imageId, useAutoPolygon });
    const result = await runAiAssistant();
    showSuccessToast(result.data ?? undefined);
  }, [
    aiAssistantId,
    imageId,
    runAiAssistant,
    showSuccessToast,
    useAutoPolygon,
  ]);
  return [handleRun, loading];
};

const useProvider = (): AiAssistantState => {
  const [aiAssistant, setAiAssistant] = useState<AiAssistant>(AI_ASSISTANTS[0]);
  const [useAutoPolygon, { toggle: toggleUseAutoPolygon }] = useBoolean(false);
  const [runAiAssistant, loading] = useRunAiAssistant({
    aiAssistant,
    useAutoPolygon,
  });
  useHotkeys(keymap.runAiAssistant.key, runAiAssistant, {}, []);
  return {
    aiAssistant,
    setAiAssistant,
    useAutoPolygon,
    toggleUseAutoPolygon,
    runAiAssistant,
    loading,
  };
};

export const AiAssistantProvider = ({ children }: AiAssistantProviderProps) => (
  <AiAssistantContext.Provider value={useProvider()}>
    {children}
  </AiAssistantContext.Provider>
);

const AnnotateIcon = () => {
  const {
    aiAssistant: { labelType },
    useAutoPolygon,
  } = useAiAssistant();
  const hasAutoPolygon = labelType === LabelType.Box && useAutoPolygon;
  const iconLabelType = hasAutoPolygon ? LabelType.Polygon : labelType;
  const LeftIcon = LABELS_ICONS[getLabelIconName(iconLabelType)];
  return <LeftIcon />;
};

const AnnotateButton = () => {
  const { runAiAssistant, loading } = useAiAssistant();
  return (
    <Tooltip
      label={`Run AI Assistant [${keymap.runAiAssistant.key}]`}
      placement="bottom"
      openDelay={500}
      disabled={loading}
    >
      <Button
        leftIcon={<AnnotateIcon />}
        onClick={runAiAssistant}
        isLoading={loading}
        loadingText="Running..."
      >
        Annotate
      </Button>
    </Tooltip>
  );
};

type ShowOptionsButtonProps = {
  showOptions: boolean;
};

const ShowOptionsButton = ({ showOptions }: ShowOptionsButtonProps) => {
  const { loading } = useAiAssistant();
  return (
    <Tooltip label="Show options" placement="bottom" openDelay={500}>
      <MenuButton as={Button} isActive={showOptions} disabled={loading}>
        ...
      </MenuButton>
    </Tooltip>
  );
};

const OptionsMenuList = () => {
  const { useAutoPolygon, toggleUseAutoPolygon } = useAiAssistant();
  return (
    <MenuList>
      <MenuItemOption isChecked={useAutoPolygon} onClick={toggleUseAutoPolygon}>
        Post-process with Auto-Polygon
        <BetaBadge />
      </MenuItemOption>
    </MenuList>
  );
};

type AnnotateBodyProps = { showOptions: boolean };

const AnnotateBody = ({ showOptions }: AnnotateBodyProps) => {
  const {
    aiAssistant: { labelType },
    loading,
  } = useAiAssistant();
  const hasOptions = labelType === LabelType.Box;
  return (
    <ButtonGroup isAttached colorScheme="brand" disabled={loading}>
      <AnnotateButton />
      {hasOptions && <ShowOptionsButton showOptions={showOptions} />}
    </ButtonGroup>
  );
};

export type AnnotateProps = Pick<MenuProps, "isOpen">;

export const AiAssistantAnnotateButtonGroup = (props: AnnotateProps) => (
  <Menu {...props}>
    {({ isOpen }) => (
      <>
        <AnnotateBody showOptions={isOpen} />
        <OptionsMenuList />
      </>
    )}
  </Menu>
);

const AiAssistantItem = ({ name, iconUrl }: AiAssistant) => (
  <HStack>
    <Image src={iconUrl} h={4} w={4} />
    <Text>{name}</Text>
  </HStack>
);

const AiAssistantListItem = (aiAssistant: AiAssistant) => {
  const { summary } = aiAssistant;
  return (
    <Flex direction="column">
      <AiAssistantItem {...aiAssistant} />
      <Text fontSize="xs">{summary}</Text>
    </Flex>
  );
};

export type AiAssistantComboBoxProps = Pick<
  ComboBoxProps<AiAssistant, "id">,
  "isOpen"
>;

export const AiAssistantComboBox = (props: AiAssistantComboBoxProps) => {
  const { aiAssistant, setAiAssistant, loading } = useAiAssistant();
  return (
    <ComboBox
      {...props}
      items={AI_ASSISTANTS}
      compareProp="name"
      item={AiAssistantItem}
      listItem={AiAssistantListItem}
      selectedItem={aiAssistant}
      onChange={(value) => {
        if (isNil(value)) return;
        setAiAssistant(value);
      }}
      disabled={loading}
      // Labeling view breaks default background
      bg={useColorModeValue("white", "gray.800")}
      borderStyle="none"
      borderWidth={0}
    />
  );
};

export const AiAssistantToolbarComponent = () => (
  <HStack pointerEvents="initial">
    <AiAssistantComboBox />
    <AiAssistantAnnotateButtonGroup />
  </HStack>
);

export const AiAssistantToolbar = () => {
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  return (
    <>
      {selectedTool === Tools.AI_ASSISTANT && (
        <AiAssistantProvider>
          <AiAssistantToolbarComponent />
        </AiAssistantProvider>
      )}
    </>
  );
};
