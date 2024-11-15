import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user chats' })
  getChats(@Req() req: Request) {
    return this.chatService.findUserChats(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:chatRoomId')
  @ApiOperation({ summary: 'Get messages for a chat room' })
  @ApiParam({ name: 'chatRoomId', type: 'number' })
  getChatMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getChatMessages(parseInt(chatRoomId));
  }
}
