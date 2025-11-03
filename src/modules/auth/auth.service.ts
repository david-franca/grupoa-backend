import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
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

  validateUser = async (email: string, pass: string) => {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await user.validatePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  };

  generateToken = (user: User) => {
    const payload: JwtPayload = {
      name: user.name,
      email: user.email,
      role: user.role,
      sub: user.id.toString(),
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }),
    };
  };

  login = async (loginDto: LoginDto) => {
    const user = await this.userService.findOneByEmail(loginDto.email);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateToken(user);
  };
}
