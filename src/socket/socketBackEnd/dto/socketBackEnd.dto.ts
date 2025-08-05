import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class setInitDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    deviceId: string;
}

export class chatRoomListDTO {
    roomId: string;
    cheifId: string;
    roomName: string;
}

export class getLoginProcessDTO {
    @IsString()
    @IsNotEmpty()
    uid: string; // User ID
  
    @IsString()
    @IsNotEmpty()
    upw: string; // USN
  
    @IsString()
    @IsNotEmpty()
    uuid: string; // 디바이스 UUID
}

export class setNicknameDTO {
    @IsNotEmpty()
    @IsString()
    uuid: string;

    @IsNumber()
    uidx: string;

    @IsString()
    uid: string;

    @IsNotEmpty()
    @IsString()
    uNickname: string;
}

export class retNicknameDTO {
    uidx: number;
    uid: string;
    isRevisit: number;
    game_idx: number;
    nickname: string;
}

export class getQrNicknameDTO {
    @IsNumber()
    uidx: string;

    @IsString()
    uid: string;
}

export class retGetQrNicknameDTO {
    uidx: number;
    uid: string;
    nickname: string;
}

export class setMakeStepDTO {
    @IsNumber()
    uidx: number;

    @IsString()
    uid: string;

    @IsNumber()
    game_idx: number;

    @IsNumber()
    step: number;

    @IsString()
    json_data: string;
}

export class setAutoMakeStepDTO {
    @IsString()
    deviceId: string;

    @IsNumber()
    uidx: number;

    @IsNumber()
    game_idx: number;

    @IsNumber()
    step: number;
}

export class retMakeStepDTO {
    uidx: number;
    uid: string;
    game_idx: number;
    step: number;
    json_data: string;
}

export class restoreDeviceMissionDTO {
    deviceId: string;
    step: number;
}

export class setScoreDTO {
    @IsNumber()
    uidx: number;

    @IsNumber()
    game_idx: number;

    @IsNumber()
    score: number;
}