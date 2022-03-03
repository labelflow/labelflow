import { isNil } from "lodash/fp";

export type CreateTextImageOptions = { color?: string; font?: string };

export const createTextImage = (
  text: string,
  { color = "red", font = "20px Arial" }: CreateTextImageOptions = {}
): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (isNil(ctx)) {
    throw new Error("Canvas 2D context is unavailable");
  }
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, 10, 50);
  return canvas.toDataURL();
};
