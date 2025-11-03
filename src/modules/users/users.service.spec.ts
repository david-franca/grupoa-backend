import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';

// Mock da função paginate e bcrypt
jest.mock('nestjs-typeorm-paginate');
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

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

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOneOrFail: jest.fn().mockResolvedValue(mockUser),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.restoreAllMocks();
    mockRepository.findOneOrFail.mockResolvedValue(mockUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };
      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw a ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException(
          `Um usuário com o e-mail '${createUserDto.email}' já existe.`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const options: IPaginationOptions = { page: 1, limit: 10 };
      const params = { search: 'test', field: 'name', order: 'ASC' as const };
      const paginatedResult: Pagination<User> = new Pagination([mockUser], {
        itemCount: 1,
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 1,
      });

      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const result = await service.findAll(options, params);

      expect(paginate).toHaveBeenCalledWith(repository, options, {
        where: {
          isActive: true,
          name: ILike(`%${params.search}%`),
          email: ILike(`%${params.search}%`),
        },
        order: { [params.field]: params.order },
        select: ['id', 'email', 'name', 'role'],
      });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id },
        select: ['id', 'email', 'name', 'isActive', 'role'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = 999;
      mockRepository.findOneOrFail.mockRejectedValue(new NotFoundException());
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const result = await service.findOneByEmail(email);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email },
        select: ['id', 'email', 'password', 'name', 'isActive', 'role'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'not-found@example.com';
      mockRepository.findOneOrFail.mockRejectedValue(new NotFoundException());
      await expect(service.findOneByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      await service.update(id, updateUserDto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockUser,
        updateUserDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('remove', () => {
    it('should soft delete a user by setting isActive to false', async () => {
      const id = 1;
      const softDeletedUser = { ...mockUser, isActive: false };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(softDeletedUser);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(mockRepository.merge).toHaveBeenCalledWith(mockUser, {
        isActive: false,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(softDeletedUser);
    });
  });
});
