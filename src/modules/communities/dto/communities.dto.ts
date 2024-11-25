import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CommunitiesDto {
    @ApiProperty({ description: 'Name of the community' })
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'Description of the community' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Category of the community' })
    @IsString()
    category: string;

    @ApiProperty({ description: 'Photo of the community' })
    @IsString()
    photo: string;
  }