import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { Promisable } from "type-fest";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { TotalCountAggregates } from "../models";
import { Image } from "./image.entity";
import { LabelClass } from "./label-class.entity";
import { Workspace } from "./workspace.entity";

@ObjectType()
@Entity("Dataset")
@Index(["workspaceSlug", "slug"], { unique: true })
@Index(["workspaceSlug", "name"], { unique: true })
@Index(["workspaceSlug", "createdAt"], { unique: true })
@Index(["createdAt"], { unique: true })
export class Dataset {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
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

  @Field()
  @Column()
  slug!: string;

  @Field(() => Workspace)
  @ManyToOne(() => Workspace, (data) => data.datasets)
  @JoinColumn({ name: "workspaceSlug", referencedColumnName: "slug" })
  workspace!: Workspace;

  @Column()
  @RelationId((data: Dataset) => data.workspace)
  workspaceSlug!: string;

  // @Column()
  // @RelationId((data: Dataset) => data.workspace)
  // workspaceId!: string;

  @Field(() => [LabelClass])
  @OneToMany(() => LabelClass, (data) => data.dataset, { lazy: true })
  labelClasses!: Promisable<LabelClass[]>;

  @Field(() => [Image])
  @OneToMany(() => Image, (data) => data.dataset, { lazy: true })
  images!: Promisable<Image[]>;

  @Field(() => TotalCountAggregates)
  imagesAggregates?: TotalCountAggregates;

  @Field(() => TotalCountAggregates)
  labelsAggregates?: TotalCountAggregates;

  @Field(() => TotalCountAggregates)
  labelClassesAggregates?: TotalCountAggregates;
}
