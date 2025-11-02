import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ParamsUser {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString({}, { message: 'O parâmetro "page" deve ser um número.' })
  @IsNotEmpty({ message: 'O parâmetro "page" é obrigatório.' })
  page: number;

  @IsNumberString({}, { message: 'O parâmetro "limit" deve ser um número.' })
  @IsNotEmpty({ message: 'O parâmetro "limit" é obrigatório.' })
  limit: number;

  @IsString()
  @IsOptional()
  field: string;

  @IsEnum(['asc', 'desc'])
  @IsString()
  @IsOptional()
  order: string;
}
