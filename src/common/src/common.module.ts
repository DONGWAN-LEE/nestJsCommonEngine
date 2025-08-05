// redis-cache.module.ts
import { Module, Provider } from '@nestjs/common';
import { CommonService } from '../../common/src/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { MasterDatabaseModule } from '../database/master_database.module';
import { MasterDatabaseService } from '../database/master_database.service';

import { ShardDatabaseModule } from '../database/shard_database.module';
import { ShardDatabaseService } from '../database/shard_database.service';

import * as ENTITIES from '../entities/master';
import * as TABLES from '../database/master';
const tableProviders = Object.values(TABLES) as Provider[];

@Module({
  imports: [
    ...(process.env.ENABLE_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(ENTITIES))
    ] : []),
    RedisModule,
    MasterDatabaseModule,
    ShardDatabaseModule,
  ],
  providers: [
    CommonService,
    RedisService,
    MasterDatabaseService,
    ShardDatabaseService,
    ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
  ],
})

export class CommonModule {
}