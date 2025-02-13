import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { userResponse } from './types/swap.d';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationPayload, NotificationType } from '../notifications/types/notifications';

@Injectable()
export class SwapService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async swapOptions(req: Request, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const post = await this.prisma.posts.findMany({
      where: {
        createdById: decodeToken.id,
      },
    });

    return res.status(200).json(post);
  }

  async swapOffer(desiredSwapId: string, offeredSwapIds: string[], res: Response) {
    let desiredPost, offeredPost;
    for (const offeredId of offeredSwapIds) {
      desiredPost = await this.prisma.posts.findUnique({
        where: { id: desiredSwapId },
        select: { createdById: true, id: true },
      });

      offeredPost = await this.prisma.posts.findUnique({
        where: { id: offeredId },
        select: { createdById: true },
      });

      if (desiredPost && offeredPost) {
        await this.prisma.swap.create({
          data: {
            offeredId,
            relatedPostId: desiredSwapId,
            relatedUserId: desiredPost.createdById,
            offeredUserId: offeredPost.createdById,
          },
        });
      }
    }

    // create the notification payload
    const notificationPayload: NotificationPayload = {
      userId: desiredPost.createdById,
      fromUserId: offeredPost.createdById,
      type: 'swap',
      content: NotificationType.SWAP,
      relatedPostId: desiredPost.id,
    };

    await this.notificationService.createNotification(notificationPayload, res);

    return res.status(200).json('Swap offer sent');
  }

  async swapOfferResponse(userRes: userResponse, swapId: string, res: Response) {
    const swapState =
      userRes == 'accept'
        ? 'reserved'
        : userRes === 'counteroffer'
          ? 'counteroffer'
          : userRes === 'reject'
            ? 'reject'
            : 'awaiting';

    await this.prisma.swap.update({
      where: {
        id: swapId,
      },
      data: {
        swapState,
      },
    });

    const userId = await this.prisma.swap.findFirst({
      where: {
        id: swapId,
      },
      select: {
        offeredUserId: true,
      },
    });

    const notificationMessage =
      userRes == 'accept'
        ? 'Your exchange request has been accepted'
        : userRes === 'counteroffer'
          ? 'You have a new counteroffer'
          : userRes === 'reject'
            ? 'Your exchange request has been rejected'
            : '';

    // create the notification payload
    const notificationPayload: NotificationPayload = {
      userId: userId.offeredUserId,
      fromUserId: userId.offeredUserId,
      type: 'swap',
      content: notificationMessage,
    };

    await this.notificationService.createNotification(notificationPayload, res);

    return res.status(200).json('Swap offer response sent');
  }
}
