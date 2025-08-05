// redis-cache.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

let redis_setting = CacheModule.registerAsync({
  useFactory: () => ({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      ttl: 60*60*10,
    }),
  });
  
  if(process.env.SERVER_NAME == "LIVE"){
    redis_setting = CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        ttl: 60*60*10,
        tls: {
          rejectUnauthorized: false // Use appropriate settings for your security requirements
        },
      }),
    });
  }

// if(process.env.SERVER_NAME == "LIVE"){
//   redis_setting = CacheModule.registerAsync({
//     useFactory: () => (
//         {
//         store: redisStore,
//         clusterConfig: {
//           nodes: [
//             {
//               host:process.env.REDIS_HOST,
//               port:+process.env.REDIS_PORT,
//             }
//           ]},
//         ttl: 60*60*10,
//       }),
//   });
// }else if(process.env.SERVER_NAME == "LIVE"){
//   redis_setting = CacheModule.registerAsync({
//     useFactory: () => (
//         {
//         store: redisStore,
//         clusterConfig: {
//           nodes: [
//             {
//               host:process.env.REDIS_HOST,
//               port:+process.env.REDIS_PORT,
//             }, 
//           ],
//         options: {
//           redisOptions: {
//             tls: {
//               rejectUnauthorized: false,
//             },
//             password:process.env.REDIS_PASSWD,
//           },
//         },
//       },
//       ttl: 60*60*10,
//     }),
//   });
// }

const cacheModule = redis_setting;

@Module({
  imports: [cacheModule],
  exports: [cacheModule],
})

export class RedisModule {}