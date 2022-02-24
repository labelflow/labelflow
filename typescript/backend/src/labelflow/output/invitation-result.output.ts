import { registerEnum } from "../../model";

export enum InvitationResult {
  Sent = "Sent",
  Active = "Active",
  Declined = "Declined",
}

registerEnum("InvitationResult", InvitationResult);
