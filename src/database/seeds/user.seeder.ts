import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const count = await repository.count();
    if (count > 0) return;

    await repository.insert([
      {
        name: 'Administrador',
        email: 'admin@maisa.com.br',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
      },
    ]);

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(10);
  }
}
