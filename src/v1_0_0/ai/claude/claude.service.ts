import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClaudeAiService {
  constructor(private configService: ConfigService) {}

  async getClaudeQuestionResponse(systemPrompt: string = '', prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('CLAUDE_API_KEY');
    const apiUrl = this.configService.get<string>('CLAUDE_API_URL');

    const headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    };

    const body = {
      model: 'claude-opus-4-20250514', // 최신 모델: claude-3-haiku, sonnet, opus 등 가능
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt, // 시스템 프롬프트 추가
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    try {
      const res = await axios.post(apiUrl, body, { headers });
      return res.data?.content?.[0]?.text ?? '응답 없음';
    } catch (err) {
      console.error('Claude API error:', err?.response?.data || err.message);
      throw new Error('Claude 호출 실패');
    }
  }
}
