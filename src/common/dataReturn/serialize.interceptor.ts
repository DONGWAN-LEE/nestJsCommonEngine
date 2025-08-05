import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
  } from '@nestjs/common'
  import { Observable } from 'rxjs'
  import { map } from 'rxjs/operators'
  import { plainToInstance } from 'class-transformer'
  
  export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
  }
  
  export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any ) {}
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      // response가 전송되기 전에 실행할 코드를 작성한다.
      return handler.handle().pipe(
        // data는 response data가 들어온다.
        map((data: any) => {
          return plainToInstance(this.dto, data,{
            // 불필요한 값 (response로 내보내지 않을 값)을 제거하는 excludeExtraneousValues
            excludeExtraneousValues: true
          })
        })
      )
    }
  }