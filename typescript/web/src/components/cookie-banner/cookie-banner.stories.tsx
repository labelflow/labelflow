import React from "react";
import {
  apolloMockDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../dev/stories";
import { CookieBanner } from "./cookie-banner";

export default {
  title: storybookTitle(CookieBanner),
  decorators: [apolloMockDecorator, queryParamsDecorator],
};

export const Open = () => <CookieBanner />;
