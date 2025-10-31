import { User } from 'src/modules/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync(faker.internet.password(), 10);
  user.role = faker.helpers.arrayElement(['admin', 'user']);
  return user;
});
