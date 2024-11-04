import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Size {
  ExtraExtraSmall = 'XXS',
  ExtraSmall = 'XS',
  Small = 'S',
  Medium = 'M',
  Large = 'L',
  ExtraLarge = 'XL',
  ExtraExtraLarge = 'XXL',
}

export enum Condition {
  New = 'New',
  VeryGood = 'VeryGood',
  Good = 'Good',
  Satisfactory = 'Satisfactory',
}

export class PublicationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(Condition)
  currentCondition: Condition;

  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @IsOptional()
  @IsString()
  usageTime?: string;

  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  categories: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: string[];

  media: string[];
}

export class EditPublicationDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(Condition)
  currentCondition?: Condition;

  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @IsOptional()
  @IsString()
  usageTime?: string;

  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(['Yes', 'No'])
  reserved?: 'Yes' | 'No';
}

class ConditionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class TypeDto {
  @IsInt()
  id: number;

  @IsString()
  type: string;
}

class SizeDto {
  @IsString()
  title: string;

  @IsString()
  value: string;
}

class ColorDto {
  @IsString()
  title: string;

  @IsString()
  value: string;
}

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  country: string;
}

class DescriptionDto {
  @IsString()
  title: string;

  @IsString()
  usageTime: string;

  @IsString()
  description: string;

  @IsString()
  gender: string;

  @IsString()
  brand: string;

  @ValidateNested()
  @Type(() => SizeDto)
  size: Size;

  @ValidateNested()
  @Type(() => ColorDto)
  color: string;

  @IsArray()
  @IsString({ each: true })
  materials: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

class CategoresDto {
  genre: number;
  type: number;
  category: number;
}

class MediaDto {
  name: string;
  size: string;
  base64: string;
}

export class PostDetailsDto {
  @ValidateNested()
  @Type(() => ConditionDto)
  condition: Condition;

  @IsArray()
  @IsInt()
  categories: any;

  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;

  @ValidateNested()
  media: MediaDto[];
}
