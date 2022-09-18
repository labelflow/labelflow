import { createContext, PropsWithChildren, useContext } from "react";

export type MarkdownState = {
  headingLinks: boolean;
};

const MarkdownContext = createContext({} as MarkdownState);

export const useMarkdown = () => useContext(MarkdownContext);

export type MarkdownProviderProps = PropsWithChildren<
  Partial<Pick<MarkdownState, "headingLinks">>
>;

export const MarkdownProvider = ({
  children,
  headingLinks = false,
}: MarkdownProviderProps) => (
  <MarkdownContext.Provider value={{ headingLinks }}>
    {children}
  </MarkdownContext.Provider>
);
