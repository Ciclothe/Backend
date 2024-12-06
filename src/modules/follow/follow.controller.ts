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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation ({summary: 'Follow a user'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  newFollow(@Body('userName') userName: string, @Req() req: Request) {
    return this.followService.newFollow(userName, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation ({summary: 'Unfollow a user'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  deleteFollow(@Body('userName') userName: string, @Req() req: Request) {
    return this.followService.stopFollowing(userName, req);
  }

  // TODO: Follows and followers of the person

  // Followers of other person
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation ({summary: 'Get followers'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  followers(@Body('userName') userName: string) {
    console.log(userName);
    return this.followService.followers(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followed')
  @ApiOperation ({summary: 'Get followed'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  followed(@Body('userName') userName: string) {
    return this.followService.followed(userName);
  }
}
