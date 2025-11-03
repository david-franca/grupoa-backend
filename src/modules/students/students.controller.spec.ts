import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ParamsStudent } from './dto/params-student.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudent: Student = {
    ra: '123456',
    name: 'Test Student',
    email: 'test@example.com',
    cpf: '123.456.789-00',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockStudentsService = {
    create: jest.fn().mockResolvedValue(mockStudent),
    findAll: jest.fn().mockResolvedValue(
      new Pagination([mockStudent], {
        itemCount: 1,
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      }),
    ),
    findOne: jest.fn().mockResolvedValue(mockStudent),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockStudent, name: 'Updated Student' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const createStudentDto: CreateStudentDto = {
        ra: '123456',
        name: 'Test Student',
        email: 'test@example.com',
        cpf: '123.456.789-00',
      };

      const result = await controller.create(createStudentDto);

      expect(service.create).toHaveBeenCalledWith(createStudentDto);
      expect(result).toEqual(mockStudent);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const params: ParamsStudent = {
        limit: 10,
        page: 1,
        field: 'name',
        order: 'asc',
      };
      const result = await controller.findAll(params);

      expect(service.findAll).toHaveBeenCalledWith(
        { limit: params.limit, page: params.page, route: '/students' },
        { search: params.search, field: params.field, order: params.order },
      );
      expect(result.items).toEqual([mockStudent]);
    });
  });

  describe('findOne', () => {
    it('should return a single student', async () => {
      const ra = '123456';
      const result = await controller.findOne(ra);

      expect(service.findOne).toHaveBeenCalledWith(ra);
      expect(result).toEqual(mockStudent);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const ra = '123456';
      const updateStudentDto: UpdateStudentDto = { name: 'Updated Student' };

      const result = await controller.update(ra, updateStudentDto);

      expect(service.update).toHaveBeenCalledWith(ra, updateStudentDto);
      expect(result).toEqual({ ...mockStudent, name: 'Updated Student' });
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const ra = '123456';
      await controller.remove(ra);

      expect(service.remove).toHaveBeenCalledWith(ra);
    });
  });
});
