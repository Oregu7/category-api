import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import {
  CategoryCreateDto,
  CategoryUpdateDto,
  GetCategoriesQuery,
} from './dto/category.dto';

@ApiTags('Категории')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Создание категории' })
  @UsePipes(new ValidationPipe())
  @Post('')
  async createCategory(@Body() dto: CategoryCreateDto) {
    const category = await this.categoryService.createCategory(dto);

    return category.$dto;
  }

  @ApiOperation({ summary: 'Получение списка категорий' })
  @UsePipes(new ValidationPipe())
  @Get('')
  async listCategories(@Query() params: GetCategoriesQuery) {
    const { list, count } = await this.categoryService.listCategories(params);

    return {
      list: list.map((category) => category.$dto),
      count,
    };
  }

  @ApiOperation({ summary: 'Получение категории' })
  @Get(':key')
  async getCategory(@Param('key') key: string) {
    const category = await this.categoryService.getCategory(key);

    return category.$dto;
  }

  @ApiOperation({ summary: 'Изменение категории' })
  @Put(':key')
  async updateCategory(
    @Param('key') key: string,
    @Body() dto: CategoryUpdateDto,
  ) {
    const category = await this.categoryService.getCategory(key);

    await this.categoryService.updateCategory(category, dto);

    return category.$dto;
  }

  @ApiOperation({ summary: 'Удаление категории' })
  @Delete(':key')
  async removeCategory(@Param('key') key: string) {
    const category = await this.categoryService.getCategory(key);

    await this.categoryService.removeCategory(category);

    return true;
  }
}
