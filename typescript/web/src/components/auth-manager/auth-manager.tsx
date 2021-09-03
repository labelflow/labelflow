import { useQueryParam, StringParam } from "use-query-params";

import { BoolParam } from "../../utils/query-param-bool";
import { SigninModal } from "./signin-modal";

export const AuthManager = () => {
  const [isOpen, setIsOpen] = useQueryParam("modal-signin", BoolParam);
  const [error] = useQueryParam("error", StringParam);

  return (
    <SigninModal
      isOpen={isOpen}
      error={error}
      onClose={() => setIsOpen(false, "replaceIn")}
    />
  );
};
