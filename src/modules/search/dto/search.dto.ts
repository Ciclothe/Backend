import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class SearchPublicationsDto {
  @ApiProperty({description: 'id of the publication'})
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({description: 'title of the publication'})
  @IsString()
  @IsNotEmpty()
  categories: string;
}

export class SearchIdDto {
  @ApiProperty({description: 'id of the publication'})
  @IsInt()
  @IsNotEmpty()
  id: number;
}
