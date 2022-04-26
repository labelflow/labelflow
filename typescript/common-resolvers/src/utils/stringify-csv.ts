import { Options as StringifyCsvOptions, stringify } from "csv-stringify";

export const stringifyCsv = (
  rows: unknown[][],
  options?: StringifyCsvOptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    stringify(rows, options, (error, output) => {
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    });
  });
