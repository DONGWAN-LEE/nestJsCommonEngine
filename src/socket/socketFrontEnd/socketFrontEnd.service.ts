import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommonService } from '../../common/src/common.service';
import { MasterDatabaseService } from 'src/common/database/master_database.service';
import { ShardDatabaseService } from 'src/common/database/shard_database.service';
// import { keyword } from 'src/common/entities//index';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class SocketFrontEndService {
    constructor(
        private readonly commonService: CommonService,
        private readonly masterDatabaseService: MasterDatabaseService,
        private readonly ShardDatabaseService: ShardDatabaseService,
        private readonly redisService: RedisService,
    ){}
}
