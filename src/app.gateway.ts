import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

@WebSocketGateway({ cors: true })
export class AppGateway implements NestGateway {
  afterInit(server: Server) {
    console.log('Init webGataway');
  }

  handleDisconnect(client: Socket) {
    client.emit('disconnection', 'Conexion perdida');
  }
  handleConnection(client: Socket, ...args: any[]) {
    client.emit(
      'connection',
      'Conexion satisfactoria con el servidor ' + client.id,
    );
  }

  @WebSocketServer()
  wss: Server;
}
