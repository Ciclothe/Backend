import { IsString, IsInt, IsOptional, IsDate, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  maxClothes: number;

  @IsDate()
  Date: Date;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  maximumCapacity: number;

  @IsInt()
  creatorId: number;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  maxClothes?: number;

  @IsDate()
  @IsOptional()
  Date?: Date;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  maximumCapacity?: number;
}