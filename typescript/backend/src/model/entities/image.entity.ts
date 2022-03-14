import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsPositive, IsUUID } from "class-validator";
import GqlJSON from "graphql-type-json";
import { Promisable } from "type-fest";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { Dataset } from "./dataset.entity";
import { Label } from "./label.entity";

@ObjectType()
@Entity("Image")
@Index(["datasetId", "createdAt"])
export class Image {
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
  updatedAt?: Date;

  // @DeleteDateColumn()
  // deletedAt?: Date;

  @Field()
  @Column({ type: "text" })
  url!: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  externalUrl?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  thumbnail20Url?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  thumbnail50Url?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  thumbnail100Url?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  thumbnail200Url?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  thumbnail500Url?: string;

  @Field()
  @Column({ type: "text" })
  name!: string;

  @Field()
  @Column({ type: "text" })
  path!: string;

  @Field()
  @Column({ type: "text" })
  mimetype!: string;

  @Field(() => Int)
  @Column("float")
  @IsPositive()
  width!: number;

  @Field(() => Int)
  @Column("float")
  @IsPositive()
  height!: number;

  @Field(() => [Label])
  @OneToMany(() => Label, (data) => data.labelClass, { lazy: true })
  labels?: Promisable<Label[]>;

  @Field(() => Dataset)
  @ManyToOne(() => Dataset, (data) => data.images)
  dataset?: Promisable<Dataset>;

  @Column()
  @RelationId((data: Image) => data.dataset)
  datasetId!: string;

  @Field(() => GqlJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  metadata?: unknown;
}
