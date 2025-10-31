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

    await repository.insert([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('hashed_password_here', 10),
        role: 'admin',
      },
    ]);

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(10);
  }
}
