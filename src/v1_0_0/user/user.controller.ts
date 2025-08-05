import {
    Get,
    Post,
    Body,
    Controller,
    Res,
} from '@nestjs/common';
import { Response } from "express";
import { UserService } from './user.service';
import { SocketService } from '../../socket/socketBackEnd/socket.service';
import { CommonService } from '../../common/src/common.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { SupabaseEdgeService } from '../../supabase/supabaseEdge.service';
import { AladinService } from '../../aladin/aladin.service';
import { MasterDatabaseService } from '../../common/database/master_database.service';
import { ShardDatabaseService } from '../../common/database/shard_database.service';
import {

} from './dto/userDto.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly socketService: SocketService,
        private readonly commonService: CommonService,
        private readonly supabaseService: SupabaseService,
        private readonly supabaseEdgeService: SupabaseEdgeService,
        private readonly aladinService: AladinService,
        private readonly masterDatabaseService: MasterDatabaseService,
        private readonly ShardDatabaseService: ShardDatabaseService,
    ) {}

    @Get("DatabaseConnectTest")
    async DatabaseConnectTest(@Body() req: any) {
        let connect = await this.userService.getDatabaseConnectTest();
        console.log(connect);

        return connect;
    }
}
