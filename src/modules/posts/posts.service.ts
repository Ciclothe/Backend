import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { EditPostDto, PostDetailsDto } from './dto/posts.dto';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import { ltdAndLong } from 'src/shared/utils/geocoding/geocoding';
import { NotificationsService } from '../notifications/notifications.service';
import {
  NotificationPayload,
  NotificationType,
} from '../notifications/types/notifications';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async getPostById(id: string) {
    return await this.prisma.posts.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
        categories: true,
        image: true,
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                userName: true,
                profilePicture: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            userName: true,
            profilePicture: true,
            qualification: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            savedPost: true,
          },
        },
      },
    });
  }

  async createPost(postDetails: PostDetailsDto, req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Geocoding for address and postal code
    const geocoding = await ltdAndLong(
      postDetails.description.location.address,
      postDetails.description.location.postalCode,
    );

    // Create a new post
    const newPost = await this.prisma.posts.create({
      data: {
        title: postDetails.description.title,
        description: postDetails.description.description,
        latitude: geocoding.lat,
        longitude: geocoding.lng,
        brand: postDetails.description.brand,
        size: postDetails.description.size,
        primary_color: postDetails.description.color.name,
        gender: postDetails.description.gender,
        current_condition: postDetails.condition,
        createdById: decodeToken.id,
        type: postDetails.type,
        categories: {
          connectOrCreate: [
            postDetails.categories.genre,
            postDetails.categories.type,
            postDetails.categories.category,
          ].map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
        tags: {
          connectOrCreate: postDetails.description.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        image: true,
      },
    });

    // Save media images
    for (const img of postDetails.media) {
      await this.prisma.image.create({
        data: {
          base64: img.base64,
          postId: newPost.id,
          orientation: postDetails.orientation,
        },
      });
    }

    return res.status(HttpStatus.CREATED).json(newPost);
  }

  async updatePost(post: EditPostDto, req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    if (post.address) {
      const geocoding = await ltdAndLong(
        post.address,
        post.postalCode,
      );

      post.longitude = geocoding.lng;
      post.latitude = geocoding.lat;
    }

    //Update post whit the new information provided
    await this.prisma.posts.updateMany({
      where: {
        id: post.id,
        createdById: decodeToken.id,
      },
      data: {
        title: post.title,
        description: post.description,
        latitude: post.latitude,
        longitude: post.longitude,
        current_condition: post.currentCondition,
        reserved: post.reserved,
      },
    });

    return res.status(HttpStatus.OK).json('Post updated successfully');
  }

  async deletePost(postId: string, req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    //Find the post to delete
    const findPost = await this.prisma.posts.findFirst({
      where: {
        id: postId,
        createdById: decodeToken.id,
      },
    });

    //Validate if the post is from the user that wants to delete, and if the post exist
    if (!findPost) {
      throw new HttpException('The post dont exist', 200);
    }

    //Delete the post, and all the data relationed (images, and connections whit categories and tags)
    await this.prisma.$transaction([
      this.prisma.image.deleteMany({
        where: {
          postId: postId,
        },
      }),

      this.prisma.posts.delete({
        where: {
          id: postId,
        },
      }),
    ]);

    return res.status(HttpStatus.OK).json('Post deleted successfully');
  }

  async updateLikes(postId: string, req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const like = await this.prisma.likes.findFirst({
      where: {
        userId: decodeToken.id,
        postId,
      },
    });

    if (like) {
      await this.prisma.likes.delete({
        where: { id: like.id },
      });
    } else {
      const createLike = await this.prisma.likes.create({
        data: {
          postId,
          userId: decodeToken.id,
        },
        select: {
          post: {
            select: {
              createdBy: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      // create the notification payload
      const notificationPayload: NotificationPayload = {
        userId: createLike.post.createdBy.id,
        fromUserId: decodeToken.id,
        type: 'like',
        content: NotificationType.LIKE,
        relatedPostId: postId,
      };

      await this.notificationService.createNotification(notificationPayload, res);
    }

    return res.status(HttpStatus.OK).json(true);
  }

  async addView(postId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.view.create({
      data: {
        postId,
        userId: decodeToken.id,
      },
    });
  }

  async saveOrUnsavePost(postId: string, req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const savedPost = await this.prisma.savedPosts.findFirst({
      where: {
        postId,
        userId: decodeToken.id,
      },
      select: {
        id: true,
      },
    });

    if (!savedPost) {
      
      await this.prisma.savedPosts.create({
        data: {
          postId,
          userId: decodeToken.id,
        },
      });

      return res.status(HttpStatus.CREATED).json('Post saved');
    }

    await this.prisma.savedPosts.delete({
      where: {
        id: savedPost.id,
      },
    });

    return res.status(HttpStatus.OK).json('Post unsaved');
  }

  async addComment(postId: string, comment: string, req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // save the comment in the database
    const createdComment = await this.prisma.comments.create({
      data: {
        postId,
        userId: decodeToken.id,
        content: comment,
      },
      select: {
        post: {
          select: {
            createdBy: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // create the notification payload
    const notificationPayload: NotificationPayload = {
      userId: createdComment.post.createdBy.id,
      fromUserId: decodeToken.id,
      type: 'comment',
      relatedPostId: postId,
      content: NotificationType.COMMENT,
    };

    await this.notificationService.createNotification(notificationPayload, res);

    return res.status(HttpStatus.CREATED).json(createdComment);
  }

  async deleteComment(commentId: string, req:Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.comments.delete({
      where: {
        id: commentId,
        userId: decodeToken.id,
      },
    });

    return res.status(HttpStatus.OK).json('Comment deleted successfully');
  }
}
