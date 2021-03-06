import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import slugify from 'slugify';
import { stringToBoolean } from '../shared/utils/helpers';

import { CategoryEntity } from '../shared/entities';
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

    if (category === null) {
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

    await this.checkSlugExist(category.slug, true);

    await this.categoryRepository.nativeInsert(category);

    return category;
  }

  async updateCategory(category: CategoryEntity, dto: CategoryUpdateDto) {
    const patch: Partial<CategoryEntity> = {};

    CategoryEntity.deleteAllFieldsExcept(dto, [
      'name',
      'description',
      'active',
    ]);

    for (const key of Object.keys(dto)) {
      if (dto[key] !== category[key]) {
        patch[key] = dto[key];
      }
    }

    if (patch.name !== undefined) {
      patch.slug = this.generateSlug(patch.name);

      await this.checkSlugExist(patch.slug, true);
    }

    if (Object.keys(patch).length === 0) {
      throw new HttpException(
        "Category isn't changed",
        HttpStatus.NOT_MODIFIED,
      );
    }

    category.apply(patch);

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
      sort = '-createdDate',
    } = params;

    // 1. build filter
    const filter: FilterQuery<CategoryEntity> = {};

    if (name !== undefined && search === undefined) {
      if (name.includes('??') === true) {
        filter.$or = [
          { name: { $ilike: name } },
          { name: { $ilike: name.replace(/??/gi, '??') } },
        ];
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

      if (name.includes('??') === true) {
        filter.$or.push({ name: { $ilike: name.replace(/??/gi, '??') } });
      }
    }

    if (active !== undefined) {
      filter.active = { $eq: stringToBoolean(active) };
    }

    // 2. build options
    const options: FindOptions<CategoryEntity> = {
      limit: pageSize,
      offset: (page > 0 ? page - 1 : 0) * pageSize,
      orderBy: this.parseSortedField(sort),
    };

    const [list, count] = await this.categoryRepository.findAndCount(
      filter,
      options,
    );

    return { list, count };
  }

  // ------------------------------------------
  // Helpers
  // ------------------------------------------

  generateSlug(value: string) {
    return slugify(value, { lower: true });
  }

  parseSortedField(field: string) {
    if (field[0] !== '-') {
      return { [field]: 'ASC' };
    }

    return { [field.slice(1)]: 'DESC' };
  }

  async checkSlugExist(slug: string, throwError = false) {
    const isExist = (await this.categoryRepository.findOne({ slug })) !== null;

    if (isExist === true && throwError === true) {
      throw new HttpException('Category - Already Exists', HttpStatus.CONFLICT);
    }

    return isExist;
  }
}
