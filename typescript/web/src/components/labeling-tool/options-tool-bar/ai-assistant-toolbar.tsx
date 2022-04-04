import { useApolloClient } from "@apollo/client";
import {
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
import { SetOptional } from "type-fest";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createRunAiAssistantEffect } from "../../../connectors/undo-store/effects/run-ai-assistant.effect";
import {
  LabelType,
  RunAiAssistantMutationVariables,
  RunAiAssistantMutation_runAiAssistant,
} from "../../../graphql-types";
import { useDatasetImage } from "../../../hooks";
import { keymap } from "../../../keymap";
import { trackEvent } from "../../../utils";
import {
  BetaBadge,
  Button,
  ComboBox,
  ComboBoxProps,
  getLabelIconName,
  Icon,
  LabelIconName,
} from "../../core";
import { useApolloErrorToast, useToast } from "../../toast";

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

const getSuccessDescription = ({
  labels,
  labelClasses,
}: RunAiAssistantMutation_runAiAssistant) => {
  const labelCount = labels.length ?? 0;
  const classCount = labelClasses.length ?? 0;
  const labelS = labelCount > 1 ? "s" : "";
  const classES = classCount > 1 ? "es" : "";
  const classText = classCount > 0 ? ` and ${classCount} class${classES}` : "";
  return `created ${labelCount} label${labelS}${classText}.`;
};

const useRunSuccessToast = (aiAssistantName: string) => {
  const showToast = useToast({ title: "AI Assistant" });
  return useCallback(
    (result: RunAiAssistantMutation_runAiAssistant) => {
      const empty = isEmpty(result.labels) && isEmpty(result.labelClasses);
      const status = empty ? "info" : "success";
      const post = empty ? "result is empty." : getSuccessDescription(result);
      const description = `${aiAssistantName} ${post}`;
      showToast({ status, description });
    },
    [aiAssistantName, showToast]
  );
};

type RunAiAssistantOptions = Pick<AiAssistantState, "aiAssistant"> &
  SetOptional<
    Omit<RunAiAssistantMutationVariables, "aiAssistantId">,
    "useAutoPolygon"
  >;

export const useRunAiAssistantEffect = ({
  aiAssistant: { id: aiAssistantId, name: aiAssistantName },
  imageId,
  useAutoPolygon,
}: RunAiAssistantOptions) => {
  const client = useApolloClient();
  const { perform } = useUndoStore();
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );
  const showSuccessToast = useRunSuccessToast(aiAssistantName);
  const showErrorToast = useApolloErrorToast();
  return useCallback(() => {
    const variables = { aiAssistantId, imageId, useAutoPolygon };
    const effect = createRunAiAssistantEffect(variables, {
      client,
      setSelectedLabelId,
      onSuccess: showSuccessToast,
      onError: showErrorToast,
    });
    return perform(effect);
  }, [
    aiAssistantId,
    imageId,
    useAutoPolygon,
    client,
    perform,
    setSelectedLabelId,
    showSuccessToast,
    showErrorToast,
  ]);
};

const useRunAiAssistant = ({
  aiAssistant,
  useAutoPolygon,
}: Omit<RunAiAssistantOptions, "imageId">): [() => void, boolean] => {
  const { id: imageId } = useDatasetImage();
  const runAiAssistant = useRunAiAssistantEffect({
    aiAssistant,
    imageId,
    useAutoPolygon,
  });
  const [loading, { on: turnLoadingOn, off: turnLoadingOff }] =
    useBoolean(false);
  const handleRun = useCallback(async () => {
    if (isEmpty(aiAssistant.id)) return;
    turnLoadingOn();
    const variables: RunAiAssistantMutationVariables = {
      aiAssistantId: aiAssistant.id,
      imageId,
      useAutoPolygon,
    };
    trackEvent("runAiAssistant", variables);
    await runAiAssistant();
    turnLoadingOff();
  }, [
    aiAssistant.id,
    imageId,
    runAiAssistant,
    turnLoadingOff,
    turnLoadingOn,
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

const useAnnotateIcon = (): LabelIconName => {
  const {
    aiAssistant: { labelType },
    useAutoPolygon,
  } = useAiAssistant();
  const hasAutoPolygon = labelType === LabelType.Box && useAutoPolygon;
  const iconLabelType = hasAutoPolygon ? LabelType.Polygon : labelType;
  return getLabelIconName(iconLabelType);
};

const AnnotateButton = () => {
  const { runAiAssistant, loading } = useAiAssistant();
  return (
    <Button
      data-testid="ai-assistant-annotate-button"
      leftIcon={{ name: useAnnotateIcon(), fontSize: "1.3em" }}
      onClick={runAiAssistant}
      isLoading={loading}
      loadingText="Running..."
      tooltip={`Run AI Assistant [${keymap.runAiAssistant.key}]`}
      px={2}
    >
      Annotate
    </Button>
  );
};

type ShowOptionsButtonProps = {
  showOptions: boolean;
};

const ShowOptionsButton = ({ showOptions }: ShowOptionsButtonProps) => {
  const { loading } = useAiAssistant();
  return (
    <MenuButton
      as={Button}
      tooltip={{ label: "Show options", placement: "bottom" }}
      isActive={showOptions}
      disabled={loading}
      p={1}
    >
      <Icon name="more" />
    </MenuButton>
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
  const { id, summary } = aiAssistant;
  return (
    <Flex direction="column" data-testid={`ai-assistant-item-${id}`}>
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
      data-testid="ai-assistant-combobox"
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
