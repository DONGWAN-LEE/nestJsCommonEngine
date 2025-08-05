import { Module, Provider } from '@nestjs/common';
import { ClaudeController } from './claude.controller';
import { ClaudeAiService } from './claude.service';
import { CommonService } from '../../../common/src/common.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../../cache/redis.module';
import { RedisService } from '../../../cache/redis.service';
import { SocketService } from 'src/socket/socketBackEnd/socket.service';

import { MasterDatabaseModule } from '../../../common/database/master_database.module';
import { MasterDatabaseService } from '../../../common/database/master_database.service';

import { ShardDatabaseModule } from '../../../common/database/shard_database.module';
import { ShardDatabaseService } from '../../../common/database/shard_database.service';

import * as ENTITIES from '../../../common/entities/master';
import * as TABLES from '../../../common/database/master';
const tableProviders = Object.values(TABLES) as Provider[];

@Module({
  imports: [
    ...(process.env.ENABLE_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(ENTITIES))
    ] : []),
    RedisModule,
    MasterDatabaseModule,
    ShardDatabaseModule
  ],
  controllers: [
    ClaudeController,
  ],
  providers: [
    ClaudeAiService, 
    RedisService,
    CommonService,

    SocketService,
    MasterDatabaseService,
    ShardDatabaseService,
    ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
  ],
})

export class ClaudeV1_0_0Module {}
