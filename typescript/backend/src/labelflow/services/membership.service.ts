import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty, isNil } from "lodash/fp";
import { DeepPartial, Repository } from "typeorm";
import { CurrentUserCanAcceptInvitation, Membership } from "../../model";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";
import { MembershipCreateInput } from "../input";

@Injectable()
export class MembershipService extends EntityService<
  Membership,
  MembershipCreateInput,
  DeepPartial<Membership>
> {
  constructor(
    @InjectRepository(Membership) repository: Repository<Membership>,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(Membership, repository, events);
  }

  async isMember(userId: string, workspaceSlug: string): Promise<boolean> {
    const membership = await this.findOne({ where: { workspaceSlug, userId } });
    const output = !isNil(membership);
    this.logger.verbose("isMember", {
      userId,
      workspaceSlug,
      membership,
      output,
    });
    return output;
  }

  async canAcceptInvitation(
    userId: string,
    { userId: membershipUserId, workspaceSlug, declinedAt }: Membership
  ): Promise<CurrentUserCanAcceptInvitation> {
    if (!isEmpty(membershipUserId)) {
      return CurrentUserCanAcceptInvitation.AlreadyAccepted;
    }
    if (!isNil(declinedAt)) {
      return CurrentUserCanAcceptInvitation.AlreadyDeclined;
    }
    const isMember = await this.isMember(userId, workspaceSlug);
    return isMember
      ? CurrentUserCanAcceptInvitation.AlreadyMemberOfTheWorkspace
      : CurrentUserCanAcceptInvitation.Yes;
  }

  private async invitationNotAnswered(
    userId: string,
    membership: Membership
  ): Promise<void> {
    const canAccept = await this.canAcceptInvitation(userId, membership);
    const forbidden: Record<
      CurrentUserCanAcceptInvitation,
      string | undefined
    > = {
      AlreadyAccepted: "This invitation was already accepted",
      AlreadyDeclined: "This invitation was already declined",
      AlreadyMemberOfTheWorkspace:
        "Your are already a member of this workspace",
      Yes: undefined,
    };
    const error = forbidden[canAccept];
    if (isNil(error)) return;
    const msg = `Someone tried to act on an invitation whose status is ${canAccept}`;
    this.logger.warn(msg);
    throw new BadRequestException(error);
  }

  async acceptInvitation(userId: string, id: string): Promise<void> {
    const msg = "Trying to accept membership invitation";
    this.logger.verbose(msg, { userId, id });
    const membership = await this.findById(id);
    await this.invitationNotAnswered(userId, membership);
    await this.updateById(id, { userId });
  }

  async declineInvitation(userId: string, id: string): Promise<void> {
    const msg = "Trying to decline membership invitation";
    this.logger.verbose(msg, { userId, id });
    const membership = await this.findById(id);
    await this.invitationNotAnswered(userId, membership);
    await this.updateById(id, { declinedAt: new Date() });
  }

  // public async inviteMember(
  //   { email, role, workspaceSlug }: InviteMemberInput,
  //   userId: string
  // ): Promise<InvitationResult> {
  //   const workspace = await this.workspaces.findOne({
  //     where: { slug: workspaceSlug },
  //     select: ["name"],
  //   });
  //   const inviterMembership = await this.findOne({
  //     where: { userId, workspaceSlug },
  //   });
  //   if (isNil(workspace) || isNil(inviterMembership)) {
  //     throw new UnauthorizedException();
  //   }

  //   const inviter = await this.users.findOneOrFail({ where: { id: userId } });

  //   const activeInviteeMembership = await this.findOne({
  //     where: { user: { email }, workspaceSlug },
  //     select: ["id"],
  //   });
  //   if (!isNil(activeInviteeMembership)) return InvitationResult.Active;

  //   const existingInvitation = await this.findOne({
  //     where: { invitationEmailSentTo: email, workspaceSlug },
  //     select: ["id"],
  //   });

  //   if (existingInvitation) {
  //     await this.updateById(existingInvitation.id, { role });
  //   } else {
  //     await this.create({ role, workspaceSlug, invitationEmailSentTo: email });
  //   }

  //   throw new NotImplementedException();

  //   return InvitationResult.Sent;
  // }
}
