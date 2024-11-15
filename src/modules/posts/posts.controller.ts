import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { EditPublicationDto, PostDetailsDto} from './dto/posts.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Publication } from './types/post';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post' })
  @Post()
  createPost(
    @Body()
    postDetails: PostDetailsDto,
    @Req() req: Request,
  ) {

    const categories: string[] = [postDetails.categories.genre.name, postDetails.categories.type.name, postDetails.categories.category.name]
   
    const publication: Publication = {
      title : postDetails.description.title,
      categories,
      city: postDetails.description.location.city,
      country: postDetails.description.location.country,
      currentCondition: postDetails.condition,
      description: postDetails.description.description,
      gender: postDetails.categories.genre.name,
      brand: postDetails.description.brand,
      primary_color: postDetails.description.color.name,
      size: postDetails.description.size,
      tags: postDetails.description.tags,
      usageTime: postDetails.description.usageTime,
      media: postDetails.media.map((img) => img.base64)
    };

    return this.postService.createPost(publication, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit post' })
  @Patch()
  editPost(@Body() publication: EditPublicationDto, @Req() req: Request) {
    return this.postService.updatePost(publication, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  @Delete()
  deletePost(
    @Body('publicationId') publicationId: number,
    @Req() req: Request,
  ) {
    return this.postService.deletePublication(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  @ApiOperation({ summary: 'Add a like to a post' })
  @Patch('likes')
  updateLikes(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.updateLikes(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a view to a post' })
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  @Post('views')
  addView(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.addView(publicationId, req);
  }
}
