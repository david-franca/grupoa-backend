import { IsOptional, IsString } from 'class-validator';

export class ParamsStudent {
  @IsString()
  @IsOptional()
  search?: string;
}
