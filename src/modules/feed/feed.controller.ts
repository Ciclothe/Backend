import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get feed publications' })
  feedPublications(@Req() req: Request) {
    return this.feedService.feedPublications(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  @ApiOperation({ summary: 'Get recommended profiles' })
  recommendedProfiles(@Req() req: Request) {
    return this.feedService.recommendedProfiles(req);
  }

}
