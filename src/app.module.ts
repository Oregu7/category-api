import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/shared/entities'],
      entitiesTs: ['./src/shared/entities'],
      dbName: 'test-db',
      type: 'postgresql',
    }),
    CategoryModule,
  ],
  controllers: [AppController, CategoryController],
  providers: [AppService, CategoryService],
})
export class AppModule {}
