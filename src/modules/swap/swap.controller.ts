import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SwapService } from './swap.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('swap')
export class SwapController {
  constructor(private swapService: SwapService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSwapOptions(@Req() req: Request) {
    return this.swapService.swapOptions(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  saveSwapOffer(@Body() { desiredSwapId, offeredSwapId }) {
    return this.swapService.swapOffer(desiredSwapId, offeredSwapId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('response')
  swapOfferResponse(@Body() { userRes, swapId }) {
    return this.swapService.swapOfferResponse(userRes, swapId);
  }
}
