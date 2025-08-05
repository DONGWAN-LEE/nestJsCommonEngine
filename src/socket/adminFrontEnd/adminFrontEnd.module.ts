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

import { GoogleSheetService } from 'src/v1_0_0/google/sheet/google-sheet.service';
import { HttpModule } from '@nestjs/axios';

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
        HttpModule
    ],
    controllers: [
        AdminFrontEndController
    ],
    providers: [
        MasterDatabaseService,
        AdminFrontEndService,
        GoogleSheetService,
        SocketService,
        RedisService,
        CommonService,
        AiService,
        GeminiAiService,
        ClaudeAiService,
        ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
    ],
})

export class AdminFrontEndModule {}