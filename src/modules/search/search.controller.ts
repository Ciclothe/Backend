import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  searchPost(@Body('search') search: string, @Req() req: Request) {
    return this.searchService.searchPublications(req, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteSearch(@Body('search') search: string, @Req() req: Request) {
    return this.searchService.deleteSearch(search, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("history")
  deleteSearchHistory(@Req() req: Request) {
    return this.searchService.deleteSearchHistory(req);
  }
}
