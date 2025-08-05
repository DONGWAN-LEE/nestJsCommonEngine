import { Module, Provider } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleSheetService } from './sheet/google-sheet.service';
import { GooglePlayService } from './playReview/google-play.service';

import { CommonModule } from '../../common/src/common.module';
import { CommonService } from '../../common/src/common.service';

import { GptModule } from '../../common/versioning/gpt.module';
import { AiService } from '../ai/gpt/gpt.service';

import { GeminiModule } from '../../common/versioning/gemini.module';
import { GeminiAiService } from '../ai/gemini/gemini.service';

import { ClaudeModule } from '../../common/versioning/claude.module';
import { ClaudeAiService } from '../ai/claude/claude.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { MasterDatabaseModule } from '../../common/database/master_database.module';
import { MasterDatabaseService } from '../../common/database/master_database.service';

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
    GptModule,
    GeminiModule,
    ClaudeModule,
    CommonModule
  ],
  controllers: [GoogleController],
  providers: [
    RedisService,
    MasterDatabaseService,
    GoogleSheetService,
    GooglePlayService,
    AiService,
    GeminiAiService,
    ClaudeAiService,
    CommonService,
    ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
  ],
})
export class GoogleV1_0_0Module {}
