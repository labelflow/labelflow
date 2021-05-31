import {
  useQuery,
  useMutation,
  MutationFunctionOptions,
  FetchResult,
} from "@apollo/client";
import gql from "graphql-tag";
import NextLink from "next/link";
import { Layout } from "../../components/layout";
import type { Image } from "../../types.generated";

const imagesQuery = gql`
  query {
    images {
      id
      name
      url
    }
  }
`;
const createImageMutation = gql`
  mutation ($data: ImageCreateInputWithFile) {
    createImage(data: $data) {
      id
      name
    }
  }
`;

const importImage = (
  file: File | undefined,
  createImage: (
    options?: MutationFunctionOptions<any, Record<string, any>> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>
) => {
  if (file == null) {
    return;
  }
  createImage({
    variables: {
      data: { file },
    },
  });
};

const ImagesPage = () => {
  const { data: imagesResult } =
    useQuery<{ images: Pick<Image, "id" | "url" | "name">[] }>(imagesQuery);
  const [createImage] = useMutation(createImageMutation, {
    refetchQueries: [{ query: imagesQuery }],
  });

  return (
    <Layout>
      <div>
        <input
          name="upload"
          type="file"
          onChange={(e) => importImage(e?.target?.files?.[0], createImage)}
        />
        <ul>
          {imagesResult?.images?.map(({ id, name, url }) => (
            <NextLink href={`/images/${id}`} key={id}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <li>
                  <span>{id}</span>
                  <img alt={name} src={url} width="300px" height="300px" />
                </li>
              </a>
            </NextLink>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ImagesPage;
