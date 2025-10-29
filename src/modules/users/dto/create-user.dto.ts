import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Jonas Mafra',
    description: 'Nome do usuário.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'jmafra@escola.com.br',
    description: 'E-mail do usuário, utilizado para login.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senhaForte123',
    description: 'Senha de acesso do usuário.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
