import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamsStudent } from './dto/params-student.dto';

@ApiTags('2. Alunos')
@ApiBearerAuth('JWT-auth')
@ApiResponse({
  status: 401,
  description: 'Não autorizado.',
  example: {
    statusCode: 401,
    timestamp: '2025-10-29T19:07:17.849Z',
    path: '/students',
    errors: ['Unauthorized'],
  },
})
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo aluno' })
  @ApiResponse({
    status: 201,
    description: 'Aluno criado com sucesso.',
    example: {
      ra: '26598',
      cpf: '12345678958',
      name: 'João da Silva',
      email: 'jsilva@escola.com.br',
      created_at: '2025-10-29T01:06:01.783Z',
      updated_at: '2025-10-29T01:06:01.783Z',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'RA ou CPF já existe.',
    example: {
      statusCode: 409,
      timestamp: '2025-10-29T19:08:57.317Z',
      path: '/students',
      errors: ["Um aluno com o RA '12345' já existe."],
    },
  })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os alunos paginados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alunos paginada retornada com sucesso.',
    example: {
      items: [
        {
          ra: '6597',
          cpf: '12345678985',
          name: 'João de Deus',
          email: 'jdeus@escola.com.br',
          created_at: '2025-10-28T23:50:40.550Z',
          updated_at: '2025-10-28T23:50:40.550Z',
        },
        {
          ra: '6598',
          cpf: '12345678965',
          name: 'Firmino da Silva',
          email: 'fsilva@escola.com.br',
          created_at: '2025-10-29T22:08:43.504Z',
          updated_at: '2025-10-29T22:08:43.504Z',
        },
      ],
      meta: {
        totalItems: 251,
        itemCount: 10,
        itemsPerPage: 10,
        totalPages: 26,
        currentPage: 1,
      },
      links: {
        first: '/students?limit=10',
        previous: '',
        next: '/students?page=2&limit=10',
        last: '/students?page=26&limit=10',
      },
    },
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca por RA, CPF, nome ou email',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    default: 1,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    default: 10,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query() { search }: ParamsStudent,
  ) {
    console.log('🚀 ~ StudentsController ~ findAll ~ search:', search);
    return this.studentsService.findAll(
      { limit, page, route: '/students' },
      search,
    );
  }

  @Get(':ra')
  @ApiOperation({ summary: 'Retorna um aluno pelo RA' })
  @ApiResponse({
    status: 200,
    description: 'Aluno encontrado.',
    example: {
      ra: '6597',
      cpf: '12345678985',
      name: 'João de Deus',
      email: 'jdeus@escola.com.br',
      created_at: '2025-10-28T23:50:40.550Z',
      updated_at: '2025-10-28T23:50:40.550Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aluno não encontrado.',
    example: {
      statusCode: 404,
      timestamp: '2025-10-29T19:13:47.142Z',
      path: '/students/65978',
      errors: ['O recurso solicitado não foi encontrado.'],
    },
  })
  findOne(@Param('ra') ra: string) {
    return this.studentsService.findOne(ra);
  }

  @Patch(':ra')
  @ApiOperation({ summary: 'Atualiza um aluno pelo RA' })
  @ApiResponse({
    status: 200,
    description: 'Aluno atualizado com sucesso.',
    example: {
      ra: '6597',
      cpf: '12345678985',
      name: 'João de Jesus',
      email: 'jdeus@escola.com.br',
      created_at: '2025-10-28T23:50:40.550Z',
      updated_at: '2025-10-28T23:52:24.550Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Aluno não encontrado.',
    example: {
      statusCode: 404,
      timestamp: '2025-10-29T19:13:47.142Z',
      path: '/students/65978',
      errors: ['O recurso solicitado não foi encontrado.'],
    },
  })
  update(@Param('ra') ra: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(ra, updateStudentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':ra')
  @ApiOperation({ summary: 'Remove um aluno pelo RA' })
  @ApiResponse({ status: 204, description: 'Aluno removido com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Aluno não encontrado.',
    example: {
      statusCode: 404,
      timestamp: '2025-10-29T19:13:47.142Z',
      path: '/students/65978',
      errors: ['O recurso solicitado não foi encontrado.'],
    },
  })
  remove(@Param('ra') ra: string) {
    return this.studentsService.remove(ra);
  }
}
