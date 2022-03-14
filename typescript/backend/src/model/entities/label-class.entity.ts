import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { IsHexColor, IsOptional, IsUUID, Min } from "class-validator";
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
import { TotalCountAggregates } from "../models";
import { ColorHex } from "../scalars";
import { Dataset } from "./dataset.entity";
import { Label } from "./label.entity";

@ObjectType()
@Entity("LabelClass")
@Index(["datasetId", "createdAt"])
@Index(["datasetId", "name"], { unique: true })
export class LabelClass {
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

  @Field()
  @Column({ type: "text" })
  name!: string;

  @Field(() => ColorHex, { nullable: true })
  @Column()
  @IsHexColor()
  @Column({ type: "text" })
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
