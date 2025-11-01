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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiRemoveUser,
  ApiUpdateUser,
} from '../../common/decorators/users.decorators';
import { ApiUnauthorized } from 'src/common/decorators/common.decorators';

@ApiTags('3. Usuários')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorized('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiFindAllUsers()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiFindOneUser()
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
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
