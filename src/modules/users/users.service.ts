import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create = async (createUserDto: CreateUserDto): Promise<User> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const { email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Um usuário com o e-mail '${email}' já existe.`,
      );
    }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  };

  findAll = async (
    options: IPaginationOptions,
    params: { search?: string; field?: string; order?: string },
  ): Promise<Pagination<User>> => {
    const { field, order, search } = params;

    return paginate<User>(this.usersRepository, options, {
      where: {
        isActive: true,
        name: search ? ILike(`%${search}%`) : undefined,
        email: search ? ILike(`%${search}%`) : undefined,
      },
      order: {
        [field ? field : 'name']: order ? order : 'ASC',
      },
      select: ['id', 'email', 'name', 'role'],
    });
  };

  findOne = async (id: number): Promise<User> => {
    return await this.usersRepository.findOneOrFail({
      where: { id },
      select: ['id', 'email', 'name', 'isActive', 'role'],
    });
  };

  findOneByEmail = async (email: string): Promise<User> => {
    return await this.usersRepository.findOneOrFail({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'isActive', 'role'],
    });
  };

  update = async (id: number, updateUserDto: UpdateUserDto): Promise<void> => {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(user);
    return;
  };

  remove = async (id: number): Promise<User> => {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, { isActive: false });
    return this.usersRepository.save(user);
  };
}
