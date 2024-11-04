import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [FollowService],
  controllers: [FollowController],
  imports: [PrismaModule],
})
export class FollowModule {}
