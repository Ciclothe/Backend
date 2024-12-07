import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: [PrismaModule],
})
export class FeedModule {}
