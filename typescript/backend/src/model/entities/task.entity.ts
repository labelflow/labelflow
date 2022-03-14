import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { Task as CoreTask, TaskInput } from "labelflow-core";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskStatus } from "../enums";
import { TaskInputScalar } from "../scalars";

@ObjectType()
@Entity(Task.name)
export class Task implements CoreTask {
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

  @Field(() => ID)
  @IsUUID()
  @Column()
  moduleId!: string;

  @Field({ nullable: true })
  @Column()
  functionName!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column()
  summary?: string;

  @Field({ nullable: true })
  @Column()
  remarks?: string;

  @Field(() => TaskInputScalar)
  @Column({ type: "json" })
  input!: TaskInput;

  @Field()
  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.Pending })
  status!: TaskStatus;
}
