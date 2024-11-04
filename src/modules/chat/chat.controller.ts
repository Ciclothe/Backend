import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getChats(@Req() req: Request) {
    return this.chatService.findUserChats(req);
  } 

  @UseGuards(JwtAuthGuard)
  @Get('messages/:chatRoomId')
  getChatMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getChatMessages(parseInt(chatRoomId));
  }
}
