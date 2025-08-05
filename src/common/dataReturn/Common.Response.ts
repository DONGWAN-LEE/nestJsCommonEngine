
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map, tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      // const now = Date.now(); //현재 시간을 얻기 위해 사용됨
      // console.log(`Before... ${Date.now() - now}ms`);
  
      return next.handle().pipe(
        // tap(() => console.log(`After... ${Date.now() - now}ms`)), // 로깅 처리
        map((responseData) => this.success(responseData)), // 클라이언트에게 반환 되는 정보(각 컨트롤러 결과 값)
        //catchError((err) => throwError(() => new BadGatewayException())), // 예외 발생시 처리
      );
    }
  
    async success(result?: any) : Promise<any> {
      const date = new Date();
  
      let response_json = {};
  
      response_json['statusCode'] = 200;
      response_json['errmsg'] = "";
      response_json['maintenance'] = "";
      response_json['maintenanceMsg'] = "";
  
      response_json['getTime'] = date.getTime();
  
      /*
      if(isArray(result)){
        response_json['data'] = {};
        response_json['data']['info'] = result;
      }else{
        response_json['data'] = result;
      }
      */
     
      response_json['data'] = {};
      response_json['data']['info'] = result;

      let encryptedText = response_json;
      /*
      if(process.env.NODE_ENV != 'dev'){
        const iv = randomBytes(16);
        const password = process.env.CRYPTO_PASSWD;
  
        const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv);
  
        encryptedText = Buffer.concat([
          cipher.update(JSON.stringify(response_json)),
          cipher.final(),
        ]);
      }
      */
      
      return encryptedText;
    }
  }
  
  