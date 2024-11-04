import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsInt,
} from 'class-validator';
import { UserRegisterDto } from 'src/auth/dto/auth.dto';

export class ChangeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class ChangeSensitiveInformationDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
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
