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