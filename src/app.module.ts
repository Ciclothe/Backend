import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { PostsFrontModule } from './shared/frontModules/posts-front/posts-front.module';
import { SearchModule } from './modules/search/search.module';
import { FollowModule } from './modules/follow/follow.module';
import { SwapModule } from './modules/swap/swap.module';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { CommunitiesModule } from './modules/communities/communities.module';
import { EventsModule } from './modules/events/events.module';
import { ExploreModule } from './modules/explore/explore.module';
import { SwipeModule } from './modules/swipe/swipe.module';
import { FeedModule } from './modules/feed/feed.module';
import { MinioModule } from './shared/minio/minio.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PostsModule,
    UserModule,
    PrismaModule,
    FeedModule,
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
    ExploreModule,
    SwipeModule,
    MinioModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
