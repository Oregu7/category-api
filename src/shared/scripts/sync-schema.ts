import { MikroORM } from '@mikro-orm/core';

import { getMikroORMConfig } from '../configs/mikroorm.config';

// ---------------------------------------------------

export const syncSchema = async () => {
  const orm = await MikroORM.init(getMikroORMConfig());

  const generator = orm.getSchemaGenerator();

  try {
    await generator.createSchema();
  } catch (err) {
    console.error(err);
  }

  try {
    await generator.updateSchema();
  } catch (err) {
    console.error(err);
  }

  await generator.refreshDatabase();

  await orm.close(true);
};

// ---------------------------------------------------

if (require.main === module) {
  (async () => {
    await syncSchema();
  })();
}

// ---------------------------------------------------
