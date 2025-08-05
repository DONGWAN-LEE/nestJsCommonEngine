import { Module, Provider } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CommonService } from '../../common/src/common.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';
import { SocketService } from 'src/socket/socketBackEnd/socket.service';

import { MasterDatabaseModule } from '../../common/database/master_database.module';
import { MasterDatabaseService } from '../../common/database/master_database.service';

import { GptV1_0_0Module } from '../ai/gpt/gpt.module';
import { AiService } from '../ai/gpt/gpt.service';

import { GeminiModule } from '../../common/versioning/gemini.module';
import { GeminiAiService } from '../ai/gemini/gemini.service';

import { ClaudeModule } from '../../common/versioning/claude.module';
import { ClaudeAiService } from '../ai/claude/claude.service';

import { SupabaseModule } from '../../supabase/supabase.module';
import { AladinModule } from '../../aladin/aladin.module';

import * as ENTITIES from '../../common/entities/master';
import * as TABLES from '../../common/database/master';

const tableProviders = Object.values(TABLES) as Provider[];

@Module({
  imports: [
    ...(process.env.ENABLE_DATABASE === 'true' ? [
      TypeOrmModule.forFeature(Object.values(ENTITIES))
    ] : []),
    RedisModule,
    MasterDatabaseModule,
    GptV1_0_0Module,
    GeminiModule,
    ClaudeModule,
    SupabaseModule,
    AladinModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService, 
    RedisService,
    CommonService,

    AiService,
    GeminiAiService,
    ClaudeAiService,
    SocketService,
    MasterDatabaseService,
    ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
  ],
})

export class UserV1_0_0Module {}
