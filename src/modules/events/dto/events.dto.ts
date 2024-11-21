import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDate, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({description: 'Event name'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: 'Event description'})
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({description: 'Max number of clothes'})
  @IsInt()
  maxClothes: number;

  @ApiProperty({description: 'Event date'})
  @IsDate()
  Date: Date;

  @ApiProperty({description: 'Event type'})
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({description: 'Event theme'})
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({description: 'Event location'})
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({description: 'postal code'})
  @IsString()
  @IsOptional()
  postalCode?: string;

  latitude?: number;

  longitude?: number;

  @ApiProperty({description: 'Event maximum capacity'}) 
  @IsInt()
  maximumCapacity: number;

  @ApiProperty({description: 'Event creator id'})
  @IsInt()
  creatorId: number;
}

export class UpdateEventDto {
  @ApiProperty({description: 'Event name'})
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({description: 'Event description'})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({description: 'Max number of clothes'})
  @IsInt()
  @IsOptional()
  maxClothes?: number;

  @ApiProperty({description: 'Event date'})
  @IsDate()
  @IsOptional()
  Date?: Date;

  @ApiProperty({description: 'Event type'})
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({description: 'Event theme'})
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({description: 'Event location'})
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({description: 'postal code'})
  @IsString()
  @IsOptional()
  postalCode?: string;

  latitude?: number;

  longitude?: number;
  
  @ApiProperty({description: 'Event maximum capacity'})
  @IsInt()
  @IsOptional()
  maximumCapacity?: number;
}