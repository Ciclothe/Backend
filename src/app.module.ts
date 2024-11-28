
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
