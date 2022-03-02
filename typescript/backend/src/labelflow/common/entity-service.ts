import { Class } from "type-fest";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions as RepoFindManyOptions,
  FindOneOptions as RepoFindOneOptions,
  Repository,
  UpdateResult,
} from "typeorm";

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
  TCreateInput = DeepPartial<TEntity>,
  TUpdateInput = DeepPartial<TEntity>
> {
  constructor(
    private readonly entityType: Class<TEntity>,
    private readonly entityRepository: Repository<TEntity>
  ) {}

  async create(input: TCreateInput): Promise<TEntity> {
    const data = await this.entityRepository.create(input);
    return await this.entityRepository.save(data);
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
