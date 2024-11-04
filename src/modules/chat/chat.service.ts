import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecodeDto } from '../user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findUserChats(req: Request) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      // Verifica que el token se haya decodificado correctamente
      if (!decodeToken || !decodeToken.id) {
        throw new Error('Invalid token');
      }

      const userId = decodeToken.id;

      const chatRooms = await this.prisma.chatRoom.findMany({
        where: {
          OR: [{ senderId: userId }, { recipientId: userId }],
        },
        include: {
          sender: {
            select: {
              id: true,
              userName: true,
              profilePhoto: true,
            },
          },
          recipient: {
            select: {
              id: true,
              userName: true,
              profilePhoto: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              content: true,
              createdAt: true,
            },
          },
        },
      });

      return chatRooms.map((chatRoom) => {
        const lastMessage = chatRoom.messages[0] || null;
        const otherUser =
          chatRoom.senderId === userId ? chatRoom.recipient : chatRoom.sender;

        return {
          chatRoomId: chatRoom.id,
          otherUser: {
            id: otherUser.id,
            userName: otherUser.userName,
            profilePhoto: otherUser.profilePhoto,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      });
    } catch (error) {
      console.error('Error finding user chats:', error);
      throw new Error('Could not find user chats');
    }
  }

  async getChatMessages(chatRoomId: number){

    return await this.prisma.messages.findMany({
      where:{
        chatRoomId
      }
    })
  }

  async findUserByName(userName: string) {
    return this.prisma.users.findUnique({
      where: { userName },
    });
  }

  async findOrCreateChatRoom(senderId: number, recipientId: number) {
    let chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        OR: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
    });

    if (!chatRoom) {
      chatRoom = await this.prisma.chatRoom.create({
        data: {
          senderId,
          recipientId,
        },
      });
    }

    return chatRoom;
  }

  async createMessage(content: string, sendById: number, chatRoomId: number, img?: string) {
    return this.prisma.messages.create({
      data: {
        content,
        sendById,
        chatRoomId,
        img
      },
    });
  }
}
