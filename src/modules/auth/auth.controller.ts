import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin, ApiRegister } from '../../common/decorators/auth.decorators';

@ApiTags('1. Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiRegister()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
