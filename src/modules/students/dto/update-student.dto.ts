import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do aluno',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'aluno@escola.com.br',
    description: 'Email do aluno',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
