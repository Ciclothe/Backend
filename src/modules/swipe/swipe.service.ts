import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from '../user/dto/user.dto';

@Injectable()
export class SwipeService {
  constructor(private prisma: PrismaService) {}

  async swipe(req: Request) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    //Retrieve all posts that the user has already slipped
    const slippedPosts = await this.prisma.swipe.findMany({
      where: {
        userId: decodeToken.id,
      },
      select: {
        postId: true,
      },
    });

    //Retrieve all posts that the user has not slipped
    return await this.prisma.posts.findMany({
      where: {
        NOT: {
          id: {
            in: slippedPosts.map(
              (post) => post.postId,
            ),
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            userName: true,
            profilePicture: true,
          },
        },
        image: true,
        tags: true,
      },
    });
  }

  async swipeReaction(req: Request, postId: string, reaction: boolean) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.swipe.create({
      data: {
        userId: decodeToken.id,
        postId,
        reaction: reaction,
      },
    });

    return true;
  }
}
