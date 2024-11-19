import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CommunitiesDto {
    @ApiProperty({ description: 'Name of the community' })
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'Description of the community' })
    @IsString()
    description: string;
  }