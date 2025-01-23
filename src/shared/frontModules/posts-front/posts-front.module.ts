import { Module } from '@nestjs/common';
import { PostsFrontService } from './posts-front.service';
import { PostsFrontController } from './posts-front.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [PostsFrontService],
  controllers: [PostsFrontController],
  imports: [PrismaModule],
})
export class PostsFrontModule {}
