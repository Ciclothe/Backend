import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { EditPublicationDto, PostDetailsDto } from './dto/posts.dto';
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

  async createPost(postDetails: PostDetailsDto, req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Geocoding for address and postal code
    const geocoding = await ltdAndLong(
      postDetails.description.location.address,
      postDetails.description.location.postalCode,
    );

    // Create a new publication 
    const newPublication = await this.prisma.publications.create({
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
          publicationId: newPublication.id,
          orientation: postDetails.orientation,
        },
      });
    }

    return res.status(HttpStatus.CREATED).json(newPublication);
  }

  async updatePost(publication: EditPublicationDto, req: Request, res: Response) {
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

    return res.status(HttpStatus.OK).json('Post updated successfully');
  }

  async deletePublication(publicationId: string, req: Request, res: Response) {
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

    return res.status(HttpStatus.OK).json('Post deleted successfully');
  }

  async updateLikes(publicationId: string, req: Request, res: Response) {
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

    return res.status(HttpStatus.OK).json(true);
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

  async saveOrUnsavePost(publicationId: string, req: Request, res: Response) {
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
      
      await this.prisma.savedPublications.create({
        data: {
          publicationId,
          userId: decodeToken.id,
        },
      });

      return res.status(HttpStatus.CREATED).json('Post saved');
    }

    await this.prisma.savedPublications.delete({
      where: {
        id: savedPublication.id,
      },
    });

    return res.status(HttpStatus.OK).json('Post unsaved');
  }

  async addComment(publicationId: string, comment: string, req: Request, res: Response) {
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
