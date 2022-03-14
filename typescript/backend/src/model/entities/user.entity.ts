import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsUUID } from "class-validator";
import { Promisable } from "type-fest";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Membership } from "./membership.entity";

@ObjectType()
@Entity("User")
@Index(["email"], { unique: true })
@Index(["createdAt"], { unique: true })
export class User {
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

  // @DeleteDateColumn()
  // deletedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  name!: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  @IsEmail()
  @IsOptional()
  email!: string;

  @Column({ nullable: true })
  emailVerified!: Date;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  image?: string;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (data) => data.user, { lazy: true })
  memberships!: Promisable<Membership[]>;
}
