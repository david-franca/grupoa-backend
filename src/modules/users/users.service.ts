import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Um usuário com o e-mail '${email}' já existe.`,
      );
    }

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneOrFail({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneOrFail({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'isActive', 'role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, { isActive: false });
    return this.usersRepository.save(user);
  }
}
