import {
  useQuery,
  useMutation,
  MutationFunctionOptions,
  FetchResult,
} from "@apollo/client";
import gql from "graphql-tag";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

import type { Image } from "../types.generated";

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

const TestImages = () => {
  const { data: imagesResult } =
    useQuery<{ images: Pick<Image, "id" | "url" | "name">[] }>(imagesQuery);
  const [createImage] = useMutation(createImageMutation, {
    refetchQueries: [{ query: imagesQuery }],
  });

  return (
    <div>
      <input
        name="upload"
        type="file"
        onChange={(e) => importImage(e?.target?.files?.[0], createImage)}
      />
      {imagesResult?.images?.map(({ id, name, url }) => (
        <img key={id} alt={name} src={url} width="300px" height="300px" />
      ))}
    </div>
  );
};

export default TestImages;
