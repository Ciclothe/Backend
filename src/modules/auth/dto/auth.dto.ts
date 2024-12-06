import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDate,
  IsInt,
} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Latitude of the user' })
  latitude: number;

  @ApiProperty({ description: 'Longitude of the user' })
  longitude: number;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ description: 'Country of the user' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ description: 'City of the user' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Whether the user wants to receive promotions' })
  @IsNotEmpty()
  @IsBoolean()
  receivePromotions: boolean;

  @ApiProperty({ description: 'Whether the user accepts terms and conditions' })
  @IsNotEmpty()
  @IsBoolean()
  termsAndConditions: boolean;

  @ApiProperty({ description: 'Date of birth of the user' })
  @IsNotEmpty()
  @IsDate()
  dob: Date;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class TokenDto {
  @IsInt()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsNotEmpty()
  iat: number;

  @IsInt()
  @IsNotEmpty()
  exp: number;
}
