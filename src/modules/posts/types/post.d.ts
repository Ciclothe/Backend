export class Publication {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(Condition)
  currentCondition: Condition;

  @IsOptional()
  @IsEnum(Size)
  size?: Size;

  @IsOptional()
  @IsString()
  usageTime?: string;

  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  categories: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: string[];

  media: string[];
}