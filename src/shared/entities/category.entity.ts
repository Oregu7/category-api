import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { ModelEntity } from './_prototype';

@Entity({ tableName: 'categories' })
export class CategoryEntity extends ModelEntity {
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
