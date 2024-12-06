import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  providers: [FollowService],
  controllers: [FollowController],
  imports: [PrismaModule, NotificationsModule],
})
export class FollowModule {}
