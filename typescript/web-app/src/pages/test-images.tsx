import {
  useQuery,
  useMutation,
  MutationFunctionOptions,
  FetchResult,
} from "@apollo/client";
import gql from "graphql-tag";

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

const createLabelMutation = gql`
  mutation ($data: LabelCreateInput) {
    createLabel(data: $data) {
      imageId
      x
      y
      height
      width
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

const addLabelToImage = (id: string, createLabel: any) => {
  console.log("here");
  createLabel({
    variables: {
      data: {
        imageId: id,
        x: 10,
        y: 10,
        height: 9,
        width: 9,
      },
    },
  });
};

const TestImages = () => {
  const { data: imagesResult } =
    useQuery<{ images: Pick<Image, "id" | "url" | "name" | "labels">[] }>(
      imagesQuery
    );
  const [createImage] = useMutation(createImageMutation, {
    refetchQueries: [{ query: imagesQuery }],
  });

  const [createLabel] = useMutation(createLabelMutation, {
    refetchQueries: [{ query: imagesQuery }],
  });

  return (
    <div>
      <input
        name="upload"
        type="file"
        onChange={(e) => importImage(e?.target?.files?.[0], createImage)}
      />
      {imagesResult?.images?.map(({ id, name, url, labels }) => (
        <div key={id}>
          <img alt={name} src={url} width="300px" height="300px" />
          <button
            type="button"
            onClick={() => {
              addLabelToImage(id, createLabel);
            }}
          >
            Add label
          </button>
          <span>{labels}</span>
        </div>
      ))}
    </div>
  );
};

export default TestImages;
