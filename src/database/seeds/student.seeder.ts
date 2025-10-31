import { Student } from 'src/modules/students/entities/student.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class StudentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(Student);
    const studentFactory = factoryManager.get(Student);

    const count = await repository.count();
    if (count > 0) return;

    await studentFactory.saveMany(248);
  }
}
