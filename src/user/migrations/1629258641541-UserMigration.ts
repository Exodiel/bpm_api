import { MigrationInterface, QueryRunner } from 'typeorm';
import faker from 'faker';

export class UserMigration1629258641541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = ['admin', 'vendedor', 'bodeguero', 'transportista'];
    let queryString =
      'INSERT INTO user(name, password, username, rol, identification, type, image, email, identification_type, active) VALUES';
    for (let i = 0; i < 100; i++) {
      queryString += `("${faker.name.firstName()} ${faker.name.lastName()}", "123456", "${faker.internet.avatar()}", "${
        roles[faker.datatype.number(4)]
      }", "${faker.datatype.number(
        10,
      )}", "user", "${faker.image.avatar()}", "${faker.internet.email()}", "cedula", 1),`;
    }
    queryString = queryString.slice(0, queryString.length - 1);
    await queryRunner.query(queryString);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE user');
  }
}
