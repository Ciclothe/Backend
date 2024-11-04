import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from 'src/modules/user/dto/user.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createNotification(@Body() notificationMessage: string, @Req() req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    return this.notificationsService.createNotification(
      notificationMessage,
      decodeToken.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getNotifications(@Req() req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    return this.notificationsService.getNotifications(decodeToken.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateNotification(@Body() notificationId: number) {
    return this.notificationsService.markAsRead(notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteNotification(@Body() notificationId: number) {
    return this.notificationsService.deleteNotification(notificationId);
  }
}
