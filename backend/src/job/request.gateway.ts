import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RequestGateway {
    @WebSocketServer()
    server: Server;

    // Map to associate entryId with clientId
    private entryToClientMap: Map<number, string> = new Map();

    // Handle client joining with entryId
    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() entryId: number, // Expect only entryId from the client
        @ConnectedSocket() client: Socket
    ) {
        const clientId = client.id;  // Use the socket ID as the clientId
        console.log(`Client ${client.id} joined with entryId: ${entryId}`);

        // Store the mapping between entryId and clientId (client.id)
        this.entryToClientMap.set(entryId, clientId);

        console.log(`Mapped entryId: ${entryId} to clientId: ${clientId}`);
    }

    // Notify the client when their request is ready
    sendOfferReadyNotification(entryId: number, data: string) {
        console.log(`Preparing to emit "requestReady" event for entryId: ${entryId}`);

        // Retrieve clientId from the entryToClientMap
        const clientId = this.entryToClientMap.get(entryId);
        if (clientId) {
            const socket = this.server.sockets.sockets.get(clientId); // Get the client socket
            if (socket) {
                this.server.to(clientId).emit('requestReady', data);  // Emit to the correct client
                console.log(`Emitted "requestReady" to client with socketId: ${clientId}`);
            } else {
                console.error(`Failed to emit requestReady: Client with clientId ${clientId} not connected`);
            }
        } else {
            console.error(`No clientId found for entryId: ${entryId}`);
        }
    }
}
