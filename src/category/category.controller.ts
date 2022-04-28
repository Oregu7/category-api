import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CategoryCreateDto, CategoryUpdateDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Создание черновика брони' })
  @UsePipes(new ValidationPipe())
  @Post('')
  async createCategory(@Body() dto: CategoryCreateDto) {
    const category = await this.categoryService.createCategory(dto);

    return category.$dto;
  }

  @ApiOperation({ summary: 'Получение категории' })
  @Get(':key')
  async getCategory(@Param('key') key: string) {
    const category = await this.categoryService.getCategory(key);

    return category.$dto;
  }

  @ApiOperation({ summary: 'Получение категории' })
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
