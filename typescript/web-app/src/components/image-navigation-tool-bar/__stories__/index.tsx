import React from "react";

import { addDecorator } from "@storybook/react";

import { ImageNav } from "../index";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);
export default {
  title: "web-app/Image Navigation Toolbar",
};

export const NoInput = () => <ImageNav />;

export const NoImage = () => <ImageNav imageId="a" images={[]} router={{}} />;

export const NoImageNoId = () => <ImageNav images={[]} router={{}} />;

export const OneImage = () => (
  <ImageNav imageId="a" images={[{ id: "a" }]} router={{}} />
);

export const OneWrongImage = () => (
  <ImageNav imageId="a" images={[{ id: "b" }]} router={{}} />
);

export const Basic1 = () => (
  <ImageNav
    imageId="a"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{}}
  />
);

export const Basic2 = () => (
  <ImageNav
    imageId="b"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{}}
  />
);

export const Basic3 = () => (
  <ImageNav
    imageId="c"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{}}
  />
);

export const BasicWrongImage = () => (
  <ImageNav
    imageId="d"
    images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
    router={{}}
  />
);
