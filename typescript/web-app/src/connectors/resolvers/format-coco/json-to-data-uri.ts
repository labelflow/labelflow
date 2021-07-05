export const jsonToDataUri = (json: string): string =>
  `data:application/json;base64,${btoa(json)}`;
