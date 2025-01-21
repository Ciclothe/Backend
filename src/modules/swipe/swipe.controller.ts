import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SwipeService } from './swipe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('swipe')
export class SwipeController {
  constructor(private swipeService: SwipeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get swipe' })
  swipe(@Req() req: Request, @Res() res: Response) {
    return this.swipeService.swipe(req, res);
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
    @Res() res: Response,
    @Body('postId') postId: string,
    @Body('reaction') reaction: boolean,
  ) {
    return this.swipeService.swipeReaction(req, postId, reaction, res);
  }
}
