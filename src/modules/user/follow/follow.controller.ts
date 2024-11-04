import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  newFollow(@Body('userName') userName: string, @Req() req: Request) {
    return this.followService.newFollow(userName, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteFollow(@Body('userName') userName: string, @Req() req: Request) {
    return this.followService.stopFollowing(userName, req);
  }

  // TODO: Follows and followers of the person

  // Followers of other person
  @UseGuards(JwtAuthGuard)
  @Get()
  followers(@Body('userName') userName: string) {
    console.log(userName);
    return this.followService.followers(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followed')
  followed(@Body('userName') userName: string) {
    return this.followService.followed(userName);
  }
}
