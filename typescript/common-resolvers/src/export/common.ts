import { DbImage } from "../types";

export const getImageName = (image: DbImage, useId: boolean) =>
  useId ? `${image.name}_${image.id}` : image.name;
