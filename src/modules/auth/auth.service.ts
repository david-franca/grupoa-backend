import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<Record<keyof EnvConfig, string>>,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await user.validatePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    // Se não bater, retornamos null (o Passport tratará como 401)
    return null;
  }

  generateToken(user: User) {
    const payload: JwtPayload = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }),
    };
  }

  async register(registerDto: RegisterDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateToken(user);
  }
}
