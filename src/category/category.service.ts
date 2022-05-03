import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import slugify from 'slugify';
import { stringToBoolean } from 'src/shared/utils/helpers';

import { CategoryEntity } from '../shared/entities/category.entity';
import {
  CategoryCreateDto,
  CategoryUpdateDto,
  GetCategoriesQuery,
} from './dto/category.dto';

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

  async listCategories(params: GetCategoriesQuery) {
    const {
      name,
      description,
      search,
      active,
      pageSize = 2,
      page = 1,
    } = params;

    // 1. build filter
    const filter: FilterQuery<CategoryEntity> = {};

    if (name !== undefined && search === undefined) {
      if (name.includes('е') === true) {
        filter.name = {
          $or: [{ $ilike: name }, { $ilike: name.replace(/е/gi, 'ё') }],
        };
      } else {
        filter.name = { $ilike: name };
      }
    }

    if (description !== undefined && search === undefined) {
      filter.description = { $ilike: description };
    }

    if (search !== undefined) {
      filter.$or = [
        { name: { $ilike: name } },
        { description: { $ilike: description } },
      ];

      if (name.includes('е') === true) {
        filter.$or.push({ name: { $ilike: name.replace(/е/gi, 'ё') } });
      }
    }

    if (active !== undefined) {
      filter.active = { $eq: stringToBoolean(active) };
    }

    // 2. build options
    const options: FindOptions<CategoryEntity> = {
      limit: pageSize,
      offset: (page > 0 ? page - 1 : 0) * pageSize,
    };
  }

  // ------------------------------------------
  // Helpers
  // ------------------------------------------

  generateSlug(value: string) {
    return slugify(value, { lower: true });
  }
}
