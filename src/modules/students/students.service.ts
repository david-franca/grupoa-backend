import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ILike, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  create = async (createStudentDto: CreateStudentDto): Promise<Student> => {
    const { ra, cpf } = createStudentDto;

    const existingStudent = await this.studentsRepository.findOne({
      where: [{ ra }, { cpf }],
    });

    if (existingStudent) {
      if (existingStudent.ra === ra) {
        throw new ConflictException(`Um aluno com o RA '${ra}' já existe.`);
      }
      if (existingStudent.cpf === cpf) {
        throw new ConflictException(`Um aluno com o CPF '${cpf}' já existe.`);
      }
    }
    const newStudent = this.studentsRepository.create(createStudentDto);
    return await this.studentsRepository.save(newStudent);
  };

  findAll = async (
    options: IPaginationOptions,
    params: { search?: string; field?: string; order?: string },
  ): Promise<Pagination<Student>> => {
    const { field, order, search } = params;
    return paginate<Student>(this.studentsRepository, options, {
      where: search
        ? [
            { ra: ILike(`%${search}%`) },
            { cpf: ILike(`%${search}%`) },
            { name: ILike(`%${search}%`) },
            { email: ILike(`%${search}%`) },
          ]
        : undefined,
      order: {
        [field ? field : 'name']: order ? order : 'asc',
      },
    });
  };

  findOne = async (ra: string): Promise<Student> => {
    return await this.studentsRepository.findOneOrFail({ where: { ra } });
  };

  update = async (ra: string, updateStudentDto: UpdateStudentDto) => {
    const student = await this.findOne(ra);
    this.studentsRepository.merge(student, updateStudentDto);
    return await this.studentsRepository.save(student);
  };

  remove = async (ra: string) => {
    const student = await this.findOne(ra);
    return this.studentsRepository.remove(student);
  };
}
