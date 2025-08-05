import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { InitDto } from './dto/game.dto';

@Injectable()
export class GameService {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    async init(initDto: InitDto) {
        
    }
}
