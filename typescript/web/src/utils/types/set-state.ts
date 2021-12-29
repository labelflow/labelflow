import { Dispatch, SetStateAction } from "react";

export type SetState<TValue> = Dispatch<SetStateAction<TValue>>;
