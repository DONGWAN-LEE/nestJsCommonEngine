import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { MasterDatabaseService } from '../../../common/database/master_database.service';
import { ShardDatabaseService } from '../../../common/database/shard_database.service';

import { AiService } from '../../ai/gpt/gpt.service';
import { GeminiAiService } from '../../ai/gemini/gemini.service';
import { ClaudeAiService } from '../../ai/claude/claude.service';
import { CommonService } from '../../../common/src/common.service';
import { RedisService } from '../../../cache/redis.service';
import { readFile } from 'fs/promises';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class GoogleSheetService {
  private readonly sheets = google.sheets('v4');
  private readonly auth;
  private readonly auth2;
  private readonly sheetId = process.env.GOOGLE_SHEET_ID;
  private readonly databaseSheetId = process.env.GOOGLE_DATABASE_SHEET_ID;
  private isInitialized = false;

  constructor(
    private readonly redisService: RedisService,
    private readonly masterDatabaseService: MasterDatabaseService,
    private readonly ShardDatabaseService: ShardDatabaseService,
    private readonly aiService: AiService,
    private readonly GeminiAiService: GeminiAiService,
    private readonly ClaudeAiService: ClaudeAiService,
    private readonly commonService : CommonService,
    
  ) {
    // 인증 설정
    this.auth = new google.auth.GoogleAuth({
      keyFile: 'keys/service-account.json', // 서비스 계정 키 파일 경로
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.auth2 = new google.auth.GoogleAuth({
      keyFile: 'keys/service-account.json', // 서비스 계정 키 파일 경로
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }
}
