import React from "react";
import { addDecorator } from "@storybook/react";
import { NextRouter } from "next/router";

import { ImageNav } from "../index";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);
export default {
  title: "web-app/Image Navigation Toolbar",
};

// @ts-ignore
export const NoInput = () => <ImageNav />;

export const NoImage = () => (
  <ImageNav imageId="a" images={[]} router={{} as unknown as NextRouter} />
);

export const NoImageNoId = () => (
  // @ts-ignore
  <ImageNav images={[]} router={{} as unknown as NextRouter} />
);

export const OneImage = () => (
  <ImageNav
    imageId="a"
    images={[{ id: "a" }]}
    router={{} as unknown as NextRouter}
  />
);

export const OneWrongImage = () => (
  <ImageNav
    imageId="a"
    images={[{ id: "b" }]}
    router={{} as unknown as NextRouter}
  />
);

export const Basic1 = () => (
  <ImageNav
    imageId="a"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{} as unknown as NextRouter}
  />
);

export const Basic2 = () => (
  <ImageNav
    imageId="b"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{} as unknown as NextRouter}
  />
);

export const Basic3 = () => (
  <ImageNav
    imageId="c"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{} as unknown as NextRouter}
  />
);

export const BasicWrongImage = () => (
  <ImageNav
    imageId="d"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{} as unknown as NextRouter}
  />
);
