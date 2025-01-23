import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtChatGuard } from 'src/modules/auth/guards/jwt-chat.guard';
import { DecodeDto } from '../user/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { buffer } from 'stream/consumers';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: new ConfigService().get<string>('DEVELOPMENT_URL'),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 10 * 1024 * 1024,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private configService: ConfigService, 
  ) {}

  @UseGuards(JwtChatGuard)
  async handleConnection(client: Socket) {
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

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { message: string; recipient: string; sender: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    let content = data.message;

    const recipientSocketId = this.users.get(data.recipient);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message', content);
    } else {
      console.log('Recipient not connected');
    }
    try {
      const sender = await this.chatService.findUserByName(data.sender);
      const recipient = await this.chatService.findUserByName(data.recipient);
      const chatRoom = await this.chatService.findOrCreateChatRoom(
        sender.id,
        recipient.id,
      );

      await this.chatService.createMessage(content, sender.id, chatRoom.id);
    } catch (error) {
      console.error('Error saving message to database:', error.message);
    }
  }

  @SubscribeMessage('uploadImage')
  async handleFileUpload(
    @MessageBody()
    messageData: { sender: string; recipient: string; file: Buffer },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const filename = uuidv4();
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      filename,
    );

    fs.writeFile(filePath, messageData.file, async (err) => {
      const callback = (status: string) => {
        client.emit('uploadStatus', status);
      };
      if (err) {
        console.log(err);
        return callback(filename);
      }

      const recipientSocketId = this.users.get(messageData.recipient);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('message', messageData.file);
      }
      try {
        const sender = await this.chatService.findUserByName(
          messageData.sender,
        );
        const recipient = await this.chatService.findUserByName(
          messageData.recipient,
        );
        const chatRoom = await this.chatService.findOrCreateChatRoom(
          sender.id,
          recipient.id,
        );

        await this.chatService.createMessage(
          '',
          sender.id,
          chatRoom.id,
          `http://localhost:3000/uploads/${filename}`, // URL de la imagen
        );

        callback(filename);
      } catch (error) {
        console.error('Error saving message to database:', error.message);
        callback(filename);
      }
    });
  }
}
