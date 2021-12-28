export function validImageInput(input: {
  file: any | null | undefined;
  externalUrl: string | null | undefined;
  url: string | null | undefined;
}) {
  const { file, externalUrl, url } = input;
  if (
    !(
      (!file && !externalUrl && url) ||
      (!file && externalUrl && !url) ||
      (file && !externalUrl && !url)
    )
  ) {
    throw new Error(
      "Image creation upload must include either a `file` field of type `Upload`, or a `url` field of type `String`, or a `externalUrl` field of type `String`"
    );
  }
}
