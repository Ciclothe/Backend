import {
  IsInt,
  IsString,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserPublicationDto {
  @ApiProperty({ description: 'ID of the user publication' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'User ID associated with the publication' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Publication ID associated with the user' })
  @IsInt()
  publicationId: number;

  @ApiProperty({ description: 'Reaction time of the user' })
  @IsDate()
  reactionTime: Date;
}


export class DecodeDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  iat: number;

  @IsInt()
  exp: number;
}

export class CategoriesDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

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

export class PublicationsDto {
  @IsInt()
  id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriesDto)
  categories: CategoriesDto[];
}

export class ClasificationDto {
  @IsInt()
  id: number;

  @IsNumber()
  @Min(0)
  note: number;
}

export class ClasificationPostDto {
  @IsInt()
  id: number;

  @IsNumber()
  @Min(0)
  @Max(10) 
  calification: number;
}
