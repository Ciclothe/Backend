import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  providers: [HomeService],
  controllers: [HomeController],
  imports: [PrismaModule],
})
export class HomeModule {}
