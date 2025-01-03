import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports:[PrismaModule]
})
export class ChatModule {}
