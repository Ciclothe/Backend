import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  Query,
  Headers,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommunitiesDto } from './dto/communities.dto';
import { Request } from 'express';

@Controller('communities')
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllCommunities() {
    return this.communitiesService.getAllCommunities();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createNewCommunity(@Body() community: CommunitiesDto, @Req() req: Request) {
    return this.communitiesService.createNewCommunity(community, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  editCommunity(@Param('id') id: number, @Body() community: CommunitiesDto) {
    return this.communitiesService.editCommunity(id, community);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCommunity(@Param('id') id: number) {
    return this.communitiesService.deleteCommunity(id);
  }
}
