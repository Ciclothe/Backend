import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { NotificationsGateway } from 'src/modules/notifications/notifications.gateway';
import { userResponse } from './types/swap.d';

@Injectable()
export class SwapService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationsGateway,
  ) {}

  async swapOptions(req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const post = await this.prisma.publications.findMany({
      where: {
        createdById: decodeToken.id,
      },
    });

    return post;
  }

  async swapOffer(desiredSwapId: number, offeredSwapIds: number[]) {
    for (const offeredId of offeredSwapIds) {
      const desiredPost = await this.prisma.publications.findUnique({
        where: { id: desiredSwapId },
        select: { createdById: true },
      });

      const offeredPost = await this.prisma.publications.findUnique({
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
            swapState: 'awaiting', // Puedes omitir esto ya que el valor por defecto es "awaiting"
          },
        });
      }
    }

    const user = await this.prisma.publications.findFirst({
      where: {
        id: desiredSwapId,
      },
      select: {
        createdById: true,
      },
    });

    if (user) {
      // const notificationMessage = 'Tienes una nueva solicitud de intercambio';
      // this.notificationGateway.handleSendNotification({
      //   userId: user.createdById,
      //   content: notificationMessage,
      // });
    }

    return true;
  }

  async swapOfferResponse(userRes: userResponse, swapId: number) {
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

    // this.notificationGateway.handleSendNotification({
    //   userId: userId.offeredUserId,
    //   content: notificationMessage,
    // });
  }
}
