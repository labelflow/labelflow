import {
  ButtonGroup,
  ButtonGroupProps,
  chakra,
  HStack,
  IconButton,
  IconButtonProps,
  StackProps,
} from "@chakra-ui/react";
import {
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiSettings3Fill,
} from "react-icons/ri";
import { useFullScreen } from "../full-screen";
import {
  MarkdownInputAction,
  useMarkdownInput,
} from "./markdown-input.context";

type ActionButtonProps = Omit<
  IconButtonProps,
  "aria-label" | "icon" | "onClick"
> &
  Pick<MarkdownInputAction, "label" | "icon" | "run">;

const ActionButton = ({ label, icon, run }: ActionButtonProps) => {
  const Icon = chakra(icon);
  return <IconButton aria-label={label} icon={<Icon />} onClick={run} />;
};

const ToolbarButtonGroup = (props: ButtonGroupProps) => (
  <ButtonGroup isAttached variant="outline" size="sm" {...props} />
);

const ToolbarActions = () => {
  const { actions } = useMarkdownInput();
  return (
    <ToolbarButtonGroup>
      {actions.map((action) => (
        <ActionButton key={action.id} {...action} />
      ))}
    </ToolbarButtonGroup>
  );
};

const SettingsButton = () => (
  <ToolbarButtonGroup>
    <ActionButton label="Settings" icon={RiSettings3Fill} run={() => {}} />
  </ToolbarButtonGroup>
);

const FullScreenButton = () => {
  const { fullScreen, toggleFullScreen } = useFullScreen();
  return (
    <ToolbarButtonGroup>
      <ActionButton
        label="Full-screen"
        icon={fullScreen ? RiFullscreenExitLine : RiFullscreenLine}
        run={toggleFullScreen}
      />
    </ToolbarButtonGroup>
  );
};

export const MarkdownInputToolbar = (props: StackProps) => (
  <HStack {...props}>
    <ToolbarActions />
    <SettingsButton />
    <FullScreenButton />
  </HStack>
);
