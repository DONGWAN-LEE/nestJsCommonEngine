import { Module, Provider } from '@nestjs/common';
import { SocketFrontEndController } from './socketFrontEnd.controller';
import { SocketFrontEndService } from './socketFrontEnd.service';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { CommonService } from '../../common/src/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    ],
    controllers: [
        SocketFrontEndController,
    ],
    providers: [
        CommonService,
        RedisService,
        SocketFrontEndService,
        MasterDatabaseService,
        ...(process.env.ENABLE_DATABASE === 'true' ? tableProviders : [])
    ]
})
export class SocketFrontEndModule {}
