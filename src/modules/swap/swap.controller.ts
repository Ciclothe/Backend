import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SwapService } from './swap.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('swap')
export class SwapController {
  constructor(private swapService: SwapService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({summary: 'Get swap options'})
  getSwapOptions(@Req() req: Request, @Res() res: Response) {
    return this.swapService.swapOptions(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary: 'Send swap offer'})
  @ApiBody({schema: {properties: {desiredSwapId: {type: 'string'}, offeredSwapId: {type: 'string'}}}})
  saveSwapOffer(@Body() {desiredSwapId, offeredSwapId}: {desiredSwapId: string, offeredSwapId: string[]}, @Res() res: Response) {
    return this.swapService.swapOffer(desiredSwapId, offeredSwapId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('response')
  @ApiOperation({summary: 'Respond to swap offer'})
  @ApiBody({schema: {properties: {userRes: {type: 'string'}, swapId: {type: 'number'}}}})
  swapOfferResponse(@Body() { userRes, swapId }, @Res() res: Response) {
    return this.swapService.swapOfferResponse(userRes, swapId, res);
  }
}
