import { Controller, Get, Post, Query, Res, Body, Req } from '@nestjs/common';
import { GoogleSheetService } from './sheet/google-sheet.service';
import { GooglePlayService } from './playReview/google-play.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly googlePlayService: GooglePlayService,
  ) {}

  @Get('data2')
  async getData2(@Query('range') range: string, @Query('is_truncate') is_truncate: number) {
    return this.googleSheetService.getSheetData2(range, is_truncate);
  }

  @Get('getSheet')
  async getSheet() {
    this.googleSheetService.getSheetInfo();
  }

  @Get('getReview')
  async getReview() {
    const appId = 'com.pione.questiondiary';
    await this.googlePlayService.crawlAllReviewsStepByStep(appId, 300, 10); 
  }

  @Post('addGoogleSheetQuestion')
  async addGoogleSheetQuestion(@Body() req: any)  {
    const sheetName = req.sheetName;
    const prompt = req.prompt;

    await this.googleSheetService.getGptQuesionResponse(sheetName, prompt);
    
    return {
      code: 0,
      errmsg: '',
      data: {}
    };
  }

  @Post('addGoogleSheetQuestionMultiplexAi')
  async addGoogleSheetQuestionMultiplexAi(@Body() req: any)  {
    const question = req.question;

    let ret = await this.googleSheetService.getGptQuesionMultiplexAiResponse(question);
    
    console.log(ret);
    return {
      code: 0,
      errmsg: '',
      data: ret
    };
  }

  @Post('statementValue')
  async statementValue(@Body() req: any)  {
    const statement = req.statement;

    let ret = await this.googleSheetService.statementResponse(statement);
    
    console.log(ret);
    return {
      code: 0,
      errmsg: '',
      data: ret
    };
  }
}
