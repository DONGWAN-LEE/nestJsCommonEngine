import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeminiAiService {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }
    
    async getGeminiQuestionResponse(systemPrompt: string, prompt: string, retries = 3, delay = 5000): Promise<string> {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        const apiUrl = this.configService.get<string>('GEMINI_API_URL');

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }], // 시스템 프롬프트 역할
            },
            {
              role: 'user',
              parts: [{ text: prompt }],
            }
          ],
          generationConfig: {
            temperature: 0.8,
          },
        };
      
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
            const res = await axios.post(
                `${apiUrl}?key=${apiKey}`,
                payload
            );
            return res.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '응답 없음';
            } catch (err) {
                const statusCode = err?.response?.status || 0;
                if (statusCode === 503 && attempt < retries - 1) {
                  console.warn(`⏳ Gemini 과부하 재시도 중 (${attempt + 1}/${retries})...`);
                  await new Promise(res => setTimeout(res, delay * (attempt + 1))); // 지수 백오프
                } else {
                  return "😵 질문 분석 과부하로 오류가 발생했습니다. (Error Code:" + statusCode + ")";
                }
            }
        }
    }
}
