import { omit } from "lodash/fp";
import { chakraDecorator, storybookTitle } from "../../../../utils/storybook";
import { ClassListItem } from "../class-list-item";

export default {
  title: storybookTitle(ClassListItem),
  decorators: [chakraDecorator],
};

const classDefault = { color: "#F59E0B", name: "aClass", shortcut: "1" };
const classCreate = { type: "CreateClassItem", name: "nonExistingClass" };

export const Default = () => {
  return (
    <ClassListItem
      highlight={false}
      index={0}
      item={classDefault}
      itemProps={{}}
    />
  );
};

export const Highlighted = () => {
  return (
    <ClassListItem highlight index={0} item={classDefault} itemProps={{}} />
  );
};

export const Selected = () => {
  return (
    <ClassListItem selected index={0} item={classDefault} itemProps={{}} />
  );
};

export const NoShortcut = () => {
  return (
    <ClassListItem
      index={0}
      item={omit("shortcut", classDefault)}
      itemProps={{}}
    />
  );
};

export const NewClass = () => {
  return (
    <ClassListItem
      index={0}
      item={classCreate}
      itemProps={{}}
      isCreateClassItem
    />
  );
};

export const NewClassHighlighted = () => {
  return (
    <ClassListItem
      highlight
      index={0}
      item={classCreate}
      itemProps={{}}
      isCreateClassItem
    />
  );
};
