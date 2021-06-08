import { useQuery } from "@apollo/client";
import {
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { RiArrowRightSLine } from "react-icons/ri";
import NextLink from "next/link";

import { Layout } from "../../components/layout";
import type { Image } from "../../graphql-types.generated";

// The dynamic import is needed because openlayers use web apis that are not available
// in NodeJS, like `Blob`, so it crashes when rendering in NextJS server side.
// And anyway, it would not make sense to render canvas server side, it would just be a loss.
const LabellingTool = dynamic(() => import("../../components/labelling-tool"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <div>loading</div>;
  },
});

const imageQuery = gql`
  query image($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

type ImageQueryResponse = {
  image: Pick<Image, "id" | "name">;
};

const ImagePage = () => {
  const id = useRouter()?.query?.id;

  const imageName = useQuery<ImageQueryResponse>(imageQuery, {
    variables: { id },
    skip: typeof id !== "string",
  }).data?.image.name;

  return (
    <Layout
      topBarLeftContent={
        <Breadcrumb
          spacing="8px"
          separator={<RiArrowRightSLine color="gray.500" />}
        >
          <BreadcrumbItem>
            <NextLink href="/images">
              <BreadcrumbLink>Images</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text
              maxWidth="20rem"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {imageName}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <LabellingTool />
    </Layout>
  );
};

export default ImagePage;
