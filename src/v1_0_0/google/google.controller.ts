import { Controller, Get, Post, Query, Res, Body, Req } from '@nestjs/common';
import { GoogleSheetService } from './sheet/google-sheet.service';
import { GooglePlayService } from './playReview/google-play.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly googlePlayService: GooglePlayService,
  ) {}
}
