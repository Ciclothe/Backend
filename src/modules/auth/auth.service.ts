import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenDto, UserRegisterDto } from './dto/auth.dto';
import { hash, compare } from 'bcryptjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async registerUser(user: UserRegisterDto, res: Response) {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ email: user.email }, { userName: user.userName }],
      },
      select: {
        email: true,
        userName: true,
      },
    });

    if (
      existingUser.email === user.email ||
      existingUser.userName === user.userName
    ) {
      const conflictField =
        existingUser.email === user.email ? 'Email' : 'Username';
      throw new ConflictException(`${conflictField} already exists`);
    }

    user = { ...user, password: await hash(user.password, 10)};

    //! DEVELOPMENT ONLY
    const selectedDate = new Date(user.dob);

    const newUser = await this.prisma.users.create({
      data: {
        email: user.email,
        password: user.password,
        userName: user.userName,
        latitude: user.latitude,
        longitude: user.longitude,
        country: user.country,
        city: user.city,
        phoneNumber: user.phoneNumber,
        acceptTermsAndConditions: user.termsAndConditions,
        acceptNewsLatters: user.receivePromotions,
        dateOfBirth: selectedDate.toISOString(),
      },
    });

    const payload = { id: newUser.id, name: newUser.userName };
    const token = this.jwtService.sign(payload);

    res.cookie('token', token, {
      sameSite: 'lax',
      httpOnly: true,
    });

    return 'User registered successfully';
  }

  async loginUser(user: UserRegisterDto, res: Response) {
    // Search for the user in the database
    const findUser = await this.prisma.users.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    // Validate the password
    const passwordHashValidation = await compare(
      user.password,
      findUser.password,
    );

    if (!passwordHashValidation) {
      throw new HttpException('Invalid password', 400);
    }

    // Generate JWT token
    const payload = { id: findUser.id, name: findUser.userName };
    const token = this.jwtService.sign(payload);

    // Set cookie in the response
    res.cookie('token', token, {
      sameSite: 'lax',
      httpOnly: true,
    });

    return 'Logged in successfully'; 
  }

  logoutUser(res: Response) {
    res.clearCookie('token');
    return 'Logged out';
  }

  async deleteUser(req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as TokenDto;

    const findUser = await this.prisma.users.findFirst({
      where: {
        id: decodedToken.id,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User dont exist');
    }

    res.clearCookie('token');

    await this.prisma.users.delete({
      where: {
        id: findUser.id,
      },
    });

    return 'User deleted successfully';
  }

  async resetPasswordToken(email: string) {
    const token = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.resetPassword.create({
      data: {
        email: email,
        token,
      },
    });
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Your code: ${token}`,
    });

    return true;
  }

  async resetPasswordVerification(email: string, token: number) {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const resetPasswordEntry = await this.prisma.resetPassword.findFirst({
      where: {
        email: email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!resetPasswordEntry) {
      throw new HttpException(
        'No password reset request found for the provided email',
        404,
      );
    }

    if (resetPasswordEntry.token != token) {
      throw new HttpException(
        'Incorrect password reset verification code',
        400,
      );
    }

    if (resetPasswordEntry.createdAt < fifteenMinutesAgo) {
      throw new HttpException(
        'Password reset verification code has expired',
        400,
      );
    }

    return true;
  }

  async changePassword(
    password: string,
    confirmPassword: string,
    token: number,
  ) {
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new HttpException("Passwords don't match", 400);
    }

    // Check if password meets complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumberOrSymbol || !isLongEnough) {
      throw new HttpException('Weak password', 400);
    }

    // Check if token is valid and not expired
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const resetPasswordEntry = await this.prisma.resetPassword.findFirst({
      where: {
        token: token,
        createdAt: {
          gte: fifteenMinutesAgo,
        },
      },
    });

    if (!resetPasswordEntry) {
      throw new HttpException('The token is expired or invalid', 404);
    }

    // Hash password before storing
    const hashPassword = await hash(password, 10);

    // Update user's password
    await this.prisma.users.update({
      where: {
        email: resetPasswordEntry.email,
      },
      data: {
        password: hashPassword,
      },
    });

    // Delete resetPassword entry
    await this.prisma.resetPassword.delete({
      where: {
        id: resetPasswordEntry.id,
      },
    });

    // Return true if everything is successful
    return true;
  }
}
