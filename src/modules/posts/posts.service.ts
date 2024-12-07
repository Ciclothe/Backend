import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { EditPublicationDto } from './dto/posts.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Publication } from './types/post';
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

  async getPublicationById(id: string) {
    return await this.prisma.publications.findUnique({
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
            savedPublication: true,
          },
        },
      },
    });
  }

  async createPost(publication: Publication, req: Request) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      const geocoding = await ltdAndLong(
        publication.address,
        publication.postalCode,
      );

      publication.longitude = geocoding.lng;
      publication.latitude = geocoding.lat;

      const newPublication = await this.prisma.publications.create({
        data: {
          title: publication.title,
          description: publication.description,
          latitude: publication.latitude,
          longitude: publication.longitude,
          brand: publication.brand,
          size: publication.size,
          primary_color: publication.primary_color,
          gender: publication.gender,
          current_condition: publication.currentCondition,
          createdById: decodeToken.id,
          type: publication.type,
          categories: {
            connectOrCreate: publication.categories.map((category) => ({
              where: { name: category },
              create: { name: category },
            })),
          },
          tags: {
            connectOrCreate: publication.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: {
          image: true,
        },
      });

      for (const img of publication.media) {
        await this.prisma.image.create({
          data: {
            base64: img,
            publicationId: newPublication.id,
            orientation: publication.orientation,
          },
        });
      }

      return 'Post published successfully';
    } catch (e) {
      console.error('Error in createPost:', e);

      if (e.name === 'PrismaClientKnownRequestError') {
        // Prisma error
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Prisma error occurred',
            message: e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.response && e.response.status) {
        // Error from HttpException
        throw new HttpException(e.response.message, e.response.status);
      } else {
        // Internal Server Error
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            message: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updatePost(publication: EditPublicationDto, req: Request) {
    try {
      //Retrieve user id from token
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      if (publication.address) {
        const geocoding = await ltdAndLong(
          publication.address,
          publication.postalCode,
        );

        publication.longitude = geocoding.lng;
        publication.latitude = geocoding.lat;
      }

      //Update post whit the new information provided
      await this.prisma.publications.updateMany({
        where: {
          id: publication.id,
          createdById: decodeToken.id,
        },
        data: {
          title: publication.title,
          description: publication.description,
          latitude: publication.latitude,
          longitude: publication.longitude,
          current_condition: publication.currentCondition,
          reserved: publication.reserved,
        },
      });

      return 'Post edited successfully';
    } catch (e) {
      // Log errors
      console.error('Error in loginUser:', e);

      // Handle errors
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async deletePublication(publicationId: string, req: Request) {
    try {
      //Retrieve user id from token
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      //Find the publication to delete
      const findPublication = await this.prisma.publications.findFirst({
        where: {
          id: publicationId,
          createdById: decodeToken.id,
        },
      });

      //Validate if the post is from the user that wants to delete, and if the post exist
      if (!findPublication) {
        throw new HttpException('The publication dont exist', 200);
      }

      //Delete the post, and all the data relationed (images, and connections whit categories and tags)
      await this.prisma.$transaction([
        this.prisma.image.deleteMany({
          where: {
            publicationId: publicationId,
          },
        }),

        this.prisma.publications.delete({
          where: {
            id: publicationId,
          },
        }),
      ]);

      return 'Post deleted successfully';
    } catch (e) {
      // Log errors
      console.error('Error in loginUser:', e);

      // Handle errors
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async updateLikes(publicationId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const like = await this.prisma.likes.findFirst({
      where: {
        userId: decodeToken.id,
        publicationId,
      },
    });

    if (like) {
      await this.prisma.likes.delete({
        where: { id: like.id },
      });
    } else {
      const createLike = await this.prisma.likes.create({
        data: {
          publicationId,
          userId: decodeToken.id,
        },
        select: {
          publication: {
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
        userId: createLike.publication.createdBy.id,
        fromUserId: decodeToken.id,
        type: 'like',
        content: NotificationType.LIKE,
        relatedPostId: publicationId,
      };

      await this.notificationService.createNotification(notificationPayload);
    }

    return true;
  }

  async addView(publicationId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.view.create({
      data: {
        publicationId,
        userId: decodeToken.id,
      },
    });
  }

  savePublication(publicationId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    return this.prisma.savedPublications.create({
      data: {
        publicationId,
        userId: decodeToken.id,
      },
    });
  }

  async unsavePublication(publicationId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const savedPublication = await this.prisma.savedPublications.findFirst({
      where: {
        publicationId,
        userId: decodeToken.id,
      },
      select: {
        id: true,
      },
    });

    if (!savedPublication) {
      throw new HttpException('The publication is not saved', 200);
    }

    return this.prisma.savedPublications.delete({
      where: {
        id: savedPublication.id,
      },
    });
  }

  async addComment(publicationId: string, comment: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // save the comment in the database
    const createdComment = await this.prisma.comments.create({
      data: {
        publicationId,
        userId: decodeToken.id,
        content: comment,
      },
      select: {
        publication: {
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
      userId: createdComment.publication.createdBy.id,
      fromUserId: decodeToken.id,
      type: 'comment',
      relatedPostId: publicationId,
      content: NotificationType.COMMENT,
    };

    await this.notificationService.createNotification(notificationPayload);

    return createdComment;
  }

  deleteComment(commentId: string, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    return this.prisma.comments.delete({
      where: {
        id: commentId,
        userId: decodeToken.id,
      },
    });
  }
}
