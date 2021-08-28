import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1629258641541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO user(name, password, username, rol, identification, type, image, email) VALUES("Jipson Saad", "123456", "Exodiel", "admin", "2300060981", "user", "https://www.avatarapi.com/ajax/instant.aspx?email=jipson09saad@gmail.com", "jipson09saad@gmail.com")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE user');
  }
}
