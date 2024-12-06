import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({description: 'User password'})
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({description: 'User email'})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({description: 'User new password'})
  @IsOptional()
  @IsString()
  newPassword?: string;
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
