import { Body, Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get feed posts' })
  feedPosts(@Req() req: Request, @Res() res: Response) {
    return this.feedService.feedPosts(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  @ApiOperation({ summary: 'Get recommended profiles' })
  recommendedProfiles(@Req() req: Request, @Res() res: Response) {
    return this.feedService.recommendedProfiles(req, res);
  }

}
