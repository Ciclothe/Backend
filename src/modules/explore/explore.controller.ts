import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { ParamsCategoryDto } from './dto/explore.dto';
import { Request, Response } from 'express';
import { Filter, FilterName, ParamsInterface } from './types/explore';

@Controller('explore')
export class ExploreController {
  constructor(private exploreService: ExploreService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get explorer posts' })
  explorePosts(@Req() req: Request, @Res() res: Response) {
    return this.exploreService.explore(req, res);
  }

  //TODO: Trending posts

  @UseGuards(JwtAuthGuard)
  @Get(':category/:subcategory?')
  @ApiOperation({ summary: 'Get categorized posts' })
  categorizedPosts(
    @Req() req: Request,
    @Res() res: Response,
    @Param() categoriesParam: ParamsCategoryDto,
  ) {
    return this.exploreService.categorizedPosts(req, categoriesParam, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/:fl/:filter?')
  @ApiOperation({ summary: 'Get filtered posts' })
  filteredPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('fl') filterName: FilterName,
    @Param('filter') filter: Filter,
  ) {
    const parameters: ParamsInterface = {
      filterName,
      filter,
    };

    return this.exploreService.filteredPosts(parameters, req, res);
  }
}
