import { 
  ValidationPipe, 
  VersioningType, 
} from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './socket/adapters/socket-io.adapters';
import { join } from 'path';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/dataReturn/ExceptionFilter';
import { LoggingInterceptor } from './common/dataReturn/Common.Response';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as compression from 'compression';
import * as cookieParser from "cookie-parser";
import * as fs from 'fs';


// ------------------- STEP 2
dotenv.config({
  path: path.resolve(
    process.env.SERVER_NAME === 'LOCAL'
      ? '.env.local'
      : process.env.SERVER_NAME === 'DEV'
        ? '.env.dev'
        :process.env.SERVER_NAME === 'LIVE'
        ? '.env.live'
        : '.env.local',
  ),
});

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./config/192.168.8.38-key.pem'),
  //   cert: fs.readFileSync('./config/192.168.8.38.pem'),
  // };  
  
  // const app = await NestFactory.create<NestExpressApplication>(
  //   AppModule,
  //   {
  //     httpsOptions,
  //   },
  // );
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  //예외 필터 연결
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: DTO에 없은 속성은 무조건 거른다.
       * forbidNonWhitelisted: 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생합니다.
       * transform: 네트워크를 통해 들어오는 데이터는 일반 JavaScript 객체입니다.
       *            객체를 자동으로 DTO로 변환을 원하면 transform 값을 true로 설정한다.
       * disableErrorMessages: Error가 발생 했을 때 Error Message를 표시 여부 설정(true: 표시하지 않음, false: 표시함)
       *                       배포 환경에서는 true로 설정하는 걸 추천합니다.
       */
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      stopAtFirstError: true,
      enableDebugMessages: true
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(compression({
    level: 6,
    filter: () => { return true },
    threshold: 0
  }));

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  app.enableCors({
    // cors 설정
    origin: "*",
    // credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });

  app.use(cookieParser()); // 쿠키의 편리한 이용을 위해 cookieParser 적용
  
  const port = 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
