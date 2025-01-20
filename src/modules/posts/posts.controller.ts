import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { EditPublicationDto, PostDetailsDto } from './dto/posts.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a post' })
  @Post()
  async createPost(
    @Body() postDetails: PostDetailsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.postService.createPost(postDetails, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Edit post' })
  editPost(
    @Body() publication: EditPublicationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.postService.updatePost(publication, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { publicationId: { type: 'string' } },
    },
  })
  deletePost(
    @Body('publicationId') publicationId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.postService.deletePublication(publicationId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('like')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { publicationId: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: 'Add a like to a post' })
  updateLikes(
    @Req() req: Request,
    @Body('publicationId') publicationId: string,
    @Res() res: Response,
  ) {
    return this.postService.updateLikes(publicationId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('views')
  @ApiOperation({ summary: 'Add a view to a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { publicationId: { type: 'string' } },
    },
  })
  addView(@Req() req: Request, @Body() publicationId: string) {
    return this.postService.addView(publicationId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  @ApiOperation({ summary: 'Save or unsave a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { publicationId: { type: 'string' } },
    },
  })
  saveOrUnsavePost(
    @Req() req: Request,
    @Body() publicationId: string,
    @Res() res: Response,
  ) {
    return this.postService.saveOrUnsavePost(publicationId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comment')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        publicationId: { type: 'string' },
        comment: { type: 'string' },
      },
    },
  })
  addComment(
    @Req() req: Request,
    @Body('publicationId') publicationId: string,
    @Body('comment') comment: string,
    @Res() res: Response,
  ) {
    return this.postService.addComment(publicationId, comment, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comment')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBody({
    schema: { type: 'object', properties: { commentId: { type: 'string' } } },
  })
  deleteComment(
    @Req() req: Request,
    @Body() commentId: string,
    @Res() res: Response,
  ) {
    return this.postService.deleteComment(commentId, req, res);
  }
}
