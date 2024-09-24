
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RequestGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('join')
    handleJoinRoom(
        @MessageBody() clientId: string,
        @ConnectedSocket() client: Socket
    ) {
        client.join(clientId);
    }

    sendOfferReadyNotification(clientId: string) {
        this.server.to(clientId).emit('requestReady');
    }
}
