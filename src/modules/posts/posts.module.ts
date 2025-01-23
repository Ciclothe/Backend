import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [PrismaModule, NotificationsModule],
})
export class PostsModule {}
