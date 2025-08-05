import { Controller, Get, Render, Res, Req} from '@nestjs/common';
import { Response } from 'express';
import { SocketFrontEndService } from './socketFrontEnd.service';

@Controller()
export class SocketFrontEndController {
    constructor(
        private readonly socketFrontEndService: SocketFrontEndService,
    ) {}

    @Get('/')
    async index(@Res() res: Response) {
        res.status(200).json({ success: true, message: "success" });
    }
}
