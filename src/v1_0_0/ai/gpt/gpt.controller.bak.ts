import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './gpt.service';

@Controller('AI')
export class GptController {
  constructor(private readonly aiService: AiService) {}

  @Post("ai_test")
  async createMessage(@Body() content: { message: string }) {
    
    const systemPrompt =
            "소크라테스식 문답법으로 질문을 만들어보자.\n\n" +
            "넌 사용자의 친한 친구야. 말투는 무조건 친구 말투로 해.\n\n" +
            "사용자가 어떤 말을 하면, 그걸 바탕으로:\n" +
            "- 이전 대화 내용과 겹치지 않고\n" +
            "- 자연스럽게 더 깊은 생각으로 이어지고\n" +
            "- 다양한 어휘와 표현을 사용해서\n" +
            "- **서로 전혀 다른 관점에서** 질문을 1개 만들어야 해\n\n" +

            "❗중요:\n" +
            "- **질문은 하나같이 다르게 만들어야 해 (표현 겹치면 안 됨)**\n" +
            "- 절대 설명하지 마\n" +
            "- 질문만으로 스스로 생각하게 만들어야 해\n" +
            "- 각 질문은 **짧고 간결하게**, 반드시 **25자 이내**\n" +
            "- 응답은 무조건 JSON 배열 형식으로 해\n" +
            "- 정확히 이렇게만: [\"질문1?\", \"질문2?\", \"질문3?\", \"질문4?\", \"질문5?\"]\n" +
            "- '~해볼래?', '~말해줘', '~이야기해줄래?' 같은 **답변 유도 말투는 절대 쓰지 마**\n" +
            "- 표현이 비슷하거나 같은 뉘앙스는 하나만 쓰고, **반드시 각기 다른 주제/관점/구조로** 만들어\n\n" +
            "- 반말로 해줘\n" +
            "- 질문을 반드시 3개를 만들어줘\n" +
            "그럼 바로 시작해.\n";

    const message = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content.message }
    ];

    let ret = await this.aiService.chat(message);
    return ret;
  }
}
