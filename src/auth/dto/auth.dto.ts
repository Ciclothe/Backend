

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDate,
  IsInt,
} from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  secondName: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  country: string;

  @IsNotEmpty()
  @IsEmail()
  city: string;

  @IsNotEmpty()
  @IsBoolean()
  receivePromotions: boolean;

  @IsNotEmpty()
  @IsBoolean()
  termsAndConditions: boolean;

  @IsNotEmpty()
  @IsDate()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class TokenDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

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
