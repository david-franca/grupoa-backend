import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

// Mock da função paginate
jest.mock('nestjs-typeorm-paginate');

describe('StudentsService', () => {
  let service: StudentsService;
  let repository: Repository<Student>;

  const mockStudent: Student = {
    ra: '123456',
    name: 'Test Student',
    email: 'test@example.com',
    cpf: '123.456.789-00',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue(mockStudent),
    save: jest.fn().mockResolvedValue(mockStudent),
    findOneOrFail: jest.fn().mockResolvedValue(mockStudent),
    merge: jest.fn(),
    remove: jest.fn().mockResolvedValue(mockStudent),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<Repository<Student>>(getRepositoryToken(Student));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student successfully', async () => {
      const createStudentDto: CreateStudentDto = {
        ra: '123456',
        name: 'Test Student',
        email: 'test@example.com',
        cpf: '123.456.789-00',
      };
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.create(createStudentDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [{ ra: createStudentDto.ra }, { cpf: createStudentDto.cpf }],
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createStudentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockStudent);
      expect(result).toEqual(mockStudent);
    });

    it('should throw a ConflictException if RA already exists', async () => {
      const createStudentDto: CreateStudentDto = { ...mockStudent };
      mockRepository.findOne.mockResolvedValue(mockStudent);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        new ConflictException(
          `Um aluno com o RA '${createStudentDto.ra}' já existe.`,
        ),
      );
    });

    it('should throw a ConflictException if CPF already exists', async () => {
      const createStudentDto: CreateStudentDto = { ...mockStudent };
      const existingStudent = { ...mockStudent, ra: '654321' };
      mockRepository.findOne.mockResolvedValue(existingStudent);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        new ConflictException(
          `Um aluno com o CPF '${createStudentDto.cpf}' já existe.`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated students', async () => {
      const options = { page: 1, limit: 10 };
      const params = { search: 'test', field: 'name', order: 'ASC' as const };
      const paginatedResult: Pagination<Student> = new Pagination(
        [mockStudent],
        {
          itemCount: 1,
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 1,
        },
      );

      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const result = await service.findAll(options, params);

      expect(paginate).toHaveBeenCalledWith(repository, options, {
        where: [
          { ra: ILike(`%${params.search}%`) },
          { cpf: ILike(`%${params.search}%`) },
          { name: ILike(`%${params.search}%`) },
          { email: ILike(`%${params.search}%`) },
        ],
        order: { [params.field]: params.order },
      });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a student by RA', async () => {
      const ra = '123456';
      const result = await service.findOne(ra);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { ra },
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student is not found', async () => {
      const ra = 'not-found';
      mockRepository.findOneOrFail.mockRejectedValue(new NotFoundException());
      await expect(service.findOne(ra)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const ra = '123456';
      const updateStudentDto: UpdateStudentDto = { name: 'Updated Name' };
      const updatedStudent = { ...mockStudent, ...updateStudentDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockStudent);
      mockRepository.save.mockResolvedValue(updatedStudent);

      const result = await service.update(ra, updateStudentDto);

      expect(service.findOne).toHaveBeenCalledWith(ra);
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockStudent,
        updateStudentDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockStudent);
      expect(result).toEqual(updatedStudent);
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const ra = '123456';
      jest.spyOn(service, 'findOne').mockResolvedValue(mockStudent);

      const result = await service.remove(ra);

      expect(service.findOne).toHaveBeenCalledWith(ra);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockStudent);
      expect(result).toEqual(mockStudent);
    });
  });
});
