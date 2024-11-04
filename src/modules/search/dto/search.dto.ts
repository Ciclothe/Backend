import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class SearchPublicationsDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  categories: string;
}

export class SearchIdDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
