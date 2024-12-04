import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationPayload } from './types/notifications';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private notificationsGateway: NotificationsGateway) {}

  async createNotification(notificationPayload: NotificationPayload) {
    console.log(notificationPayload);
    await this.prisma.notifications.create({
      data: notificationPayload
    });

    // Count unread notifications
    const count = await this.prisma.notifications.count({
      where: {
        userId: notificationPayload.userId,
        isRead: false
      }
    }); 

    this.notificationsGateway.handleSendNotification(count);

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
