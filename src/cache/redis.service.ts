import { Injectable, Inject } from '@nestjs/common';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  
  async get(key: string): Promise<any> {
    let redis_data = await this.cache.get("pp:" + key);

    // 정상적인 Cache 확인
    let check_cache = [];

    if(redis_data == null){
      return null;
    }else{
      check_cache = redis_data.toString().split("|");

      if(check_cache[1] != process.env.CACHE_CHECK_STR){
        await this.del(key);
        return null;
      }
    }

    try{
      let ret_data = JSON.parse(check_cache[0]);

      if(typeof ret_data === 'object'){
        return ret_data;
      }else{
        return check_cache[0];
      }
    }catch(e){
      return check_cache[0];
    }
  }

  async set(key: string, value: any, expire_sec: number = 36000) {
    if(typeof(value) === 'object'){
      value = JSON.stringify(value);
    }

    if(typeof(value) != 'undefined' || value != "" || Object.keys(value).length > 0){
      let cache_data = value + "|" + process.env.CACHE_CHECK_STR;
      await this.cache.set("pp:" + key, cache_data, expire_sec);
    }
  }

  async del(key: string) {
    await this.cache.del("pp:" + key);
  }

  async patternDel(pattern: string): Promise<void> {
    const redisStore = this.cache.stores as any;
    const keys = await redisStore.keys("pp:" + pattern) // Find keys matching the pattern
    
    for(const key of keys){
      await this.cache.del(key);
    }
  }

  async delUserCache(Uidx: number, Uid: string, Usn: string, Deviceuuid: string) {
    let key = Array();

    key[0] = "user:user_data:" + Uidx + '_' + Uid;
    key[1] = "user:deviceCheck:" + Usn;
    key[2] = "last_stamina_charge:" + Uidx;
  }
}