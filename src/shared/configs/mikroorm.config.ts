import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { CategoryEntity } from '../entities';

export const getMikroORMConfig = (): MikroOrmModuleSyncOptions => {
  return {
    entities: [CategoryEntity],
    dbName: 'categories_db',
    user: 'root',
    password: 'root',
    port: 5443,
    type: 'postgresql',
  };
};
