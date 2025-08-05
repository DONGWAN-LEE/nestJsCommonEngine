// redis-cache.module.ts
import { Module, Provider, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import * as ENTITIES from '../entities/master';
import * as TABLES from '../database/master';
const tableProviders = Object.values(TABLES) as Provider[];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature(Object.values(ENTITIES)),
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
    ...tableProviders
  ],
  exports: [
    RedisService,
    'ENABLE_DATABASE',
    ...tableProviders
  ]
})
export class MasterDatabaseModule {}

