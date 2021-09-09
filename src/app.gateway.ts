import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: Socket) {
    client.emit('disconnection', 'Conexion perdida');
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('connection', 'Conexion satisfactoria con el servidor');
  }

  @WebSocketServer()
  wss: Server;
}
