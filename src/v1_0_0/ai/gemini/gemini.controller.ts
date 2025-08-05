

import { Controller, Post, Body } from '@nestjs/common';
import { GeminiAiService } from './gemini.service';

@Controller('AI/Gemini')
export class GeminiController {
  constructor(private readonly aiService: GeminiAiService) {}
}