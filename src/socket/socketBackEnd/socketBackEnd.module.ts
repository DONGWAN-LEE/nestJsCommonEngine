import { Module } from '@nestjs/common';
import { SocketBackEndGateway } from './socketBackEnd.gateway';
import { SocketService } from './socket.service';

import { RedisModule } from '../../cache/redis.module';
import { RedisService } from '../../cache/redis.service';

import { CommonService } from '../../common/src/common.service';

@Module({
    imports: [
      RedisModule
    ],
    providers: [
        SocketBackEndGateway, 
        SocketService,
        CommonService,
        RedisService,
    ],
})
export class SocketBackEndModule {}
