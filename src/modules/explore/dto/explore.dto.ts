import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParamsCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Subcategory name', required: false })
  @IsOptional()
  @IsString()
  subcategory: string;
}
