import { Module, Provider } from '@nestjs/common';
import { SocketService } from '../socketBackEnd/socket.service';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { AdminFrontEndController } from './adminFrontEnd.controller';
import { AdminFrontEndService } from './adminFrontEnd.service';

import { GptModule } from '../../common/versioning/gpt.module';
import { AiService } from '../../v1_0_0/ai/gpt/gpt.service';

import { GeminiModule } from '../../common/versioning/gemini.module';
import { GeminiAiService } from '../../v1_0_0/ai/gemini/gemini.service';

import { ClaudeModule } from '../../common/versioning/claude.module';
import { ClaudeAiService } from '../../v1_0_0/ai/claude/claude.service';

import { CommonService } from '../../common/src/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MasterDatabaseModule } from '../../common/database/master_database.module';
import { MasterDatabaseService } from '../../common/database/master_database.service';

import { ShardDatabaseModule } from '../../common/database/shard_database.module';
import { ShardDatabaseService } from '../../common/database/shard_database.service';

import { GoogleSheetService } from 'src/v1_0_0/google/sheet/google-sheet.service';
import { HttpModule } from '@nestjs/axios';

import * as MASTER_ENTITIES from '../../common/entities/master';
import * as MASTER_TABLES from '../../common/database/master';

import * as SHARD_ENTITIES from '../../common/entities/user';
import * as SHARD0_TABLES from '../../common/database/user0';
import * as SHARD1_TABLES from '../../common/database/user1';
import * as SHARD2_TABLES from '../../common/database/user2';
import * as SHARD3_TABLES from '../../common/database/user3';

const master_tableProviders = Object.values(MASTER_TABLES) as Provider[];

const shard0_tableProviders = Object.values(SHARD0_TABLES) as Provider[];
const shard1_tableProviders = Object.values(SHARD1_TABLES) as Provider[];
const shard2_tableProviders = Object.values(SHARD2_TABLES) as Provider[];
const shard3_tableProviders = Object.values(SHARD3_TABLES) as Provider[];

@Module({
    imports: [
        ...(process.env.ENABLE_DATABASE === 'true' ? [
            TypeOrmModule.forFeature(Object.values(MASTER_ENTITIES)),
            TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard0DB'),
            TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard1DB'),
            TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard2DB'),
            TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard3DB'),
        ] : []),
        RedisModule,
        MasterDatabaseModule,
        ShardDatabaseModule,
        GptModule,
        GeminiModule,
        ClaudeModule,
        HttpModule
    ],
    controllers: [
        AdminFrontEndController
    ],
    providers: [
        MasterDatabaseService,
        ShardDatabaseService,
        AdminFrontEndService,
        GoogleSheetService,
        SocketService,
        RedisService,
        CommonService,
        AiService,
        GeminiAiService,
        ClaudeAiService,
        ...(process.env.ENABLE_DATABASE === 'true' ? master_tableProviders : []),

        ...(process.env.ENABLE_DATABASE === 'true' ? shard0_tableProviders : []),
        ...(process.env.ENABLE_DATABASE === 'true' ? shard1_tableProviders : []),
        ...(process.env.ENABLE_DATABASE === 'true' ? shard2_tableProviders : []),
        ...(process.env.ENABLE_DATABASE === 'true' ? shard3_tableProviders : []),
    ],
})

export class AdminFrontEndModule {}