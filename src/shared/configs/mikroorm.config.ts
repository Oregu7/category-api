import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { CategoryEntity } from '../entities';

export const getMikroORMConfig = (): MikroOrmModuleSyncOptions => {
  return {
    entities: [CategoryEntity],
    dbName: process.env.DB_NAME || 'categories_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    host: process.env.DB_SERVER || 'localhost',
    type: 'postgresql',
  };
};
