import { Logger, Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware { //implements -> 반드시 구현하도록 강제하는거임
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
      const { ip, method, originalUrl, body, headers } = request;
      // 정상적으로 접근 하는지 헤더 체크
      if(headers['pp-authentication'] != 'PPServer'){
        throw new HttpException(
          {
              status : 404,
              message : 'Not Found!',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      response.on('finish', () => {
        const { statusCode } = response;

        this.logger.log(`${method} ${originalUrl} ${statusCode} ${ip} - params: `);
      });
      
		  next();
    }
}