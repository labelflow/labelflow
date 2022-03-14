import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { Promisable } from "type-fest";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { WorkspacePlan } from "../enums";
import { Dataset } from "./dataset.entity";
import { Membership } from "./membership.entity";

@ObjectType()
@Entity("Workspace")
@Index(["name"], { unique: true })
@Index(["slug"], { unique: true })
@Index(["slug", "deletedAt", "createdAt"])
@Index(["createdAt"])
export class Workspace {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
  id!: string;

  @Field()
  @CreateDateColumn({ type: "timestamp without time zone" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp without time zone" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp without time zone" })
  deletedAt?: Date;

  @Field()
  @Column({ type: "text" })
  name!: string;

  @Field()
  @Column({ type: "text" })
  slug!: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  image?: string;

  @Field(() => WorkspacePlan)
  @Column({ type: "enum", enum: WorkspacePlan, default: WorkspacePlan.Pro })
  plan!: WorkspacePlan;

  @Field(() => [Dataset])
  @OneToMany(() => Dataset, (data) => data.workspace, { lazy: true })
  datasets!: Promisable<Dataset[]>;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (data) => data.workspace, { lazy: true })
  memberships!: Promisable<Membership[]>;

  @Column({ type: "text", nullable: true })
  stripeCustomerId?: string;

  @Field({ nullable: true })
  stripeCustomerPortalUrl?: string;
}
