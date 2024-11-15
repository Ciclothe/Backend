import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary: 'Search posts'})
  @ApiBody({schema: {properties: {search: {type: 'string'}}}})
  searchPost(@Body('search') search: string, @Req() req: Request) {
    return this.searchService.searchPublications(req, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({summary: 'Delete search'})
  @ApiBody({schema: {properties: {search: {type: 'string'}}}})
  deleteSearch(@Body('search') search: string, @Req() req: Request) {
    return this.searchService.deleteSearch(search, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("history")
  @ApiOperation({summary: 'Delete search history'})
  deleteSearchHistory(@Req() req: Request) {
    return this.searchService.deleteSearchHistory(req);
  }
}
