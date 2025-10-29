import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  ra: string;

  @IsCPF()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
