import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import GqlJSON from "graphql-type-json";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { LabelType } from "../enums";
import { Geometry } from "../models";
import { Image } from "./image.entity";
import { LabelClass } from "./label-class.entity";

@ObjectType()
@Entity("Label")
@Index(["labelClassId"])
@Index(["imageId", "createdAt"])
export class Label {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
  id!: string;

  @Field(() => LabelType)
  @Column({ type: "enum", enum: LabelType })
  type!: LabelType;

  @Field()
  @CreateDateColumn({ type: "timestamp without time zone" })
  createdAt!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: "timestamp without time zone", nullable: true })
  updatedAt?: Date;

  // @DeleteDateColumn()
  // deletedAt?: Date;

  @Field(() => Image)
  @ManyToOne(() => Image, (data) => data.labels)
  image!: Image;

  // FIXME NEST This should not be a GraphQL field but DeleteLabelInUndoStoreMutation uses it
  @Field()
  @Column()
  @RelationId((data: Label) => data.image)
  imageId!: string;

  @Field(() => LabelClass, { nullable: true })
  @ManyToOne(() => LabelClass, (data) => data.labels, { nullable: true })
  labelClass?: LabelClass;

  @Column({ nullable: true })
  @RelationId((data: Label) => data.labelClass)
  labelClassId?: string;

  @Field(() => Float, { nullable: true })
  @Column("float")
  @Min(0)
  @IsOptional()
  x?: number;

  @Field(() => Float, { nullable: true })
  @Column("float")
  @Min(0)
  @IsOptional()
  y?: number;

  @Field(() => Float, { nullable: true })
  @Column("float")
  @IsPositive()
  @IsOptional()
  width?: number;

  @Field(() => Float, { nullable: true })
  @Column("float")
  @IsPositive()
  @IsOptional()
  height?: number;

  @Field(() => Geometry, { nullable: true })
  @Column("jsonb")
  geometry?: Geometry;

  @Field(() => GqlJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  smartToolInput?: unknown;
}
