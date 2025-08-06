import { Module, Provider } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { AiService } from './gpt.service';
import { CommonService } from '../../../common/src/common.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../../cache/redis.module';
import { RedisService } from '../../../cache/redis.service';
import { SocketService } from 'src/socket/socketBackEnd/socket.service';

import { MasterDatabaseModule } from '../../../common/database/master_database.module';
import { MasterDatabaseService } from '../../../common/database/master_database.service';

import { ShardDatabaseModule } from '../../../common/database/shard_database.module';
import { ShardDatabaseService } from '../../../common/database/shard_database.service';

import * as MASTER_ENTITIES from '../../../common/entities/master';
import * as MASTER_TABLES from '../../../common/database/master';

import * as SHARD_ENTITIES from '../../../common/entities/user';
import * as SHARD0_TABLES from '../../../common/database/user0';
import * as SHARD1_TABLES from '../../../common/database/user1';
import * as SHARD2_TABLES from '../../../common/database/user2';
import * as SHARD3_TABLES from '../../../common/database/user3';

const master_tableProviders = Object.values(MASTER_TABLES) as Provider[];

const shard0_tableProviders = Object.values(SHARD0_TABLES) as Provider[];
const shard1_tableProviders = Object.values(SHARD1_TABLES) as Provider[];
const shard2_tableProviders = Object.values(SHARD2_TABLES) as Provider[];
const shard3_tableProviders = Object.values(SHARD3_TABLES) as Provider[];

@Module({
  imports: [
    ...(process.env.ENABLE_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(MASTER_ENTITIES)),
    ] : []),
    ...(process.env.ENABLE_DATABASE === 'true' && process.env.ENABLE_SHARD_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard0DB'),
      TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard1DB'),
      TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard2DB'),
      TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard3DB'),
    ] : []),
    RedisModule,
    MasterDatabaseModule,
    ShardDatabaseModule
  ],
  controllers: [
    GptController,
  ],
  providers: [
    AiService, 
    RedisService,
    CommonService,

    SocketService,
    MasterDatabaseService,
    ShardDatabaseService,
    ...(process.env.ENABLE_DATABASE === 'true' ? master_tableProviders : []),

    ...(process.env.ENABLE_DATABASE === 'true' && process.env.ENABLE_SHARD_DATABASE === 'true'  ? shard0_tableProviders : []),
    ...(process.env.ENABLE_DATABASE === 'true' && process.env.ENABLE_SHARD_DATABASE === 'true'  ? shard1_tableProviders : []),
    ...(process.env.ENABLE_DATABASE === 'true' && process.env.ENABLE_SHARD_DATABASE === 'true'  ? shard2_tableProviders : []),
    ...(process.env.ENABLE_DATABASE === 'true' && process.env.ENABLE_SHARD_DATABASE === 'true'  ? shard3_tableProviders : []),
  ],
})

export class GptV1_0_0Module {}
