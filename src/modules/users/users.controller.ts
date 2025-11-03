import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiCreateUser,
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiRemoveUser,
  ApiUpdateUser,
} from '../../common/decorators/users.decorators';
import { ApiUnauthorized } from 'src/common/decorators/common.decorators';
import { ParamsUser } from './dto/params-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('3. Usuários')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorized('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiFindAllUsers()
  findAll(@Query() { search, limit, page, field, order }: ParamsUser) {
    return this.usersService.findAll(
      { limit, page, route: '/users' },
      { search, field, order },
    );
  }

  @Get(':id')
  @ApiFindOneUser()
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiUpdateUser()
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiRemoveUser()
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
