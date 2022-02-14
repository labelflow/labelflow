import { isEmpty, isNil } from "lodash/fp";
import { BuiltInProviderType } from "next-auth/providers";
import {
  LiteralUnion,
  signIn,
  SignInOptions,
  SignInResponse,
} from "next-auth/react";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StringParam, UrlUpdateType, useQueryParam } from "use-query-params";
import { trackEvent } from "../../utils/google-analytics";
import { validateEmail } from "../../utils/validate-email";

export type SignInCallback = (
  method: LiteralUnion<BuiltInProviderType>,
  options?: SignInOptions
) => Promise<void>;

export type NextAuthState = {
  signIn: SignInCallback;
  sendingLink?: string;
  setSendingLink: (sendingLink?: string) => void;
  linkSent?: string;
  error?: string;
  clearQueryParams: () => Promise<void>;
};

export type EmailState = {
  email: string;
  setEmail: (email: string) => void;
  validEmail: boolean;
};

export type SignInState = NextAuthState & EmailState;

export const SignInContext = createContext({} as SignInState);

export const useSignIn = () => useContext(SignInContext);

export type SignInModalProviderProps = PropsWithChildren<{
  onClose?: () => Promise<void>;
}>;

const sanitizeUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  // We remove the part related to the open modal
  parsedUrl.searchParams.delete("modal-signin");
  // We don't want to propagate modal related errors
  parsedUrl.searchParams.delete("error");
  const callbackUrl = parsedUrl.searchParams.get("callbackUrl");
  if (callbackUrl !== null) {
    return callbackUrl;
  }
  return parsedUrl.href;
};

type SignInMethod = "email" | "credentials";

const useSignInQuery = (): [SignInCallback, SignInResponse | undefined] => {
  const [response, setResponse] = useState<SignInResponse | undefined>();
  const handleSignIn = useCallback<SignInCallback>(
    async (method, options = {}) => {
      trackEvent(`signin_${method}`, {});
      const callbackUrl = sanitizeUrl(window.location.toString());
      const signInOptions: SignInOptions = {
        redirect: false,
        callbackUrl,
        ...options,
      };
      const signInResponse = await signIn<SignInMethod>(method, signInOptions);
      setResponse(signInResponse);
    },
    []
  );
  return [handleSignIn, response];
};

const useErrorQueryParam = (
  response: SignInResponse | undefined
): [
  string | undefined,
  (error?: string, updateType?: UrlUpdateType) => void
] => {
  const [error, setError] = useQueryParam("error", StringParam);
  useEffect(
    () => {
      if (!isNil(response) && !isEmpty(response?.error)) {
        setError(response.error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [response]
  );
  return [error || undefined, setError];
};

const useClearQueryParam = (
  setValue: (value?: string, updateType?: UrlUpdateType) => void
) => {
  return useCallback(
    () =>
      new Promise<void>((resolve, reject) =>
        // Necessary to solve https://github.com/pbeshai/use-query-params/issues/53
        setTimeout(() => {
          try {
            setValue(undefined, "replaceIn");
            resolve();
          } catch (error: unknown) {
            reject(error);
          }
        }, 1)
      ),
    [setValue]
  );
};

const useSignInWithError = (): [
  Pick<NextAuthState, "signIn" | "error">,
  SignInResponse | undefined,
  () => Promise<void>
] => {
  const [handleSignIn, response] = useSignInQuery();
  const [error, setError] = useErrorQueryParam(response);
  const handleSignInWithError = useCallback<SignInCallback>(
    (...args) => {
      // Remove a potential previous error message
      setError(undefined, "replaceIn");
      return handleSignIn(...args);
    },
    [handleSignIn, setError]
  );
  const clearError = useClearQueryParam(setError);
  return [{ signIn: handleSignInWithError, error }, response, clearError];
};

const useSendingLink = (
  response: SignInResponse | undefined
): [
  Pick<NextAuthState, "sendingLink" | "setSendingLink" | "linkSent">,
  () => Promise<void>,
  () => Promise<void>
] => {
  const [linkSent, setLinkSent] = useQueryParam("link-sent", StringParam);
  const [sendingLink, setSendingLink] = useState<string | undefined>();
  useEffect(
    () => {
      if (response?.ok && sendingLink) {
        setLinkSent(sendingLink);
        setSendingLink(undefined);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [response]
  );
  const clearSendingLink = useClearQueryParam(setSendingLink);
  const clearLinkSent = useClearQueryParam(setLinkSent);
  return [
    {
      sendingLink,
      setSendingLink,
      linkSent: linkSent || undefined,
    },
    clearSendingLink,
    clearLinkSent,
  ];
};

const useNextAuth = (): NextAuthState => {
  const [signInState, response, clearError] = useSignInWithError();
  const [sendingLinkState, clearSendingLink, clearLinkSent] =
    useSendingLink(response);

  const clearQueryParams = useCallback(async () => {
    await clearError();
    await clearSendingLink();
    await clearLinkSent();
  }, [clearError, clearSendingLink, clearLinkSent]);
  return { ...signInState, ...sendingLinkState, clearQueryParams };
};

const useEmail = (): EmailState => {
  const [email, setEmail] = useState("");
  const validEmail = validateEmail(email);
  return { email, setEmail, validEmail };
};

const useProvider = (): SignInState => {
  const nextAuthState = useNextAuth();
  const emailState = useEmail();
  return { ...nextAuthState, ...emailState };
};

export const SignInProvider = ({ children }: SignInModalProviderProps) => (
  <SignInContext.Provider value={useProvider()}>
    {children}
  </SignInContext.Provider>
);
