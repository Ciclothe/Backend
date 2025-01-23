import { Module } from '@nestjs/common';
import { SwipeService } from './swipe.service';
import { SwipeController } from './swipe.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [SwipeService],
  controllers: [SwipeController],
  imports: [PrismaModule],
})
export class SwipeModule {}
