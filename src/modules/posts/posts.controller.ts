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
import { EditPostDto, PostDetailsDto } from './dto/posts.dto';
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
    @Body() post: EditPostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.postService.updatePost(post, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { postId: { type: 'string' } },
    },
  })
  deletePost(
    @Body('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.postService.deletePost(postId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('like')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { postId: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: 'Add a like to a post' })
  updateLikes(
    @Req() req: Request,
    @Body('postId') postId: string,
    @Res() res: Response,
  ) {
    return this.postService.updateLikes(postId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('views')
  @ApiOperation({ summary: 'Add a view to a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { postId: { type: 'string' } },
    },
  })
  addView(@Req() req: Request, @Body() postId: string) {
    return this.postService.addView(postId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  @ApiOperation({ summary: 'Save or unsave a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { postId: { type: 'string' } },
    },
  })
  saveOrUnsavePost(
    @Req() req: Request,
    @Body() postId: string,
    @Res() res: Response,
  ) {
    return this.postService.saveOrUnsavePost(postId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comment')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'string' },
        comment: { type: 'string' },
      },
    },
  })
  addComment(
    @Req() req: Request,
    @Body('postId') postId: string,
    @Body('comment') comment: string,
    @Res() res: Response,
  ) {
    return this.postService.addComment(postId, comment, req, res);
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
