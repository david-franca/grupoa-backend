import { generateCpf } from 'cpf_and_cnpj-generator';
import { Student } from 'src/modules/students/entities/student.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Student, (faker) => {
  const person = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
  const student = new Student();
  student.name = person.firstName + ' ' + person.lastName;
  student.email = faker.internet
    .email({
      firstName: person.firstName,
      lastName: person.lastName,
    })
    .toLowerCase();
  student.ra = faker.string.alphanumeric({ length: 8 });
  student.cpf = generateCpf();

  return student;
});
