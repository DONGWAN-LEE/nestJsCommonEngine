import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, QueryRunner, Repository} from 'typeorm';
import { user_test } from '../../entities/user/user_test.entity';

@Injectable()
export class user2_test_table {
    /*constructor(private readonly dataSource: DataSource) {
        
    }*/
    constructor(
        @InjectRepository(user_test, 'shard2DB')
        private repository: Repository<user_test>,
        private readonly dataSource: DataSource
    ) {}

    async get_lists() : Promise<user_test[]> {
        return await this.repository.find();
    }

    async get_user_info(where_params: Object) : Promise<user_test[]> {
        return await this.repository.find({
            select: ['idx'],
            where: {
                idx: where_params[0],
                // Withraw: 1,
            }
            // skip: 0,
            // take: 1,
        })
    }

    async add(add_param: Object) {
        return await this.repository.insert(add_param);
    }

    async set(where_obj: Object, update_param: Object) {
        return await this.repository.update(where_obj, update_param);
    }

    async get(where_params: Object) : Promise<user_test[]> {
        return await this.repository.find({
            where: where_params
            // skip: 0,
            // take: 1,
        })
    }

    async field_get(field_params: Object, where_params: Object) : Promise<user_test[]> {
        return await this.repository.find({
            select: field_params,
            where: where_params
        })
    }

    //initalize the database
    async init(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        return queryRunner;
    }
}