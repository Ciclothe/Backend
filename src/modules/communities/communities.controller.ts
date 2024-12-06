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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CommunitiesDto } from './dto/communities.dto';
import { Request } from 'express';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('communities')
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all communities' })
  getAllCommunities() {
    return this.communitiesService.getAllCommunities();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new community' })
  createNewCommunity(@Body() community: CommunitiesDto, @Req() req: Request) {
    return this.communitiesService.createNewCommunity(community, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Edit an existing community' })
  @ApiParam({ name: 'id', type: 'string' })
  editCommunity(@Param('id') id: string, @Body() community: CommunitiesDto) {
    return this.communitiesService.editCommunity(id, community);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'Delete a community' })
  deleteCommunity(@Param('id') id: string) {
    return this.communitiesService.deleteCommunity(id);
  }
}
