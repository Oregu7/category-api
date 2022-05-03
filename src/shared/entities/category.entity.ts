import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ModelEntity } from './_prototype';

@Entity({ tableName: 'categories' })
@Index({ name: 'idx_name', properties: ['name'] })
@Unique({ properties: ['slug'] })
export class CategoryEntity extends ModelEntity {
  static readonly SORTED_FIELDS: (keyof CategoryEntity)[] = [
    'ID',
    'active',
    'slug',
    'name',
    'description',
    'createdDate',
    'active',
  ];

  @PrimaryKey()
  ID: string = uuid();

  @Property()
  slug!: string;

  @Property({ length: 100 })
  name!: string;

  @Property({ length: 500, nullable: true })
  description?: string;

  @Property()
  createdDate: Date = new Date();

  @Property()
  active!: boolean;
}
