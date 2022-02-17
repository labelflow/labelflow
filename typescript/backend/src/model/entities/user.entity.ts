import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
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
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column()
  @IsEmail()
  email!: string;

  @Column()
  emailVerified!: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (data) => data.user, { lazy: true })
  memberships!: Promisable<Membership[]>;
}
