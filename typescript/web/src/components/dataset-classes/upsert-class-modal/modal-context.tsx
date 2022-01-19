import React, { ChangeEvent } from "react";

export interface UpsertClassModalState {
  classId: string | undefined;
  createClass: (event: any) => Promise<void>;
  classNameInputValue: string;
  errorMessage: string;
  handleInputValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export const ModalContext = React.createContext<UpsertClassModalState>({
  classId: "",
  createClass: async () => {},
  classNameInputValue: "",
  errorMessage: "",
  handleInputValueChange: () => {},
  loading: false,
});
