import { HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from '../user/dto/user.dto';
import { NotificationPayload, NotificationType } from '../notifications/types/notifications';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService, private notificationService: NotificationsService) {}

  async newFollow(userName: string, req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    //Retrieve user to follow if from db
    const userToFollow = await this.prisma.users.findFirst({
      where: {
        userName,
      },
      select: {
        id: true,
      },
    });

    //Validate if not following now
    const followRelationship = await this.prisma.follow.findFirst({
      where: {
        followedById: userToFollow.id,
        followerById: decodedToken.id,
      },
    });

    if (followRelationship || userToFollow.id === decodedToken.id) {
      throw new HttpException('You already follow this user', 400);
    }

    // Save the follow
    await this.prisma.follow.create({
      data: {
        followedById: userToFollow.id,
        followerById: decodedToken.id,
      },
    });

    // create the notification payload
    const notificationPayload: NotificationPayload = {
      userId: userToFollow.id,
      fromUserId: decodedToken.id,
      type: 'follow',
      content: NotificationType.FOLLOW,
    };

    await this.notificationService.createNotification(notificationPayload, res);

    return res.status(200).json({ message: 'Followed' });
  }

  async stopFollowing(userName: string, req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as DecodeDto;

    const userFollowed = await this.prisma.users.findFirst({
      where: {
        userName,
      },
      select: {
        id: true,
      },
    });

    // Search the relation to delete
    const followRelationship = await this.prisma.follow.findFirst({
      where: {
        followedById: userFollowed.id,
        followerById: decodedToken.id,
      },
    });

    // Validate if there is a relation
    if (followRelationship) {
      // Delete the follow relation
      await this.prisma.follow.delete({
        where: {
          id: followRelationship.id,
        },
      });

      return res.status(200).json({ message: 'Unfollowed' });
    } else {
      return res.status(400).json({ message: 'You dont follow this user' });
    }
  }

  async followers(userName: string, res: Response) {
    // Retrieve user id from db
    const userId = await this.prisma.users.findFirst({
      where: {
        userName,
      },
      select: {
        id: true,
      },
    });

    //validate if user exist
    if (!userId) {
      throw new HttpException('User dont exist', 400);
    }

    // Retrieve followers id
    const followersId = await this.prisma.follow.findMany({
      where: {
        followedById: userId.id,
      },
      select: {
        followerById: true,
      },
    });

    const followers = await this.prisma.users.findMany({
      where: {
        id: {
          in: followersId.map((follower) => follower.followerById),
        },
      },
      select: {
        userName: true,
      },
    });

    return res.status(200).json(followers);
  }

  async followed(userName: string, res: Response) {
    // Retrieve user id from db
    const userId = await this.prisma.users.findFirst({
      where: {
        userName,
      },
      select: {
        id: true,
      },
    });

    //validate if user exist
    if (!userId) {
      throw new HttpException('User dont exist', 400);
    }

    // Retrieve followed id
    const followedId = await this.prisma.follow.findMany({
      where: {
        followerById: userId.id,
      },
      select: {
        followedById: true,
      },
    });

    const followed = await this.prisma.users.findMany({
      where: {
        id: {
          in: followedId.map((follower) => follower.followedById),
        },
      },
      select: {
        userName: true,
      },
    });

    return res.status(200).json(followed);
  }
}
