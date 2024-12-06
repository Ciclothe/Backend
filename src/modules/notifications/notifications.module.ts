import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  imports: [PrismaModule],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
