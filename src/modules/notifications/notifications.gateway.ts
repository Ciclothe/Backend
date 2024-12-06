import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { DecodeDto } from '../user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { count } from 'console';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: new ConfigService().get<string>('DEVELOPMENT_URL'),
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map();

  constructor(
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    try {
      const cookies = client.handshake.headers.cookie;
      const token = cookies
        .split('; ')
        .find((c) => c.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Token not found');
      }

      const decoded = jwt.decode(token) as DecodeDto;

      if (!decoded) {
        throw new Error('Invalid token');
      }

      if (this.users.has(decoded.name)) {
        const existingSocketId = this.users.get(decoded.name);
        const existingSocket =
          this.server.sockets.sockets.get(existingSocketId);
        if (existingSocket) {
          existingSocket.disconnect();
        }
      }

      this.users.set(decoded.name, client.id);
    } catch (error) {
      console.log('Unauthorized:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((value, key) => {
      if (value === client.id) {
        this.users.delete(key);
      }
    });
  }

  @SubscribeMessage('notification')
  async handleSendNotification(@MessageBody() count: number) {

    this.server.emit('notification', count);
  }
}
