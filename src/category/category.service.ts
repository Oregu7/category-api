import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import slugify from 'slugify';

import { CategoryEntity } from '../shared/entities/category.entity';
import { CategoryCreateDto, CategoryUpdateDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: EntityRepository<CategoryEntity>,
  ) {}

  async getCategory(key: string) {
    const where: Partial<CategoryEntity> = {};

    if (isUUID(key, '4') === true) {
      where.ID = key;
    } else {
      where.slug = key;
    }

    const category = await this.categoryRepository.findOne(where);

    if (category === undefined) {
      throw new HttpException('Category - Not Found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async createCategory(dto: CategoryCreateDto) {
    CategoryEntity.deleteAllFieldsExcept(dto, [
      'name',
      'description',
      'active',
    ]);

    const category = CategoryEntity.createFrom({
      ...dto,
      slug: this.generateSlug(dto.name),
    });

    await this.categoryRepository.nativeInsert(category);

    return category;
  }

  async updateCategory(category: CategoryEntity, dto: CategoryUpdateDto) {
    const patch: Partial<CategoryEntity> = dto;

    CategoryEntity.deleteAllFieldsExcept(patch, [
      'name',
      'description',
      'active',
    ]);

    category.apply(patch);

    if (dto.name !== undefined) {
      patch.slug = this.generateSlug(patch.name);
      category.slug = patch.slug;
    }

    if (category.$isChanged === false) {
      throw new HttpException(
        "Category isn't changed",
        HttpStatus.NOT_MODIFIED,
      );
    }

    await this.categoryRepository.nativeUpdate({ ID: category.ID }, patch);

    return category;
  }

  async removeCategory(category: CategoryEntity) {
    await this.categoryRepository.nativeDelete(category);
  }

  // ------------------------------------------
  // Helpers
  // ------------------------------------------

  generateSlug(value: string) {
    return slugify(value, { lower: true });
  }
}
