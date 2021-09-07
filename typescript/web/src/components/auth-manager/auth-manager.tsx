import { useQueryParam, StringParam } from "use-query-params";

import { BoolParam } from "../../utils/query-param-bool";
import { SigninModal } from "./signin-modal";

export const AuthManager = () => {
  const [isOpen, setIsOpen] = useQueryParam("modal-signin", BoolParam);
  const [error, setError] = useQueryParam("error", StringParam);
  const [linkSent, setLinkSent] = useQueryParam("link-sent", StringParam);

  return (
    <SigninModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      error={error}
      setError={setError}
      linkSent={linkSent}
      setLinkSent={setLinkSent}
      onClose={() => {
        setIsOpen(false, "replaceIn");
        // Necessary to solve https://github.com/pbeshai/use-query-params/issues/53
        setTimeout(() => setError(undefined, "replaceIn"), 1);
        setTimeout(() => setLinkSent(undefined, "replaceIn"), 2);
      }}
    />
  );
};
