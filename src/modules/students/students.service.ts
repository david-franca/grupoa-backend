import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
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
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find();
  }

  async findOne(ra: string): Promise<Student> {
    return await this.studentsRepository.findOneOrFail({ where: { ra } });
  }

  async update(ra: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(ra);
    this.studentsRepository.merge(student, updateStudentDto);
    return await this.studentsRepository.save(student);
  }

  async remove(ra: string) {
    const student = await this.findOne(ra);
    return this.studentsRepository.remove(student);
  }
}
