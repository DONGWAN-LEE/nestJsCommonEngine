import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { MasterDatabaseService } from '../../../common/database/master_database.service';
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

  private async initializeSheet() {
    const client = await this.auth2.getClient();
    if (this.isInitialized) return; // 이미 초기화되었으면 생략

    const spreadsheetId = this.databaseSheetId;
    const sheetName = 'GPT성향별 질문들';

    // 시트 초기화
    await this.sheets.spreadsheets.values.clear({
      auth: client,
      spreadsheetId,
      range: sheetName,
    });

    // 헤더 작성
    const headers = ['E', 'I', 'F', 'T', 'P', 'J', 'O', 'C', 'level', 'Question'];
    await this.sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });

    this.isInitialized = true;
  }

  async appendRows(data: Record<string, number | string>[]) {
    const client = await this.auth2.getClient();
    await this.initializeSheet();

    const spreadsheetId = this.databaseSheetId;
    const sheetName = 'GPT성향별 질문들';

    const keys = ['E', 'I', 'F', 'T', 'P', 'J', 'O', 'C', 'level', 'question'];

    const values = data.map((row) =>
      keys.map((key) => row[key] ?? '')
    );

    const response = await this.sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    return response.data;
  }

  async getSheetInfo() {
    const client = await this.auth.getClient();

    try {
      const response = await this.sheets.spreadsheets.get({ 
        auth: client,
        spreadsheetId: this.sheetId, 
      });

      const sheetInfo = response.data.sheets.map(sheet => ({
        title: sheet.properties.title,
        sheetId: sheet.properties.sheetId
      }));

      return sheetInfo;
      
    } catch (error) {
      console.error('스프레드시트 정보를 가져오는 중 오류 발생:', error);
    }
  }

  async getGptQuesionResponse(sheetName: string, prompt: string) {
    let ret1;
    let ret2;

    let arr1 = [];
    let arr2 = [];

    arr1.push([prompt,"",""])
    arr2.push([prompt,"",""])
    
    ret1 = await this.getGoogleSheetData("긍정적 질문 예시!A2:B263");
    for(const item1 of ret1){
      item1[2] = await this.aiService.getGptQuestionResponse(prompt, item1[1]);
      arr1.push(item1);
    }
    await this.addSheetAndInsertData(sheetName+"_긍정적질문", arr1);

    ret2 = await this.getGoogleSheetData("잘못된 질문 예시!A2:B239");
    for(const item2 of ret2){
      item2[2] = await this.aiService.getGptQuestionResponse(prompt, item2[1]);
      arr2.push(item2);
    }
    await this.addSheetAndInsertData(sheetName+"_잘못된질문", arr2);
  }

  async getGptQuesionMultiplexAiResponse(question: string) {
    const systemPrompt = await this.loadPrompt();

    // console.log(systemPrompt);

    console.log(question);

    let gpt_response = await this.aiService.getGptQuestionResponse(systemPrompt, question);
    let gpt = await this.commonService.cleanJsonBlock(await this.commonService.cleanJsonBlock2(gpt_response));

    let gemini_response = await this.GeminiAiService.getGeminiQuestionResponse(systemPrompt, question);
    let gemini = await this.commonService.cleanJsonBlock(await this.commonService.cleanJsonBlock2(gemini_response));

    let claude_response = await this.ClaudeAiService.getClaudeQuestionResponse(systemPrompt, question);
    let claude = await this.commonService.cleanJsonBlock(await this.commonService.cleanJsonBlock2(claude_response));
    
    let sheetName = "MultiAI_" + await this.commonService.getTodayYYYYMMDD();
    const formattedData = await this.formatAiDataForSheet(question, {GPT: gpt, GEMINI: gemini, CLAUDE: claude}); // 위 함수 사용

    await this.addOrAppendSheetData(sheetName, formattedData);
    
    return {GPT: gpt, CLAUDE: claude, GEMINI: gemini};
  }

  async statementResponse(statement: string) {
    const systemPrompt = 
      '입력한 문장이 질문 형태라면 그대로 출력해줘.' +
      '' +
      '하지만 질문이 아닌 **서술문이라면**,  ' +
      '**문장의 의미를 유지한 채로 자연스럽고 의미 있는 질문형 문장으로 바꿔서** 출력해줘.  ' +
      '단순히 끝에 물음표를 붙이는 것이 아니라, **문장을 질문 형태로 자연스럽게 재구성**해야 해.  ' +
      '문장에 대한 질문을 만드는 것이 아니라, **그 문장 자체를 의미 있는 질문처럼 바꾸는 것**이 핵심이야.' +
      '' +
      '출력 형식:' +
      '  ""맞춤질문"": ""자연스럽게 변환된 질문형 문장""';

    let gpt_response = await this.aiService.getGptQuestionResponse(systemPrompt, statement);
    let gemini_response = await this.GeminiAiService.getGeminiQuestionResponse(systemPrompt, statement);
    let claude_response = await this.ClaudeAiService.getClaudeQuestionResponse(systemPrompt, statement);
    

    // let sheetName = "MultiAI_" + await this.commonService.getTodayYYYYMMDD();
    // const formattedData = await this.formatAiDataForSheet(statement, {GPT: gpt, GEMINI: gemini, CLAUDE: claude}); // 위 함수 사용

    // await this.addOrAppendSheetData(sheetName, formattedData);
    
    return {GPT: gpt_response, CLAUDE: gemini_response, GEMINI: claude_response};
  }

  async getGoogleSheetData(range: string): Promise<any[]> {
    const client = await this.auth.getClient();
    const response = await this.sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: this.sheetId,
      range: range, // 예: 'Sheet1!A1:D10'
    });

    return response.data.values;
  }

  async addSheetAndInsertData(sheetName: string, data: any[][]): Promise<void> {
    const client = await this.auth2.getClient();
    const spreadsheetId = this.databaseSheetId;

    // 1. 현재 시트들 목록 조회
    const spreadsheet = await this.sheets.spreadsheets.get({
      auth: client,
      spreadsheetId: spreadsheetId,
    });

    const existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === sheetName
    );

    // 2. 기존 시트가 있다면 삭제
    if (existingSheet) {
      await this.sheets.spreadsheets.batchUpdate({
        auth: client,
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteSheet: {
                sheetId: existingSheet.properties.sheetId,
              },
            },
          ],
        },
      });
    }

    // 1. 새 시트 생성
    await this.sheets.spreadsheets.batchUpdate({
      auth: client,
      spreadsheetId: spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    // 2. 데이터 입력
    await this.sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: data,
      },
    });
  }

  async loadPrompt() {
    try {
      let filePath = path.resolve(__dirname, '../../../../src/v1_0_0/ai/systemPrompt/multiPlexAiSystemPrompt.txt');

      const prompt = await readFile(filePath, 'utf-8');
      return prompt;
    } catch (err) {
      console.error('프롬프트 로딩 실패:', err);
      return '';
    }
  }

  async formatAiDataForSheet(
    question: string,
    rawData: Record<string, string>
  ): Promise<any[][]> {
    const header = ['질문', '모델', '감정', '주제', '성향', '맞춤질문', '질문Level'];
    const result: any[][] = [header];
  
    for (const modelName of ['GPT', 'CLAUDE', 'GEMINI']) {
      const raw = rawData[modelName];
      if (!raw) continue;
  
      try {
        const parsed = JSON.parse(raw);
        result.push([
          question,
          modelName,
          parsed.감정,
          parsed.주제,
          parsed.성향,
          parsed['맞춤질문'],
          parsed['질문Level'],
        ]);
      } catch (err) {
        console.warn(`${modelName} JSON 파싱 실패`, err);
      }
    }
  
    return result;
  }
  

  async addOrAppendSheetData(sheetName: string, data: any[][]): Promise<void> {
    const client = await this.auth2.getClient();
    const spreadsheetId = this.databaseSheetId;
  
    // 시트 정보 가져오기
    const spreadsheet = await this.sheets.spreadsheets.get({
      auth: client,
      spreadsheetId,
    });
  
    const existingSheet = spreadsheet.data.sheets.find(
      (sheet) => sheet.properties.title === sheetName
    );
  
    // ✅ 시트가 없다면 생성
    if (!existingSheet) {
      await this.sheets.spreadsheets.batchUpdate({
        auth: client,
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    }

    // ✅ 데이터 추가 (append)
    await this.sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data,
      },
    });
  }

  
  async getSheetData2(range: string, is_truncate: number): Promise<any[]> {
    const client = await this.auth2.getClient();
    const response = await this.sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: this.databaseSheetId,
      range: range, // 예: 'Sheet1!A1:D10'
    });

    let google_sheet_data = range.split('!');
    let ret;

    if(google_sheet_data[0] == '라이언_질문' ||
      google_sheet_data[0] == '니야_질문' ||
      google_sheet_data[0] == '스캇_질문' ||
      google_sheet_data[0] == '리암_질문'
    ){
      if(is_truncate == 1){
        await this.masterDatabaseService.truncateTreetiveQuestion();
      }
      await this.add_treetive_question(response.data.values);
    }

    return ret;
  }

  async add_treetive_question(google_sheet_data: any[]) {
    let keyword_data;
    let ret_data;
    let arr = [];

    for(const item of google_sheet_data){
      let hashTag = await this.aiService.getHashTag(item[1]);
      let hashTagParser = JSON.parse(hashTag);
      let add_params = 
      {
        treetive_idx:0, 
        question: item[0], 
        content: item[1],
        hashTag1: hashTagParser[0],
        hashTag2: hashTagParser[1],
        hashTag3: hashTagParser[2]
      };

      let ret = await this.masterDatabaseService.addTreetiveQuestion(add_params);

      for(let i=3; i<7; i++){
        if(item[i] != undefined && item[i] != null && item[i] != ''){
          let add_comment = {question_idx: ret.idx, comment_text: item[i]};
          await this.masterDatabaseService.addQuestionComment(add_comment);
        }
      }
    }

    return keyword_data;
  }
}
