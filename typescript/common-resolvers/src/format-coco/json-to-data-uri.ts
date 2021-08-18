export const jsonToDataUri = (json: string): string =>
  `data:application/json;base64,${btoa(json)}`;

export const dataUriToJson = (dataUri: string): string =>
  atob(dataUri.split(",")[1]);
