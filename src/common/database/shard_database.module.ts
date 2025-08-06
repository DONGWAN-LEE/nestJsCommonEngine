// redis-cache.module.ts
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShardDatabaseService } from './shard_database.service'

import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import * as SHARD_ENTITIES from '../entities/shard';

import * as SHARD0_TABLES from './shard0';
import * as SHARD1_TABLES from './shard1';
import * as SHARD2_TABLES from './shard2';
import * as SHARD3_TABLES from './shard3';

const shard0_tableProviders = Object.values(SHARD0_TABLES) as Provider[];
const shard1_tableProviders = Object.values(SHARD1_TABLES) as Provider[];
const shard2_tableProviders = Object.values(SHARD2_TABLES) as Provider[];
const shard3_tableProviders = Object.values(SHARD3_TABLES) as Provider[];

@Module({
  imports: [
    ConfigModule,
    // user_info Table
    TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard0DB'),
    TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard1DB'),
    TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard2DB'),
    TypeOrmModule.forFeature(Object.values(SHARD_ENTITIES), 'shard3DB'),

    RedisModule
  ],
  providers: [
    ShardDatabaseService,
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
    ...shard0_tableProviders,
    ...shard1_tableProviders,
    ...shard2_tableProviders,
    ...shard3_tableProviders,
  ],
  exports: [
    RedisService,
    'ENABLE_DATABASE',
    ...shard0_tableProviders,
    ...shard1_tableProviders,
    ...shard2_tableProviders,
    ...shard3_tableProviders,
  ]
})

export class ShardDatabaseModule {
}