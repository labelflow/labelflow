import * as React from "react";

export interface Context {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
}

export const StepContext = React.createContext<Context | null>(null);
