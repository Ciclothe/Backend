import { Module } from '@nestjs/common';
import { SwipeService } from './swipe.service';
import { SwipeController } from './swipe.controller';

@Module({
  providers: [SwipeService],
  controllers: [SwipeController]
})
export class SwipeModule {}
