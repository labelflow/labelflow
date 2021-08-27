import { CookiesProvider, Cookies } from "react-cookie";

export const cookieDecorator = (
  Story: any,
  { parameters }: { parameters: { cookie: string } }
) => (
  <CookiesProvider cookies={new Cookies(parameters.cookie ?? "")}>
    <Story />
  </CookiesProvider>
);
