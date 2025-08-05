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
    ) {}

    @Get("supabaseTest")
    async supabaseTest(@Body() req: any) {
        return await this.supabaseService.getUsers();
    }

    @Get("getBookInfo")
    async getBookInfo(@Body() req: any) {
        let book_info = await this.supabaseService.getBookIsbn();
        let isbnList = await this.userService.makeIsbnList(book_info);
        let book_data = await this.aladinService.lookupMultipleISBNs(isbnList);

        console.log(book_data);
        return book_data;
    }

    @Get("updateBookInfoFromAladin")
    async updateBookInfoFromAladin(@Body() req: any) {
        // 1. 기존 데이터에서 isbn 목록 가져오기
        const bookInfo = await this.supabaseService.getBookIsbn();
        const isbnList = await this.userService.makeIsbnList(bookInfo);

        // 2. 알라딘에서 도서 정보 가져오기
        const bookDataList = await this.aladinService.lookupMultipleISBNs(isbnList);

        // 3. Supabase에 insert (중복 제거 or UPSERT는 선택)
        for (const book of bookDataList) {
            try {
                console.log(book);
                await this.supabaseService.insertBooks([book]);
                // Project ID 를 알 수 없어서 일단 주석처리
                // await this.supabaseEdgeService.insertViaEdgeFunction(book);
            } catch (err) {
                console.error(`Insert failed for ISBN: ${book.isbn13}`, err.message);
            }
        }

        return "";
    }

    @Get("example")
    async example(@Body() req: any, @Res() res: Response) {
        console.log(await this.masterDatabaseService.getQuestionComment({idx: 1}));
        return "test";
    }
}
