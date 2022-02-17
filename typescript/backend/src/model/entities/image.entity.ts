import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { IsPositive } from "class-validator";
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
  id!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  // @DeleteDateColumn()
  // deletedAt?: Date;

  @Field()
  @Column()
  url!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  externalUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail20Url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail50Url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail100Url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail200Url?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail500Url?: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  path!: string;

  @Field()
  @Column()
  mimetype!: string;

  @Field(() => Int)
  @Column("int")
  @IsPositive()
  width!: number;

  @Field(() => Int)
  @Column("int")
  @IsPositive()
  height!: number;

  @Field(() => [Label])
  @OneToMany(() => Label, (data) => data.labelClass, { lazy: true })
  labels!: Promisable<Label[]>;

  @Field(() => Dataset)
  @ManyToOne(() => Dataset, (data) => data.images)
  dataset!: Promisable<Dataset>;

  @Column()
  @RelationId((data: Image) => data.dataset)
  datasetId!: string;

  @Field(() => GqlJSON, { nullable: true })
  @Column("json", { nullable: true })
  metadata?: unknown;
}
