import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getNextClassColor } from "labelflow-utils";
import { isNil } from "lodash/fp";
import { Repository } from "typeorm";
import { LabelClass } from "../../model";
import { EntityService } from "../common";
import { LabelClassCreateInput, LabelClassUpdateInput } from "../input";

const getReorderedIndex = (
  oldIndex: number,
  newIndex: number | undefined,
  index: number
): number => {
  if (isNil(newIndex)) return index > oldIndex ? index - 1 : index;
  if (index === oldIndex) return newIndex;
  if (index < oldIndex) {
    return index >= newIndex ? index + 1 : index;
  }
  return index > newIndex ? index : index - 1;
};

@Injectable()
export class LabelClassService extends EntityService<
  LabelClass,
  LabelClassCreateInput & Pick<LabelClass, "index" | "createdAt" | "updatedAt">,
  LabelClassUpdateInput & Partial<Pick<LabelClass, "index">>
> {
  constructor(
    @InjectRepository(LabelClass)
    readonly repository: Repository<LabelClass>
  ) {
    super(LabelClass, repository);
  }

  async create({
    id,
    datasetId,
    color: inputColor,
    ...input
  }: LabelClassCreateInput): Promise<LabelClass> {
    const existing = await this.findAll({
      where: { datasetId },
      select: ["color"],
    });
    const color =
      inputColor ?? getNextClassColor(existing.map(({ color: clr }) => clr));
    const createdAt = new Date();
    const updatedAt = createdAt;
    const index = existing.length;
    return await super.create({
      ...input,
      datasetId,
      id,
      color,
      index,
      createdAt,
      updatedAt,
    });
  }

  async deleteById(id: string): Promise<void> {
    const { index, datasetId } = await this.findById(id, {
      select: ["index", "datasetId"],
    });
    await super.deleteById(id);
    await this.reorderLabelClasses(datasetId, index, undefined);
  }

  async reorder(id: string, newIndex: number): Promise<void> {
    const { datasetId, index } = await this.findById(id, {
      select: ["datasetId", "index"],
    });
    await this.reorderLabelClasses(datasetId, index, newIndex);
  }

  private async reorderLabelClasses(
    datasetId: string,
    oldIndex: number,
    newIndex: number | undefined
  ): Promise<void> {
    if (oldIndex === newIndex) return;
    const labelClasses = await this.findAll({
      where: { datasetId },
      select: ["id", "index"],
    });
    this.validateNewIndex(newIndex, labelClasses.length);
    const updates = labelClasses.map(({ id, index }) => {
      const ordered = getReorderedIndex(oldIndex, newIndex, index);
      return super.updateById(id, { index: ordered });
    });
    await Promise.all(updates);
  }

  async updateById(id: string, data: LabelClassUpdateInput): Promise<void> {
    await super.updateById(id, data);
  }

  private validateNewIndex(
    newIndex: number | undefined,
    nLabelClasses: number
  ): void {
    if (newIndex !== undefined && (newIndex < 0 || newIndex > nLabelClasses)) {
      throw new BadRequestException(`New index ${newIndex} is out-of bounds`);
    }
  }
}
