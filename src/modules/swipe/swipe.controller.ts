import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SwipeService } from './swipe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('swipe')
export class SwipeController {
  constructor(private swipeService: SwipeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get swipe' })
  swipe(@Req() req: Request) {
    return this.swipeService.swipe(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Post swipe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'post id': {
          type: 'string',
        },
        reaction: {
          type: 'string',
        },
      },
    },
  })
  swipeReaction(
    @Req() req: Request,
    @Body('postId') postId: string,
    @Body('reaction') reaction: boolean,
  ) {
    return this.swipeService.swipeReaction(req, postId, reaction);
  }
}
