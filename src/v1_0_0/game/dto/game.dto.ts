import { IsNotEmpty, IsNumber, IsString, } from 'class-validator';
import { Expose } from "class-transformer";

export class InitDto {
    @IsString()
    @IsNotEmpty()
    type: string; // 유저 이름

    @IsNumber()
    @IsNotEmpty()
    os: number; // 유저 고유 아이디

    @IsString()
    @IsNotEmpty()
    ver: string; // 유저 고유 아이디
}

export class retInitDto {
    @Expose()
    Id: number;

    @Expose()
    server_name: string;

    @Expose()
    game_type: string;

    @Expose()
    os: number;

    @Expose()
    game_ver: string;

    @Expose()
    game_url: string;

    @Expose()
    cdn_url: string;
}

export class retCacheTime {
    @Expose()
    cache_time: number;
}