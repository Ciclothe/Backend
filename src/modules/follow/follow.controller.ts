import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation ({summary: 'Follow a user'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  newFollow(@Body('userName') userName: string, @Req() req: Request, @Res() res: Response) {
    return this.followService.newFollow(userName, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation ({summary: 'Unfollow a user'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  deleteFollow(@Body('userName') userName: string, @Req() req: Request, @Res() res: Response) {
    return this.followService.stopFollowing(userName, req, res);
  }

  // TODO: Follows and followers of the person

  // Followers of other person
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation ({summary: 'Get followers'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  followers(@Body('userName') userName: string, @Res() res: Response) {
    return this.followService.followers(userName, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followed')
  @ApiOperation ({summary: 'Get followed'})
  @ApiBody({schema: {properties: {userName: {type: 'string'}}}})
  followed(@Body('userName') userName: string, @Res() res: Response) {
    return this.followService.followed(userName, res);
  }
}
