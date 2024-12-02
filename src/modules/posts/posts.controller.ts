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
  @ApiOperation({ summary: 'Create a post' })
  @Post()
  createPost(
    @Body()
    postDetails: PostDetailsDto,
    @Req() req: Request,
  ) {

    const categories: string[] = [postDetails.categories.genre, postDetails.categories.type, postDetails.categories.category]

    const publication: Publication = {
      title : postDetails.description.title,
      categories,
      address: postDetails.description.location.address,
      postalCode: postDetails.description.location.postalCode,
      currentCondition: postDetails.condition,
      description: postDetails.description.description,
      gender: postDetails.description.gender,
      brand: postDetails.description.brand,
      primary_color: postDetails.description.color.name,
      size: postDetails.description.size,
      tags: postDetails.description.tags,
      usageTime: postDetails.description.usageTime,
      media: postDetails.media.map((img) => img.base64),
      orientation: postDetails.orientation,
      type: postDetails.type,
    };

    return this.postService.createPost(publication, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Edit post' })
  editPost(@Body() publication: EditPublicationDto, @Req() req: Request) {
    return this.postService.updatePost(publication, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete post' })
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  deletePost(
    @Body('publicationId') publicationId: number,
    @Req() req: Request,
  ) {
    return this.postService.deletePublication(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('likes')
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  @ApiOperation({ summary: 'Add a like to a post' })
  updateLikes(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.updateLikes(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('views')
  @ApiOperation({ summary: 'Add a view to a post' })
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  addView(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.addView(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  @ApiOperation({ summary: 'Save a publication' })
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  savePublication(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.savePublication(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('save')
  @ApiOperation({ summary: 'Unsave a publication' })
  @ApiBody({ schema: { type: 'object', properties: { publicationId: { type: 'number' } } } })
  unsavePublication(@Req() req: Request, @Body() publicationId: number) {
    return this.postService.unsavePublication(publicationId, req);
  }


}
