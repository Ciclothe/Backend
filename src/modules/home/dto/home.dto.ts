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

export class UserPublicationDto {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsInt()
  publicationId: number;

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
  @IsNotEmpty()
  @IsString()
  category: string;

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
