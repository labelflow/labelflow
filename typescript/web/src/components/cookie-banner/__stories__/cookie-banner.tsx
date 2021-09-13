import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { CookieBanner } from "../cookie-banner";

export default {
  title: "web/Cookie banner",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Open = () => <CookieBanner />;
