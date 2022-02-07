import React from "react";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";
import { CookieBanner } from "./cookie-banner";

export default {
  title: storybookTitle(CookieBanner),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
};

export const Open = () => <CookieBanner />;
