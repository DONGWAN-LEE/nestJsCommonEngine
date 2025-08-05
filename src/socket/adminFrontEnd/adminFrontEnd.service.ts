import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SocketService } from '../socketBackEnd/socket.service';
import { CommonService } from '../../common/src/common.service';
import { RedisService } from '../../cache/redis.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminFrontEndService {
    private readonly TREENOD_API_URL = process.env.TREENOD_API_URL;
    private readonly TREENOD_API_KEY = process.env.TREENOD_API_KEY;

    constructor(
        private readonly socketService: SocketService,
        private readonly commonService: CommonService,
        private readonly redisService: RedisService,
        private readonly httpService: HttpService
    ){}

    async encrypt(str) {
        return await this.commonService.encrypt(str);
    }

    async decrypt(str) {
        return await this.commonService.decrypt('c628e48a44a5859b');
    }

    async deleteQuestionCache() {
        await this.redisService.patternDel('question_set:*');
    }

    async getShifteeData(apiKey: string): Promise<any> {
        try {
          const response$ = this.httpService.get(this.TREENOD_API_URL, {
            headers: {
              'X-API-Key': this.TREENOD_API_KEY,
            },
          });
    
          const response = await firstValueFrom(response$);
          console.log(response);
          return '';
        } catch (error) {
          throw new HttpException(
            `Shiftee API 요청 실패: ${error.message}`,
            HttpStatus.BAD_GATEWAY,
          );
        }
      }
}