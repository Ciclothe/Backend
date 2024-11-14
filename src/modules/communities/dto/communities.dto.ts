import { IsString } from "class-validator";

export class CommunitiesDto {
    
    @IsString()
    name: string;

    @IsString()
    description: string;
}