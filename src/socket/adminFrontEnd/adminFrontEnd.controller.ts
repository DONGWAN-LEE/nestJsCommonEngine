import { Controller, Get, Render, Res, Req, Query} from '@nestjs/common';
import { Response, Request } from 'express';
import { AdminFrontEndService } from './adminFrontEnd.service';
import { GoogleSheetService } from 'src/v1_0_0/google/sheet/google-sheet.service';
import { ConfigService } from '@nestjs/config';

const requestIp = require('request-ip');
const qrCode = require('qrcode');

@Controller('admin')
export class AdminFrontEndController {
    constructor(
        private readonly adminFrontEndService: AdminFrontEndService,
        private readonly googleSheetService: GoogleSheetService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/')
    async index(@Req() req: Request, @Res() res: Response) {
        // return res.render('./admin/index');
    }
}
