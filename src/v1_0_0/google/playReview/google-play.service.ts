import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from '../../../common/database/master_database.service';
import { ShardDatabaseService } from '../../../common/database/shard_database.service';

import * as puppeteer from 'puppeteer';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as emojiStrip from 'emoji-strip';

@Injectable()
export class GooglePlayService {
  constructor(
    private readonly masterDatabaseService: MasterDatabaseService,
    private readonly ShardDatabaseService: ShardDatabaseService,
  ) {
  }
}
