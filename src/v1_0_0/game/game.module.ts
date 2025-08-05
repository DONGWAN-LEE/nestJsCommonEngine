import { Module, Provider } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { MasterDatabaseModule } from '../../common/database/master_database.module';
import { MasterDatabaseService } from '../../common/database/master_database.service';

import * as ENTITIES from '../../common/entities/master';
import * as TABLES from '../../common/database/master';

const tableProviders = Object.values(TABLES) as Provider[];

// Table End
@Module({
  imports: [
    ...(process.env.ENABLE_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(ENTITIES))
    ] : []),
    RedisModule,
    MasterDatabaseModule
  ],
  controllers: [GameController],
  providers: [
    GameService, 
    RedisService,
    MasterDatabaseService,
    ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
  ],
})

export class GameV1_0_0Module {}
