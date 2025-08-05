import { Injectable, Optional, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../cache/redis.service';

import { 
    test_table,
} from './master';

@Injectable()
export class MasterDatabaseService {
    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,

        @Optional() private readonly test_table?: test_table,
    ) {}

    async getDistinctTreenodMembers(field: string) {
        const enableDatabase = this.configService.get('ENABLE_DATABASE') === 'true';
        console.log('getDistinctTreenodMembers - ENABLE_DATABASE:', enableDatabase);
        
        if (!enableDatabase) {
            console.warn('Database is disabled or table not available');
            return [];
        }
        
        if (!this.test_table) {
            console.warn('Table not available');
            return [];
        }
        
        return await this.test_table.getDistinctCities(field);
    }

    async get_test(): Promise<any> {
        return await this.test_table.get_lists();
    }
}