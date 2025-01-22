import { HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import {
  ChangeDto,
  ChangeSensitiveInformationDto,
  DecodeDto,
} from './dto/user.dto';
import { compare, hash } from 'bcryptjs';
import { InjectMinio } from 'src/shared/minio/minio.decorator';
import * as Minio from 'minio';
import { env } from 'process';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectMinio() private readonly minioService: Minio.Client,
  ) {}

  async getUserName(req: Request, res: Response) {
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
        profilePicture: true,
      },
    });

    // Send user info to client
    return res.status(200).json(userInfo);
  }

  async userInfo(req: Request, res: Response) {
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
        profilePicture: true,
      },
    });

    // Send user info to client
    return res.status(200).json(userInfo);
  }

  async updateUserInfo(
    req: Request,
    res: Response,
    infoToUpdate: ChangeDto,
    profilePhoto: Express.Multer.File,
  ) {
    // Retrieve the user ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    const updateData: any = { ...infoToUpdate };

    if (profilePhoto) {
      // Generate a unique file name for the profile photo
      const fileName = `${Date.now()}_${profilePhoto.originalname}`;

      // Upload the profile photo to MinIO
      await this.minioService.putObject(
        env.MINIO_BUCKET,
        fileName,
        profilePhoto.buffer,
        profilePhoto.size,
        { 'Content-Type': profilePhoto.mimetype },
      );

      // Generate the URL for the uploaded profile photo
      const profilePhotoUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/your-bucket-name/${fileName}`;
      updateData.profilePicture = profilePhotoUrl;
    }

    // Update the user's information in the database
    const updatedUser = await this.prisma.users.update({
      where: {
        id: decodedToken.id,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: 'User information updated successfully.',
      user: updatedUser,
    });
  }

  async updateSesitiveUserInfo(
    req: Request,
    res: Response,
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

    return res.status(200).json(updateUser);
  }

  async rating(
    req: Request,
    res: Response,
    qualifiedUserId: string,
    rating: number,
  ) {
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

    return res.status(200).json(newCalification);
  }
}
