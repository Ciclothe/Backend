import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [PrismaModule]
})
export class EventsModule {}
