import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    validatePassword: jest.fn(),
  };

  const mockUsersService = {
    findOneByEmail: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_EXPIRATION') return '1d';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
    mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      (mockUser.validatePassword as jest.Mock).mockResolvedValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedResult } = mockUser;

      const result = await service.validateUser('test@example.com', 'password');

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password');
      expect(result).toEqual(expectedResult);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'wrong@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is not valid', async () => {
      (mockUser.validatePassword as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );

      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate an access token', () => {
      const result = service.generateToken(mockUser);
      const payload = {
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        sub: mockUser.id.toString(),
      };

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'test-secret',
        expiresIn: '1d',
      });
      expect(result).toEqual({ access_token: 'test-token' });
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const result = await service.login(loginDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toEqual({ access_token: 'test-token' });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );
    });
  });
});
