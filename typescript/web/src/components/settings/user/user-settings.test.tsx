import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { UserSettings } from "./user-settings";
import { theme } from "../../../theme";

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ChakraProvider theme={theme} resetCSS>
    {children}
  </ChakraProvider>
);

const testUser = {
  id: "test",
  name: "Ignacio Carnicero",
  email: "ignacio@test.com",
};
const changeUserName = jest.fn();

beforeEach(() => jest.resetAllMocks());

test("Renders component in the nominal case", () => {
  render(<UserSettings user={testUser} changeUserName={changeUserName} />);
  // console.log(screen.debug());
  expect(
    screen.getByRole("textbox", { name: "Change username" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save Changes" })
  ).toBeInTheDocument();
});

test("Allows to change the user name", () => {
  render(<UserSettings user={testUser} changeUserName={changeUserName} />, {
    wrapper,
  });
  userEvent.clear(screen.getByRole("textbox", { name: "Change username" }));
  userEvent.type(
    screen.getByRole("textbox", { name: "Change username" }),
    "Nacho Carnicero"
  );
  userEvent.click(screen.getByRole("button", { name: "Save Changes" }));
  expect(changeUserName).toHaveBeenCalledWith("Nacho Carnicero");
});

test("Resets the user name to the original one when pressing cancel", () => {
  render(<UserSettings user={testUser} changeUserName={changeUserName} />, {
    wrapper,
  });
  userEvent.clear(screen.getByRole("textbox", { name: "Change username" }));
  userEvent.type(
    screen.getByRole("textbox", { name: "Change username" }),
    "Nacho Carnicero"
  );
  userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(changeUserName).toHaveBeenCalledTimes(0);
  expect(
    (
      screen.getByRole("textbox", {
        name: "Change username",
      }) as HTMLInputElement
    ).value
  ).toEqual("Ignacio Carnicero");
});
