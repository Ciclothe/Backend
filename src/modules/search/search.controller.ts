import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  @ApiOperation({ summary: 'Search posts' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchPosts(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: string,
  ) {
    return this.searchService.searchPosts(req, res,search, latitude, longitude, radius);
  }

  @UseGuards(JwtAuthGuard)
  @Get('events')
  @ApiOperation({ summary: 'Search events' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchEvents(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: string,
  ) {
    return this.searchService.searchEvents(req,res, search, latitude, longitude, radius);
  }

  @UseGuards(JwtAuthGuard)
  @Get('communities')
  @ApiOperation({ summary: 'Search communities' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchCommunities(@Query('search') search: string, @Req() req: Request, @Res() res: Response) {
    return this.searchService.searchCommunities(req, search, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  @ApiQuery({ name: 'search', type: 'string', required: true })
  searchUsers(@Query('search') search: string, @Req() req: Request, @Res() res: Response) {
    return this.searchService.searchUsers(req, search, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get search history' })
  getSearchHistory(@Req() req: Request, @Res() res: Response) {
    return this.searchService.getSearchHistory(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete search' })
  @ApiBody({ schema: { properties: { search: { type: 'string' } } } })
  deleteSearch(@Body('search') search: string, @Req() req: Request, @Res() res: Response) {
    return this.searchService.deleteSearch(search, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history')
  @ApiOperation({ summary: 'Delete search history' })
  deleteSearchHistory(@Req() req: Request) {
    return this.searchService.deleteSearchHistory(req);
  }
}
