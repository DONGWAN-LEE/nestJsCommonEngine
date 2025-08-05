import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, In} from 'typeorm';
import { test } from '../../entities/master/test.entity';

@Injectable()
export class test_table {
    /*constructor(private readonly dataSource: DataSource) {
        
    }*/
    constructor(
        @InjectRepository(test)
        private repository: Repository<test>,
        private readonly dataSource: DataSource
    ) {}

    async get(params: Object) : Promise<test[]> {
        return await this.repository.find({
            where: params
        })
    }

    async getField(params: Object) : Promise<test[]> {
        return await this.repository.find({
            where: params,
            select: ['comment_text'],
            order: {
                idx: 'ASC'
            }
        })
    }

    async getListCnt(params: Object) : Promise<number> {
        return await this.repository.count({
            where: params
        })
    }

    async getIn(params: number[]) : Promise<test[]> {
        return this.repository.find({
            where: {idx: In(params)}
        })
    }

    async add(add_params: Object) {
        return await this.repository.save(add_params);
    }

    async set(where_params: Object, update_params: Object) {
        return await this.repository.update(where_params, update_params);
    }

    async truncateTable(){
        await this.dataSource.manager.query(`TRUNCATE TABLE question_comment`);
    }

    // user.service.ts
    async getDistinctCities(field: string): Promise<string[]> {
        const result = await this.repository
        .createQueryBuilder('question_comment')
        .select('DISTINCT question_comment.' + field, field)
        .where('question_comment.belong NOT IN (:...excluded)', {
            excluded: ['CEO', '', '이사회'],
          })
        .getRawMany();
    
        return result.map(row => row.belong);
    }

    //initalize the database
    async init(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        return queryRunner;
    }
}