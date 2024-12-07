import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Filter, FilterName, Params, State } from './types/feed';
import { ParamsCategoryDto } from './dto/feed.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get feed posts' })
  homePosts(@Req() req: Request) {
    return this.feedService.homePost(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('explorer')
  @ApiOperation({ summary: 'Get explorer posts' })
  posts(@Req() req: Request) {
    return this.feedService.explorer(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  @ApiOperation({ summary: 'Get recommended profiles' })
  recommendedProfiles(@Req() req: Request) {
    return this.feedService.recommendedProfiles(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/:fl/:filter?')
  @ApiOperation({ summary: 'Get filtered posts' })
  filteredPost(
    @Req() req: Request,
    @Param('fl') filterName: FilterName,
    @Param('filter') filter: Filter,
  ) {
    const parameters: Params = {
      filterName,
      filter,
    };

    return this.feedService.filteredPost(parameters, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':category/:subcategory?')
  @ApiOperation({ summary: 'Get categorized posts' })
  categorizedPost(
    @Req() req: Request,
    @Param() categoriesParam: ParamsCategoryDto,
  ) {
    return this.feedService.categoryPost(req, categoriesParam);
  }
}
