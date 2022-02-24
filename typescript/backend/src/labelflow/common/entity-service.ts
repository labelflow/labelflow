import { Class } from "type-fest";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions as RepoFindManyOptions,
  FindOneOptions as RepoFindOneOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import { v4 as uuid } from "uuid";

export type FindByIdOptions<TEntity> = Pick<
  RepoFindOneOptions<TEntity>,
  "select"
>;

export type FindOneOptions<TEntity> = Pick<
  RepoFindOneOptions<TEntity>,
  "select" | "where"
>;

export type FindManyOptions<TEntity> = Pick<
  RepoFindManyOptions<TEntity>,
  "select" | "where" | "order" | "skip" | "take"
>;

export class EntityService<
  TEntity,
  TCreateInput extends DeepPartial<TEntity> = DeepPartial<TEntity>,
  TUpdateInput extends DeepPartial<TEntity> = DeepPartial<TEntity>
> {
  constructor(
    private readonly entityType: Class<TEntity>,
    private readonly entityRepository: Repository<TEntity>
  ) {}

  async create(input: TCreateInput): Promise<TEntity> {
    const data = this.entityRepository.create(input);
    const anyInput = input as any;
    // FIXME NEST Update db schema to make these generated fields nullable
    const withId = {
      ...data,
      id: anyInput.id ?? uuid(),
      updatedAt: anyInput.updatedAt ?? new Date(),
    };
    const inserted = await this.entityRepository.insert(withId as any);
    const [{ id }] = inserted.identifiers;
    return await this.findById(id);
  }

  findById(id: string, options?: FindByIdOptions<TEntity>): Promise<TEntity> {
    return this.entityRepository.findOneOrFail(id, options);
  }

  findOne(options: FindOneOptions<TEntity>): Promise<TEntity | undefined> {
    return this.entityRepository.findOne(options);
  }

  findOneOrFail(options: FindOneOptions<TEntity>): Promise<TEntity> {
    return this.entityRepository.findOneOrFail(options);
  }

  findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.entityRepository.find(options);
  }

  async updateById(id: string, data: TUpdateInput): Promise<void> {
    const result = await this.entityRepository.update(id, data);
    this.verifyUpdate(result, id);
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.entityRepository.delete(id);
    this.verifyUpdate(result, id);
  }

  async softDeleteById(id: string): Promise<void> {
    const result = await this.entityRepository.softDelete(id);
    this.verifyUpdate(result, id);
  }

  async count(options?: FindManyOptions<TEntity>): Promise<number> {
    return await this.entityRepository.count(options);
  }

  private verifyUpdate({ affected }: DeleteResult | UpdateResult, id: string) {
    if ((affected ?? 0) > 0) return;
    throw new Error(`Cannot update ${this.entityType.name} with ID ${id}`);
  }
}
