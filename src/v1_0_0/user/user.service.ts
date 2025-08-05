import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { CommonService } from '../../common/src/common.service';

import { MasterDatabaseService } from '../../common/database/master_database.service';
import { ShardDatabaseService } from '../../common/database/shard_database.service';

import { AiService } from '../ai/gpt/gpt.service';
import { GeminiAiService } from '../ai/gemini/gemini.service';
import { ClaudeAiService } from '../ai/claude/claude.service';

import { } from './dto/userDto.dto';
import axios from 'axios';
import * as path from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class UserService {
    constructor(
        private readonly redisService: RedisService,
        private readonly commonService : CommonService,
        private readonly masterDatabaseService: MasterDatabaseService,
        private readonly ShardDatabaseService: ShardDatabaseService,
        private readonly aiService: AiService,
        private readonly GeminiAiService: GeminiAiService,
        private readonly ClaudeAiService: ClaudeAiService,
    ){}

    async makeIsbnList(book_info: any) {
        let isbnList = [];
        for (let i = 0; i < book_info.length; i++) {
            if (book_info[i].isbn) {
                isbnList.push(book_info[i].isbn);
            }
        }
        return isbnList;
    }

    async getDatabaseConnectTest(){
        let get_params = ['idx', 'startTime'];

        const master = await this.masterDatabaseService.get_test();
        const shard_0 = await this.ShardDatabaseService.get_test('user_test', 0);
        const shard_1 = await this.ShardDatabaseService.get_test('user_test', 1);
        const shard_2 = await this.ShardDatabaseService.get_test('user_test', 2);
        const shard_3 = await this.ShardDatabaseService.get_test('user_test', 3);

        return {
            master: master,
            shard_0: shard_0,
            shard_1: shard_1,
            shard_2: shard_2,
            shard_3: shard_3,
        }
    }
}