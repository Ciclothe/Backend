import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('publications')
  @ApiOperation({ summary: 'Search publications' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchPublication(
    @Req() req: Request,
    @Query('search') search: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: string,
  ) {
    return this.searchService.searchPublications(req, search, latitude, longitude, radius);
  }

  @UseGuards(JwtAuthGuard)
  @Get('events')
  @ApiOperation({ summary: 'Search events' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchEvents(
    @Req() req: Request,
    @Query('search') search: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: string,
  ) {
    return this.searchService.searchEvents(req, search, latitude, longitude, radius);
  }

  @UseGuards(JwtAuthGuard)
  @Get('communities')
  @ApiOperation({ summary: 'Search communities' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchCommunities(@Query('search') search: string, @Req() req: Request) {
    return this.searchService.searchCommunities(req, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchUsers(@Query('search') search: string, @Req() req: Request) {
    return this.searchService.searchUsers(req, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get search history' })
  getSearchHistory(@Req() req: Request) {
    return this.searchService.getSearchHistory(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete search' })
  @ApiBody({ schema: { properties: { search: { type: 'string' } } } })
  deleteSearch(@Body('search') search: string, @Req() req: Request) {
    return this.searchService.deleteSearch(search, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history')
  @ApiOperation({ summary: 'Delete search history' })
  deleteSearchHistory(@Req() req: Request) {
    return this.searchService.deleteSearchHistory(req);
  }
}
