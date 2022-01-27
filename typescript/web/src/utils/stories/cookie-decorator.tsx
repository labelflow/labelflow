import { CookiesProvider, Cookies } from "react-cookie";

export const cookieDecorator = (
  Story: any,
  { parameters }: { parameters: { cookie: { [key: string]: string } } }
) => {
  const cookieMap = parameters.cookie ?? {};
  const cookies = new Cookies(cookieMap);
  Object.entries(cookieMap).forEach(([name, value]) => {
    cookies.set(name, value);
  });
  return (
    <CookiesProvider cookies={cookies}>
      <Story />
    </CookiesProvider>
  );
};
