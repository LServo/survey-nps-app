import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveysUsers1638348620601 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'surveys_users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'user_id',
                        type: 'uuid'
                    },
                    {
                        name: 'survey_id',
                        type: 'uuid'
                    },
                    {
                        name: 'value',
                        type: 'number',
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKUser',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user_id'],
                        onDelete: 'CASCADE', // se os dados da tabela 'users' forem deletados, também serão deletados na tabela 'surveys_users'
                        onUpdate: 'CASCADE' // se os dados da tabela 'users' forem alterados, a alteração também será feita em "cascata" na tabela 'surveys_users'
                    },
                    {
                        name: 'FKSurvey',
                        referencedTableName: 'surveys',
                        referencedColumnNames: ['id'],
                        columnNames: ['survey_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('surveys_users')
    }

}
