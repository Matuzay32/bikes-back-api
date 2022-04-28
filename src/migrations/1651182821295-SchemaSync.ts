import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1651182821295 implements MigrationInterface {
  name = 'SchemaSync1651182821295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "desc" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "desc"`);
  }
}
