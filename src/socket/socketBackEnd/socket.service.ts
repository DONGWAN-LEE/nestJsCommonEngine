import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { 
    setInitDTO, 
    chatRoomListDTO, 
} from './dto/socketBackEnd.dto';

import { CommonService } from '../../common/src/common.service';

@Injectable()
export class SocketService {
    private chatRoomList: Record<string, chatRoomListDTO>;
    constructor(
        private readonly commonService : CommonService,
    ) {
        this.chatRoomList = {
            'room:lobby': {
                roomId: 'room:treenod',
                roomName: '로비',
                cheifId: null,
            },
        };
    }

    // async addDeviceUUID(device_uuid: string){
    //     let test = await this.commonService.encrypt('test string');
    //     console.log(test);
    //     console.log(await this.commonService.decrypt(test));
    //     let hash_password = await bcrypt.hash('treetive0615', 10);
    //     console.log(hash_password);
    //     // await this.gateDatabase.add_kizania_device_uuid(device_uuid, hash_password);
    // }

    createChatRoom(client: Socket, roomName: string): void {
        const roomId = `room:test`;
        const nickname: string = client.data.nickname;
        client.emit('getMessage', {
            id: null,
            nickname: '안내',
            message:
                '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
        });
        // return this.chatRoomList[roomId];
        this.chatRoomList[roomId] = {
            roomId,
            cheifId: client.id,
            roomName,
        };
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);
    }

    enterChatRoom(client: Socket, roomId: string) {
        client.data.roomId = roomId;
        client.rooms.clear();
        client.join(roomId);
        const { nickname } = client.data;
        const { roomName } = this.getChatRoom(roomId);
        client.to(roomId).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
        });
    }

    exitChatRoom(client: Socket, roomId: string) {
        client.data.roomId = `room:treenod`;
        client.rooms.clear();
        client.join(`room:treenod`);
        const { nickname } = client.data;
        client.to(roomId).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이 방에서 나갔습니다.',
        });
    }

    getChatRoom(roomId: string): chatRoomListDTO {
        return this.chatRoomList[roomId];
    }

    getChatRoomList(): Record<string, chatRoomListDTO> {
        return this.chatRoomList;
    }

    deleteChatRoom(roomId: string) {
        delete this.chatRoomList[roomId];
    }
}
