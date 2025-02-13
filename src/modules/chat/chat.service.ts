import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { DecodeDto } from '../user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findUserChats(req: Request) {
    
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      const chatRooms = await this.prisma.chatRoom.findMany({
        where: {
          OR: [{ senderId: decodeToken.id }, { recipientId: decodeToken.id }],
        },
        include: {
          sender: {
            select: {
              id: true,
              userName: true,
              profilePicture: true,
            },
          },
          recipient: {
            select: {
              id: true,
              userName: true,
              profilePicture: true,
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
          chatRoom.senderId === decodeToken.id ? chatRoom.recipient : chatRoom.sender;

        return {
          chatRoomId: chatRoom.id,
          otherUser: {
            id: otherUser.id,
            userName: otherUser.userName,
            profilePhoto: otherUser.profilePicture,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      });
  }

  async getChatMessages(chatRoomId: string){

    return await this.prisma.messages.findMany({
      where:{
        chatRoomId
      }
    })
  }

  async findUserByName(userName: string) {
    return await this.prisma.users.findUnique({
      where: { userName },
    });
  }

  async findOrCreateChatRoom(senderId: string, recipientId: string) {
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

  async createMessage(content: string, sendById: string, chatRoomId: string, img?: string) {
    return await this.prisma.messages.create({
      data: {
        content,
        sendById,
        chatRoomId,
        img
      },
    });
  }
}
