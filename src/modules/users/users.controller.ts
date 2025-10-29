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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('3. Usuários')
@ApiBearerAuth('JWT-auth')
@ApiResponse({
  status: 401,
  description: 'Não autorizado.',
  example: {
    statusCode: 401,
    timestamp: '2025-10-29T19:07:17.849Z',
    path: '/users',
    errors: ['Unauthorized'],
  },
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    example: [
      {
        id: 4,
        name: 'Jonas Mafra',
        email: 'jmafra@escola.com.br',
        isActive: true,
        role: 'admin',
      },
    ],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    example: {
      id: 4,
      name: 'Jonas Mafra',
      email: 'jmafra@escola.com.br',
      isActive: true,
      role: 'admin',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
    example: {
      statusCode: 404,
      timestamp: '2025-10-29T19:13:47.142Z',
      path: '/users/1',
      errors: ['O recurso solicitado não foi encontrado.'],
    },
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID (inativação)' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
