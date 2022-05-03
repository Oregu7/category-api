import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CategoryEntity } from '../../shared/entities';

// -----------------------------------------------

const CATEGORY_SORTED_FIELDS = [
  ...CategoryEntity.SORTED_FIELDS,
  ...CategoryEntity.SORTED_FIELDS.map((field) => `-${field}`),
];

// -----------------------------------------------

export class CategoryCreateDto {
  @ApiProperty({ type: 'string', description: 'Название категории' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({ type: 'string', description: 'Описание категории' })
  @IsString()
  @IsOptional()
  @Length(1, 500)
  description?: string;

  @ApiProperty({ type: 'boolean', description: 'ВКЛ / ВЫКЛ' })
  @IsBoolean()
  active: boolean;
}

export class CategoryUpdateDto {
  @ApiPropertyOptional({ type: 'string', description: 'Название категории' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Описание категории' })
  @IsString()
  @IsOptional()
  @Length(1, 500)
  description?: string;

  @ApiPropertyOptional({ type: 'boolean', description: 'ВКЛ / ВЫКЛ' })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class GetCategoriesQuery {
  @ApiPropertyOptional({ type: 'string', description: 'Название категории' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Описание категории' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Активная категория' })
  @IsIn(['0', '1', 'false', 'true'])
  @IsOptional()
  active?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Описание или название' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: 'number', description: 'Количество категорий' })
  @IsNumber()
  @Min(1)
  @Max(9)
  @Type(() => Number)
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ type: 'number', description: 'Номер страницы' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    enum: CATEGORY_SORTED_FIELDS,
    description: 'Сортировка',
  })
  @IsIn(CATEGORY_SORTED_FIELDS)
  @IsOptional()
  sort?: string;
}
