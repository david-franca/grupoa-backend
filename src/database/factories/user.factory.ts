import { User } from 'src/modules/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

export default setSeederFactory(User, (faker) => {
  const person = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
  const user = new User();
  user.name = person.firstName + ' ' + person.lastName;
  user.email = faker.internet
    .email({
      firstName: person.firstName,
      lastName: person.lastName,
    })
    .toLowerCase();
  user.password = bcrypt.hashSync(faker.internet.password(), 10);
  user.role = faker.helpers.arrayElement(['admin', 'user']);
  return user;
});
