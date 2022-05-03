import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './shared/entities';
import { getMikroORMConfig } from './shared/configs/mikroorm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(getMikroORMConfig()),
    MikroOrmModule.forFeature([CategoryEntity]),
    CategoryModule,
  ],
  controllers: [AppController, CategoryController],
  providers: [AppService, CategoryService],
})
export class AppModule {}
