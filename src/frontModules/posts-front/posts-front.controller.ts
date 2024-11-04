import { Controller, Get, Param } from '@nestjs/common';
import { PostsFrontService } from './posts-front.service';

@Controller('posts-front')
export class PostsFrontController {
  constructor(private postFront: PostsFrontService) {}

  //Development only
  @Get()
  async createData() {
    return this.postFront.createData();
  }

  @Get('genres')
  async getGenres() {
    return await this.postFront.genreSelection();
  }

  @Get('types/:genre')
  async getTypes(@Param('genre') genre: string) {
    return await this.postFront.typeSelection(genre);
  }

  @Get('categories/:id')
  async getCategories(@Param('id') typeId: string) {
    const id = parseInt(typeId, 10);
    return await this.postFront.categorySelection(id);
  }
}
