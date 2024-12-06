import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [PrismaModule, NotificationsModule]
})
export class EventsModule {}
