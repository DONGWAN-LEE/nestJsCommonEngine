import { Module, NestModule, MiddlewareConsumer, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 미들웨어
import { TypeOrmModule  } from '@nestjs/typeorm';

// API Module
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { SocketBackEndModule } from './socket/socketBackEnd/socketBackEnd.module';
import { SocketFrontEndModule } from './socket/socketFrontEnd/socketFrontEnd.module';
import { AdminFrontEndModule } from './socket/adminFrontEnd/adminFrontEnd.module';
import { UserModule } from './common/versioning/user.module';
import { GameModule } from './common/versioning/game.module';
import { GptModule } from './common/versioning/gpt.module';
import { GeminiModule } from './common/versioning/gemini.module';
import { ClaudeModule } from './common/versioning/claude.module';
import { GoogleModule } from './common/versioning/google.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AladinModule } from './aladin/aladin.module';
// import { AdminFrontEndModule } from './socket/adminFrontEnd/adminFrontEnd.module';

@Module({
  imports: [
    SocketBackEndModule, 
    SocketFrontEndModule, 
    AdminFrontEndModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const enableDatabase = configService.get('ENABLE_DATABASE') === 'true';
        console.log('AppModule - ENABLE_DATABASE:', enableDatabase);
        
        if (!enableDatabase) {
          console.log('Database disabled - Using SQLite in-memory');
          // SQLite in-memory 사용 (entities 없음)
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [], // 빈 배열로 설정하여 entity 로드 방지
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          };
        }

        console.log('Database enabled - Using MySQL');
        return {
          type: 'mysql',
          host: configService.get('MASTER_DATABASE_HOST'),
          port: Number(configService.get('MASTER_DATABASE_PORT')),
          database: configService.get('MASTER_DATABASE_NAME'),
          username: configService.get('MASTER_DATABASE_USERNAME'),
          password: configService.get('MASTER_DATABASE_PASSWORD'),
          logging: Boolean(configService.get('TYPEORM_LOGGING')),
          synchronize: false,
          entities: ['dist/**/entities/master/*.entity.{ts,js}'],
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          }
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'shard0DB',
      useFactory: async (configService: ConfigService) => {
        const enableDatabase = configService.get('ENABLE_DATABASE') === 'true';
        const enableShardDatabase = configService.get('ENABLE_SHARD_DATABASE') === 'true';
        console.log('AppModule - ENABLE_SHARD_DATABASE:', enableShardDatabase);
        
        if (!enableDatabase || !enableShardDatabase) {
          console.log('Shard0 Database disabled - Using SQLite in-memory');
          // SQLite in-memory 사용 (entities 없음)
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [], // 빈 배열로 설정하여 entity 로드 방지
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          };
        }

        console.log('Shard0 Database enabled - Using MySQL');
        return {
          type: 'mysql',
          host: configService.get('SHARD0_DATABASE_HOST'),
          port: Number(configService.get('SHARD0_DATABASE_PORT')),
          database: configService.get('SHARD0_DATABASE_NAME'),
          username: configService.get('SHARD0_DATABASE_USERNAME'),
          password: configService.get('SHARD0_DATABASE_PASSWORD'),
          logging: Boolean(configService.get('TYPEORM_LOGGING')),
          synchronize: false,
          entities: ['dist/**/entities/shard/*.entity.{ts,js}'],
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          }
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'shard1DB',
      useFactory: async (configService: ConfigService) => {
        const enableDatabase = configService.get('ENABLE_DATABASE') === 'true';
        const enableShardDatabase = configService.get('ENABLE_SHARD_DATABASE') === 'true';
        console.log('AppModule - ENABLE_SHARD_DATABASE:', enableShardDatabase);
        
        if (!enableDatabase || !enableShardDatabase) {
          console.log('Shard1 Database disabled - Using SQLite in-memory');
          // SQLite in-memory 사용 (entities 없음)
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [], // 빈 배열로 설정하여 entity 로드 방지
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          };
        }

        console.log('Shard1 Database enabled - Using MySQL');
        return {
          type: 'mysql',
          host: configService.get('SHARD1_DATABASE_HOST'),
          port: Number(configService.get('SHARD1_DATABASE_PORT')),
          database: configService.get('SHARD1_DATABASE_NAME'),
          username: configService.get('SHARD1_DATABASE_USERNAME'),
          password: configService.get('SHARD1_DATABASE_PASSWORD'),
          logging: Boolean(configService.get('TYPEORM_LOGGING')),
          synchronize: false,
          entities: ['dist/**/entities/shard/*.entity.{ts,js}'],
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          }
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'shard2DB',
      useFactory: async (configService: ConfigService) => {
        const enableDatabase = configService.get('ENABLE_DATABASE') === 'true';
        const enableShardDatabase = configService.get('ENABLE_SHARD_DATABASE') === 'true';
        console.log('AppModule - ENABLE_SHARD_DATABASE:', enableShardDatabase);
        
        if (!enableDatabase || !enableShardDatabase) {
          console.log('Shard2 Database disabled - Using SQLite in-memory');
          // SQLite in-memory 사용 (entities 없음)
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [], // 빈 배열로 설정하여 entity 로드 방지
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          };
        }

        console.log('Shard2 Database enabled - Using MySQL');
        return {
          type: 'mysql',
          host: configService.get('SHARD2_DATABASE_HOST'),
          port: Number(configService.get('SHARD2_DATABASE_PORT')),
          database: configService.get('SHARD2_DATABASE_NAME'),
          username: configService.get('SHARD2_DATABASE_USERNAME'),
          password: configService.get('SHARD2_DATABASE_PASSWORD'),
          logging: Boolean(configService.get('TYPEORM_LOGGING')),
          synchronize: false,
          entities: ['dist/**/entities/shard/*.entity.{ts,js}'],
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          }
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'shard3DB',
      useFactory: async (configService: ConfigService) => {
        const enableDatabase = configService.get('ENABLE_DATABASE') === 'true';
        const enableShardDatabase = configService.get('ENABLE_SHARD_DATABASE') === 'true';
        console.log('AppModule - ENABLE_SHARD_DATABASE:', enableShardDatabase);
        
        if (!enableDatabase || !enableShardDatabase) {
          console.log('Shard3 Database disabled - Using SQLite in-memory');
          // SQLite in-memory 사용 (entities 없음)
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [], // 빈 배열로 설정하여 entity 로드 방지
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          };
        }

        console.log('Shard3 Database enabled - Using MySQL');
        return {
          type: 'mysql',
          host: configService.get('SHARD3_DATABASE_HOST'),
          port: Number(configService.get('SHARD3_DATABASE_PORT')),
          database: configService.get('SHARD3_DATABASE_NAME'),
          username: configService.get('SHARD3_DATABASE_USERNAME'),
          password: configService.get('SHARD3_DATABASE_PASSWORD'),
          logging: Boolean(configService.get('TYPEORM_LOGGING')),
          synchronize: false,
          entities: ['dist/**/entities/shard/*.entity.{ts,js}'],
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          }
        };
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
    UserModule, 
    GameModule,
    GptModule,
    GoogleModule,
    GeminiModule,
    ClaudeModule,
    SupabaseModule,
    AladinModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}