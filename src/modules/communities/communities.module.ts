import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [CommunitiesService],
  controllers: [CommunitiesController],
  imports: [PrismaModule]
})
export class CommunitiesModule {}
