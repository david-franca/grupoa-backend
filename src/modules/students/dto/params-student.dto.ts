import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ParamsStudent {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString({}, { message: 'O parâmetro "page" deve ser um número.' })
  @IsNotEmpty({ message: 'O parâmetro "page" é obrigatório.' })
  page: number;

  @IsNumberString({}, { message: 'O parâmetro "limit" deve ser um número.' })
  @IsNotEmpty({ message: 'O parâmetro "limit" é obrigatório.' })
  limit: number;
}
