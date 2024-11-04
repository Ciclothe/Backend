import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(notificationMessage: string, userId: number) {
    await this.prisma.notifications.create({
      data: {
        userId: userId,
        content: notificationMessage,
      },
    });

    return true;
  }

  async getNotifications(userId: number) {
    const notifications = await this.prisma.notifications.findMany({
      where: {
        userId,
      },
    });

    return notifications;
  }

  async markAsRead(notificationId: number) {
    await this.prisma.notifications.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async deleteNotification(notificationId: number) {
    await this.prisma.notifications.delete({
      where: {
        id: notificationId,
      },
    });
  }
}
