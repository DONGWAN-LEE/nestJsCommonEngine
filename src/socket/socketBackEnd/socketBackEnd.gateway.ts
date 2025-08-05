import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { CommonService } from '../../common/src/common.service';

let port = 8080;

// @WebSocketGateway(port, {
//     transports: ['websocket'],
//     cors: {
//         origin: '*',
//     },
// })

export class SocketBackEndGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly SocketService: SocketService,
        private readonly commonService: CommonService,
    ) {}
    @WebSocketServer()
    public server: Server;
    socket_ids = [];

    //소켓 연결시 유저목록에 추가
    public handleConnection(client: Socket): void {
        console.log("connect : " + client.id)
        client.leave(client.id);
        client.data.roomId = `room:treenod`;
        client.join('room:treenod');
        var clientIPAddress = client.request.connection.remoteAddress;
        
        console.log('========= Connect =========');
        console.log(client.id);
        console.log(clientIPAddress );
        console.log('===========================');
    }

    //소켓 연결 해제시 유저목록에서 제거
    public handleDisconnect(client: Socket): void {
        // const { roomId } = client.data;
        // if (
        //     roomId != 'room:treenod' &&
        //     !this.server.sockets.adapter.rooms.get(roomId)
        // ) {
        //     this.SocketService.deleteChatRoom(roomId);
        //     this.server.emit(
        //         'getChatRoomList',
        //         this.SocketService.getChatRoomList(),
        //     );
        // }
        // console.log('======== DisConnect =======');
        // console.log('disonnected', client.id);
        // console.log('===========================');
    }

    async reJoinRoom(client: Socket, uid: string) {
        client.leave('room:' + uid);
        client.join('room:'+ uid);

        client.data.myRoomId = 'room:'+ uid;
        client.data.deviceId = uid;
    }

    @SubscribeMessage('testDevice')
    async testDevice(client: Socket) {
        // await this.SocketService.getMergeStepData();
    }

}
