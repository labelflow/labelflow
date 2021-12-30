import React, { ChangeEvent } from "react";

export interface UpsertClassModalState {
  classId: string | undefined;
  createClass: (event: any) => Promise<void>;
  classNameInputValue: string;
  errorMessage: string;
  handleInputValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isClassCreationPending: boolean;
}

export const ModalContext = React.createContext<UpsertClassModalState>({
  classId: "",
  createClass: async () => {},
  classNameInputValue: "",
  errorMessage: "",
  handleInputValueChange: () => {},
  isClassCreationPending: false,
});
