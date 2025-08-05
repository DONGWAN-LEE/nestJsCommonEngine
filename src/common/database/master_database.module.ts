// redis-cache.module.ts
import { Module, Provider, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import * as MASTER_ENTITIES from '../entities/master';
import * as MASTER_TABLES from '../database/master';
const master_tableProviders = Object.values(MASTER_TABLES) as Provider[];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature(Object.values(MASTER_ENTITIES)),
    RedisModule
  ],
  providers: [
    RedisService,
    {
      provide: 'ENABLE_DATABASE',
      useFactory: (configService: ConfigService) => {
        const value = configService.get('ENABLE_DATABASE') === 'true';
        console.log('MasterDatabaseModule - ENABLE_DATABASE:', value);
        return value;
      },
      inject: [ConfigService],
    },
    ...master_tableProviders
  ],
  exports: [
    RedisService,
    'ENABLE_DATABASE',
    ...master_tableProviders
  ]
})
export class MasterDatabaseModule {}

