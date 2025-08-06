import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { 
    user0_test_table,
  } from './shard0';
  
  import { 
    user1_test_table,
  } from './shard1';
  
  import { 
    user2_test_table
  } from './shard2';
  
  import { 
    user3_test_table
  } from './shard3';

@Injectable()
export class ShardDatabaseService {
    constructor(
        // User Table
        private readonly user0_test_table: user0_test_table,
        private readonly user1_test_table: user1_test_table,
        private readonly user2_test_table: user2_test_table,
        private readonly user3_test_table: user3_test_table,
        // User Table End
    ) {}

    // 샤딩된 Class 의 이름을 자동 생성.
    async getShardingDatabaseTable(table_name: string, Dbnum: number){
        let table_split = table_name.split("_");
        let database_table_name;
        
        for(let i in table_split){
            if(i == "0"){
                database_table_name = table_split[i] + Dbnum;
            }else{
                database_table_name += "_" + table_split[i];
            }
        }
        database_table_name += "_table";

        return database_table_name;
    }

    async add(table_name: string, Dbnum: number, add_params: Object) {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);

        return await this[sharding_table_name].add(add_params);
    }

    async save(table_name: string, Dbnum: number, add_params: Object) {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);

        return await this[sharding_table_name].save(add_params);
    }

    async set(table_name: string, Dbnum: number, where_obj: Object, update_params: Object) {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);

        await this[sharding_table_name].set(where_obj, update_params);
    }

    async get(table_name: string, Dbnum: number, where_obj: Object): Promise<any> {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);
        return await this[sharding_table_name].get(where_obj);
    }

    async del(table_name: string, Dbnum: number, where_obj: Object): Promise<any> {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);
        return await this[sharding_table_name].del(where_obj);
    }

    async get_test(table_name: string = "user_test", Dbnum: number = 0): Promise<any> {
        const sharding_table_name = await this.getShardingDatabaseTable(table_name, Dbnum);
        return await this[sharding_table_name].get_lists();
    }
}