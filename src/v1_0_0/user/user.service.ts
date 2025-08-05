import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { CommonService } from '../../common/src/common.service';
// import { MasterDatabaseService } from '../../common/database/master_database.service';
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
        // private readonly masterDatabaseService: MasterDatabaseService,
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
}