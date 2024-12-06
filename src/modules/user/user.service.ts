import { HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import {
  ChangeDto,
  ChangeSensitiveInformationDto,
  DecodeDto,
} from './dto/user.dto';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserName(req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Search user info in database
    const userInfo = await this.prisma.users.findFirst({
      where: {
        id: decodeToken.id,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        profilePhoto: true,
      },
    });

    // Send user info to client
    return userInfo;
  }

  async userInfo(req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Search user info in database
    const userInfo = await this.prisma.users.findFirst({
      where: {
        id: decodeToken.id,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        accountCreatedAt: true,
        profilePhoto: true,
      },
    });

    // Send user info to client
    return userInfo;
  }

  async updateUserInfo(
    req: Request,
    infoToUpdate: ChangeDto,
    profilePhoto: Express.Multer.File,
  ) {
    //Retrive user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    //Update user information
    const findUser = await this.prisma.users.updateMany({
      where: {
        id: decodedToken.id,
      },
      data: {
        userName: infoToUpdate.name,
        profilePhoto: profilePhoto.originalname,
      },
    });

    return findUser;
  }

  async updateSesitiveUserInfo(
    req: Request,
    infoToUpdate: ChangeSensitiveInformationDto,
  ) {
    //Retrive user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    //Find user in the database
    const findUser = await this.prisma.users.findFirst({
      where: {
        id: decodedToken.id,
      },
    });

    //Validate if the user exist
    if (!findUser) {
      throw new HttpException("User don't exist", 400);
    }

    //Compare the password the user send and the one in the database
    const validatePassword = await compare(
      infoToUpdate.password,
      findUser.password,
    );
    console.log(validatePassword);

    //Validate if they are the same password
    if (!validatePassword) {
      throw new HttpException("Password don't match", 400);
    }

    //Validate if the user wants to change the password, and if different to current one
    if (
      infoToUpdate.newPassword &&
      infoToUpdate.newPassword === infoToUpdate.password
    ) {
      throw new HttpException(
        'The new password must be different from the current one',
        400,
      );
    }

    //Encrypt the new password
    const hashPassword = await hash(infoToUpdate.newPassword, 10);

    //Update user info
    const updateUser = await this.prisma.users.updateMany({
      where: {
        id: decodedToken.id,
      },
      data: {
        email: infoToUpdate.email,
        password: hashPassword,
      },
    });

    return updateUser;
  }

  async rating(req: Request, qualifiedUserId: string, rating: number) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    let qualification = 0;
    const newRating = await this.prisma.rating.create({
      data: {
        rating,
        qualifiedUserId,
        ratedById: decodedToken.id,
      },
    });

    const qualifiedUser = await this.prisma.users.findUnique({
      where: {
        id: qualifiedUserId,
      },
      include: {
        rating: true,
      },
    });

    qualifiedUser.rating.forEach((rate) => {
      qualification = qualification + rate.rating;
    });

    qualification = qualification / qualifiedUser.rating.length;

    const newCalification = await this.prisma.users.update({
      where: {
        id: qualifiedUserId,
      },
      data: {
        qualification,
      },
    });

    return newCalification;
  }
}
