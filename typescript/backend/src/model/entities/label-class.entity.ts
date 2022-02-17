import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { IsHexColor, Min } from "class-validator";
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
import { ColorHex } from "../scalars";
import { TotalCountAggregates } from "../models";
import { Dataset } from "./dataset.entity";
import { Label } from "./label.entity";

@ObjectType()
@Entity("LabelClass")
@Index(["datasetId", "createdAt"])
@Index(["datasetId", "name"], { unique: true })
export class LabelClass {
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
  name!: string;

  @Field(() => ColorHex, { nullable: true })
  @Column()
  @IsHexColor()
  color!: string;

  @Field(() => Int)
  @Column("int")
  @Min(0)
  index!: number;

  @Field(() => Dataset)
  @ManyToOne(() => Dataset, (data) => data.labelClasses)
  dataset!: Dataset;

  @Column()
  @RelationId((data: LabelClass) => data.dataset)
  datasetId!: string;

  @Field(() => [Label])
  @OneToMany(() => Label, (data) => data.labelClass, { lazy: true })
  labels!: Promisable<Label[]>;

  @Field(() => TotalCountAggregates)
  labelsAggregates!: TotalCountAggregates;
}
