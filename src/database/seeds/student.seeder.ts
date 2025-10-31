import { Student } from 'src/modules/students/entities/student.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class StudentSeeder implements Seeder {
  public async run(
    _dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const studentFactory = factoryManager.get(Student);
    await studentFactory.saveMany(248);
  }
}
