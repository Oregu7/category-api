import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

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
  @ApiProperty({ type: 'string', description: 'Название категории' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({ type: 'string', description: 'Описание категории' })
  @IsString()
  @IsOptional()
  @Length(1, 500)
  description?: string;

  @ApiProperty({ type: 'boolean', description: 'ВКЛ / ВЫКЛ' })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
