import isEmpty from "lodash/fp/isEmpty";

export function validateImageInput({
  file,
  externalUrl,
  url,
}: {
  file: Blob | null | undefined;
  externalUrl: string | null | undefined;
  url: string | null | undefined;
}) {
  const fileIsValid = file != null;
  const externalUrlIsValid = !isEmpty(externalUrl);
  const urlIsValid = !isEmpty(url);

  const numberOfValidInputs =
    Number(fileIsValid) + Number(externalUrlIsValid) + Number(urlIsValid);

  if (numberOfValidInputs !== 1) {
    throw new Error(
      "Image creation upload must include either a `file` field of type `Upload`, or a `url` field of type `String`, or a `externalUrl` field of type `String`"
    );
  }
}
