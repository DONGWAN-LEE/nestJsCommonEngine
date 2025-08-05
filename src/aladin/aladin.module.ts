// aladin.module.ts
import { Module } from '@nestjs/common';
import { AladinService } from './aladin.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AladinService],
  exports: [AladinService], // ✅ 반드시 export 해야 다른 모듈에서 사용 가능
})
export class AladinModule {}
