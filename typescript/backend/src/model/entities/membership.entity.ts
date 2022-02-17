import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { MembershipRole, MembershipStatus } from "../enums";
import { User } from "./user.entity";
import { Workspace } from "./workspace.entity";

@ObjectType()
@Entity("Membership")
@Index(["workspaceSlug", "userId"], { unique: true })
@Index(["workspaceSlug", "createdAt"], { unique: true })
@Index(["workspaceSlug", "invitationEmailSentTo"], { unique: true })
export class Membership {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  // @DeleteDateColumn()
  // deletedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  declinedAt?: Date;

  @Field(() => MembershipRole)
  @Column()
  role!: MembershipRole;

  @Field(() => Workspace, { nullable: true })
  @ManyToOne(() => Workspace, (data) => data.memberships)
  @JoinColumn({
    name: "workspaceSlug",
    referencedColumnName: "slug",
  })
  workspace!: Workspace;

  @Column()
  // @RelationId((data: Membership) => data.workspace)
  workspaceSlug!: string;

  // @Column()
  // @RelationId((data: Membership) => data.workspace)
  // workspaceId!: string;

  // TODO See why user is nullable and fix if needed
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (data) => data.memberships, { nullable: true })
  user?: User;

  @Column({ nullable: true })
  @RelationId((data: Membership) => data.user)
  userId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  invitationEmailSentTo?: string;

  @Field(() => MembershipStatus, { nullable: true })
  status?: MembershipStatus;
}
