import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsFrontModule } from './frontModules/posts-front/posts-front.module';
import { SearchModule } from './modules/search/search.module';
import { FollowModule } from './modules/user/follow/follow.module';
import { SwapModule } from './modules/swap/swap.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { HomeModule } from './modules/home/home.module';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { CommunitiesModule } from './modules/communities/communities.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PostsModule,
    UserModule,
    PrismaModule,
    HomeModule,
    PostsFrontModule,
    SearchModule,
    FollowModule,
    ChatModule,
    SwapModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    CommunitiesModule,
    EventsModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
