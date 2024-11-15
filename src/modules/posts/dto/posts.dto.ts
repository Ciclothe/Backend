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
import { ApiProperty } from '@nestjs/swagger';

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


export class EditPublicationDto {
  @ApiProperty({ description: 'ID of the publication' })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Title of the publication', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Description of the publication', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Country where the publication is made', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'City where the publication is made', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Current condition of the publication', enum: Condition, required: false })
  @IsOptional()
  @IsEnum(Condition)
  currentCondition?: Condition;

  @ApiProperty({ description: 'Size of the publication', enum: Size, required: false })
  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @ApiProperty({ description: 'Usage time of the publication', required: false })
  @IsOptional()
  @IsString()
  usageTime?: string;

  @ApiProperty({ description: 'Primary color of the publication', required: false })
  @IsOptional()
  @IsString()
  primary_color?: string;

  @ApiProperty({ description: 'Brand of the publication', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Reservation status of the publication', enum: ['Yes', 'No'], required: false })
  @IsOptional()
  @IsEnum(['Yes', 'No'])
  reserved?: 'Yes' | 'No';
}


class SizeDto {
  @ApiProperty({ description: 'Height of the item' })
  @IsString()
  height: string;

  @ApiProperty({ description: 'Width of the item' })
  @IsString()
  width: string;
}

class ColorDto {
  @ApiProperty({ description: 'Primary color of the item' })
  @IsString()
  name:string
}

class LocationDto {
  @ApiProperty({ description: 'City where the item is located' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Country where the item is located' })
  @IsString()
  country: string;
}

class DescriptionDto {
  @ApiProperty({ description: 'Title of the item' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Usage time of the item' })
  @IsString()
  usageTime: string;

  @ApiProperty({ description: 'Description of the item' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Gender related to the item' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Brand of the item' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Size details of the item' })
  @ValidateNested()
  @Type(() => SizeDto)
  size: SizeDto;

  @ApiProperty({ description: 'Color details of the item' })
  @ValidateNested()
  @Type(() => ColorDto)
  color: ColorDto;

  @ApiProperty({ description: 'Materials of the item', type: [String] })
  @IsArray()
  @IsString({ each: true })
  materials: string[];

  @ApiProperty({ description: 'Location details of the item' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ description: 'Tags associated with the item', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

class CategoresDto {
  @ApiProperty({ description: 'Genre identifier' })
  @IsInt()
  genre: number;

  @ApiProperty({ description: 'Type identifier' })
  @IsInt()
  type: number;

  @ApiProperty({ description: 'Category identifier' })
  @IsInt()
  category: number;
}

class MediaDto {
  @ApiProperty({ description: 'Name of the media file' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Size of the media file' })
  @IsString()
  size: string;

  @ApiProperty({ description: 'Base64 encoded content of the media file' })
  @IsString()
  base64: string;
}

class ConditionDto {
  @ApiProperty({ description: 'Condition of the item' })
  @IsString()
  state: string;
}

export class PostDetailsDto {
  @ApiProperty({ description: 'Condition of the item' })
  @ValidateNested()
  @Type(() => ConditionDto)
  condition: ConditionDto;

  @ApiProperty({ description: 'Categories of the item', type: [CategoresDto] })
  @IsArray()
  @ValidateNested({ each: true })
  categories: any;

  @ApiProperty({ description: 'Description details of the item' })
  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;

  @ApiProperty({ description: 'Media files associated with the item', type: [MediaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media: MediaDto[];
}
