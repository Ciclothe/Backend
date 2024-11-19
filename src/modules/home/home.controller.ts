import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Filter, FilterName, Params, State } from './types/home';
import { ParamsCategoryDto } from './dto/home.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get feed posts' })
  homePosts(@Req() req: Request) {
    return this.homeService.homePost(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('explorer')
  @ApiOperation({ summary: 'Get explorer posts' })
  posts(@Req() req: Request) {
    return this.homeService.getPost(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  @ApiOperation({ summary: 'Get recommended profiles' })
  recommendedProfiles(@Req() req: Request) {
    return this.homeService.recommendedProfiles(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/:fl/:filter?')
  @ApiOperation({ summary: 'Get filtered posts' })
  filteredPost(
    @Param('fl') filterName: FilterName,
    @Param('filter') filter: Filter,
  ) {
    const parameters: Params = {
      filterName,
      filter,
    };

    return this.homeService.filteredPost(parameters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':category/:subcategory?')
  @ApiOperation({ summary: 'Get categorized posts' })
  categorizedPost(
    @Req() req: Request,
    @Param() categoriesParam: ParamsCategoryDto,
  ) {
    return this.homeService.categoryPost(req, categoriesParam);
  }
}
