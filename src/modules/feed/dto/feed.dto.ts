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
  id: string;

  @ApiProperty({ description: 'User ID associated with the publication' })
  @IsInt()
  userId: string;

  @ApiProperty({ description: 'Publication ID associated with the user' })
  @IsInt()
  publicationId:  string;

  @ApiProperty({ description: 'Reaction time of the user' })
  @IsDate()
  reactionTime: Date;
}


export class DecodeDto {
  @IsInt()
  id: string;

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
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class PublicationsDto {
  @IsInt()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriesDto)
  categories: CategoriesDto[];
}

export class ClasificationDto {
  @IsInt()
  id:string;

  @IsNumber()
  @Min(0)
  note: number;
}

export class ClasificationPostDto {
  @IsInt()
  id: string;

  @IsNumber()
  @Min(0)
  @Max(10) 
  calification: number;
}
