import { Field, ID, ObjectType } from "@nestjs/graphql";
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
  id!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  slug!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field(() => WorkspacePlan)
  @Column()
  plan!: WorkspacePlan;

  @Field(() => [Dataset])
  @OneToMany(() => Dataset, (data) => data.workspace, { lazy: true })
  datasets!: Promisable<Dataset[]>;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (data) => data.workspace, { lazy: true })
  memberships!: Promisable<Membership[]>;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Field({ nullable: true })
  stripeCustomerPortalUrl?: string;
}
