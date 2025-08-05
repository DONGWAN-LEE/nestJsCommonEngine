

import { Controller, Post, Body } from '@nestjs/common';
import { ClaudeAiService } from './claude.service';

@Controller('AI/Gemini')
export class ClaudeController {
  constructor(private readonly aiService: ClaudeAiService) {}
}