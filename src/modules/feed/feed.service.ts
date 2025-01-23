import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { type DecodeDto } from './dto/feed.dto';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async feedPosts(req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const followedUsersPost = await this.prisma.users.findMany({
      where: {
        following: {
          some: {
            followedById: decodeToken.id,
          },
        },
      },
      select: {
        posts: {
          orderBy: {
            publicatedAt: 'desc',
          },
          include: {
            tags: true,
            categories: true,
            image: true,
            likes: true,
            _count: {
              select: {
                savedPost: true,
                comments: true,
                likes: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                userName: true,
                profilePicture: true,
                qualification: true,
              },
            },
          },
        },
      },
    });

    const allPosts = followedUsersPost.flatMap(
      (user) => user.posts,
    );

    return res.status(200).json(allPosts);
  }

  async recommendedProfiles(req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const users = await this.prisma.users.findFirst({
      where: {
        id: decodeToken.id,
      },
      orderBy: {
        qualification: 'desc',
      },
    });

    return res.status(200).json(users);
  }
}
