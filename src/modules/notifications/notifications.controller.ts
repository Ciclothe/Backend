import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // @ApiOperation({ summary: 'Create notification' })
  // @ApiBody({ type: String })
  // createNotification(@Body("notificationMessage") notificationMessage: string, @Req() req: Request) {
  //   // Retrieve user id from token
  //   const token = req.headers.authorization.split(' ')[1];
  //   const decodeToken = jwt.decode(token) as DecodeDto;

  //   return this.notificationsService.createNotification(
  //     notificationMessage,
  //     decodeToken.id,
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  getNotifications(@Req() req: Request, @Res() res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    console.log(decodeToken.id);
    return this.notificationsService.getNotifications(decodeToken.id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiOperation({ summary: 'Update notification' })
  @ApiBody({ type: String })
  updateNotification(@Body() notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete notification' })
  @ApiBody({ type: String })
  deleteNotification(@Body() notificationId: string) {
    return this.notificationsService.deleteNotification(notificationId);
  }
}
