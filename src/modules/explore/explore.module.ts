import { Module } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { ExploreController } from './explore.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [ExploreService],
  controllers: [ExploreController],
  imports: [PrismaModule],
})
export class ExploreModule {}
