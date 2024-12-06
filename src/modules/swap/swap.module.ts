import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  providers: [SwapService],
  controllers: [SwapController],
  imports: [PrismaModule, NotificationsModule],
})
export class SwapModule {}
