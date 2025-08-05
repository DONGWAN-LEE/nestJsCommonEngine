

import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './gpt.service';

@Controller('AI')
export class GptController {
  constructor(private readonly aiService: AiService) {}

  @Post("questionSummary")
  async questionSummary(@Body() content: { message: string }) {
    const systemPrompt = await this.aiService.systemPromptQuestionSummary();

    const message = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content.message }
    ];

    let ret = await this.aiService.chat(message);
    return ret;
  }

  @Post("replyMessageStatus")
  async replyMessageStatus(@Body() content: { message: string }) {
    const systemPrompt =  await this.aiService.systemPromptReplyMessageStatus();

    const message = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content.message }
    ];

    let ret = await this.aiService.chat(message);
    return ret;
  }

  @Post("qbpDetailReturn")
  async qbpDetailReturn(@Body() content: { message: string }) {
    const systemPrompt =  await this.aiService.qbpDetailReturn();

    const message = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content.message }
    ];

    let ret = await this.aiService.chat(message);
    console.log(ret)
    let test = JSON.parse(ret);
    console.log(test)
    return ret;
  }

  @Post("getQuestionType")
  async getQuestionType(@Body() req: any) {
    let ret = await this.aiService.personality_type_return(req.question);

    return ret;
  }
}