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
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParamsStudent } from './dto/params-student.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateStudent,
  ApiFindAllStudents,
  ApiFindOneStudent,
  ApiRemoveStudent,
  ApiUpdateStudent,
} from '../../common/decorators/student.decorators';
import { ApiUnauthorized } from '../../common/decorators/common.decorators';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('2. Alunos')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorized('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateStudent()
  @Roles('admin')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiFindAllStudents()
  findAll(@Query() { search, limit, page, field, order }: ParamsStudent) {
    return this.studentsService.findAll(
      { limit, page, route: '/students' },
      { search, field, order },
    );
  }

  @Get(':ra')
  @ApiFindOneStudent()
  findOne(@Param('ra') ra: string) {
    return this.studentsService.findOne(ra);
  }

  @Patch(':ra')
  @ApiUpdateStudent()
  update(@Param('ra') ra: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(ra, updateStudentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':ra')
  @ApiRemoveStudent()
  @Roles('admin')
  remove(@Param('ra') ra: string) {
    return this.studentsService.remove(ra);
  }
}
