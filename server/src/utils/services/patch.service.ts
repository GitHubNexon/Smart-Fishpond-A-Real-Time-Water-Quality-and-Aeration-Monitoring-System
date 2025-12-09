import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  Repository,
  FindOptionsWhere,
  DataSource,
  ObjectLiteral,
} from "typeorm";

export interface PatchOptions<Entity> {
  title?: string;
  description?: string;
  patchBy: keyof Entity; // compile-time safety
  relations?: (keyof Entity)[]; // compile-time safety
}

@Injectable()
export class PatchService<Entity extends ObjectLiteral> {
  constructor(private readonly dataSource: DataSource) {}

  async patch(
    repository: Repository<Entity>,
    value: any,
    updateDto: Partial<Entity>,
    options: PatchOptions<Entity>
  ): Promise<{ old_data: Partial<Entity>; new_data: Entity }> {
    const { patchBy, title, description, relations = [] } = options;

    // Runtime validation for patchBy
    const metadata = repository.metadata;
    const allColumns = metadata.columns.map(
      (col) => col.propertyName
    ) as (keyof Entity)[];
    if (!allColumns.includes(patchBy)) {
      throw new BadRequestException(
        `Runtime Error: Field '${String(patchBy)}' does not exist on entity '${
          metadata.name
        }'`
      );
    }

    // Runtime validation for relations
    relations.forEach((relation) => {
      if (!metadata.relations.some((r) => r.propertyName === relation)) {
        throw new BadRequestException(
          `Runtime Error: Relation '${String(
            relation
          )}' does not exist on entity '${metadata.name}'`
        );
      }
    });

    // Find entity with relations
    const where: FindOptionsWhere<Entity> = { [patchBy]: value } as any;
    const entity = await repository.findOne({
      where,
      relations: relations as string[],
    });

    if (!entity) {
      throw new NotFoundException(
        `Entity not found with ${String(patchBy)}=${value}`
      );
    }

    // Track old data and changes
    const oldData: Partial<Entity> = {};
    let hasChanges = false;

    Object.entries(updateDto).forEach(([key, val]) => {
      if (val !== undefined && (entity as any)[key] !== val) {
        oldData[key as keyof Entity] = (entity as any)[key];
        (entity as any)[key] = val;
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      throw new BadRequestException("No fields were updated");
    }

    const saved = await repository.save(entity);

    return { old_data: oldData, new_data: saved };
  }
}
