import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('1. Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login e retorna um token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    example: {
      statusCode: 401,
      timestamp: '2025-10-29T18:54:57.819Z',
      path: '/auth/login',
      errors: ['Credenciais inválidas'],
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário e retorna um token JWT' })
  @ApiResponse({
    status: 201,
    description: 'Registro bem-sucedido',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de registro inválidos',
    example: {
      statusCode: 409,
      timestamp: '2025-10-29T18:56:35.547Z',
      path: '/auth/register',
      errors: ["Um usuário com o e-mail 'email@teste.com.br' já existe."],
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
