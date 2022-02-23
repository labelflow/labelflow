import { useColorModeValue } from "@chakra-ui/react";

export type MetabaseDashboardProps = {
  url: string;
  title?: string;
};

export const MetabaseDashboard = ({ url, title }: MetabaseDashboardProps) => {
  const theme = useColorModeValue("", "#theme=night");
  const src = `${url}${theme}`;
  return (
    <iframe
      src={src}
      frameBorder="0"
      style={{ minHeight: "1300px" }}
      title={title}
    />
  );
};
