import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateStudentDto {
  @ApiProperty({ example: '11223344', description: 'Registro Acadêmico único' })
  @IsString()
  @IsNotEmpty()
  ra: string;

  @ApiProperty({ example: '12345678901', description: 'CPF do aluno' })
  @IsCPF()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do aluno' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'aluno@escola.com.br',
    description: 'Email do aluno',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
