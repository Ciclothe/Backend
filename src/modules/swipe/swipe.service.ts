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

    //Retrieve all publications that the user has already slipped
    const slippedPublications = await this.prisma.swipe.findMany({
      where: {
        userId: decodeToken.id,
      },
      select: {
        publicationId: true,
      },
    });

    //Retrieve all publications that the user has not slipped
    return await this.prisma.publications.findMany({
      where: {
        NOT: {
          id: {
            in: slippedPublications.map(
              (publication) => publication.publicationId,
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

  async swipeReaction(req: Request, publicationId: string, reaction: boolean) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.swipe.create({
      data: {
        userId: decodeToken.id,
        publicationId: publicationId,
        reaction: reaction,
      },
    });

    return true;
  }
}
