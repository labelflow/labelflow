import { ErrorBoundary } from "react-error-boundary";
import { SignInModal, SignInModalProvider } from "./signin-modal";

const ErrorFallback = () => {
  return null;
};

export const AuthManager = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <SignInModalProvider>
      <SignInModal />
    </SignInModalProvider>
  </ErrorBoundary>
);
