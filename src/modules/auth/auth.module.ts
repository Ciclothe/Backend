import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './dto/constants';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20h' },
    }),
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'f3211d0a8a751b',
          pass: 'eaff8295a87acd',
        },
      },
      defaults: {
        from: 'admin@example.com',
      },
    }),
  ],
})
export class AuthModule {}
