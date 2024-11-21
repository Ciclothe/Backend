import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  EditPublicationDto } from './dto/posts.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Publication } from './types/post';
import { ltdAndLong } from 'src/utils/LtdAndLong';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(publication: Publication, req: Request) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodeToken = jwt.decode(token) as DecodeDto;

      const geocoding = await ltdAndLong(publication.address, publication.postalCode);

      publication.longitude = geocoding.lng;
      publication.latitude = geocoding.lat;

      const newPublication = await this.prisma.publications.create({
        data: {
          title: publication.title,
          description: publication.description,
          country: publication.country,
          city: publication.city,
          address: publication.address,
          latitude: publication.latitude,
          longitude: publication.longitude,
          brand: publication.brand,
          usage_time: publication.usageTime,
          size: publication.size,
          primary_color: publication.primary_color,
          gender: publication.gender,
          current_condition: publication.currentCondition,
          createdById: decodeToken.id,
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

      if(publication.address){
        const geocoding = await ltdAndLong(publication.address, publication.postalCode);

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
          country: publication.country,
          city: publication.city,
          address: publication.address,
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

  async deletePublication(publicationId: number, req: Request) {
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

  async updateLikes(publicationId: number, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const like = await this.prisma.likes.findFirst({
      where: {
        userId: decodeToken.id,
        publicationId,
      },
    });

    if (like) {
      const updateLike = await this.prisma.likes.update({
        where: { id: like.id },
        data: { liked: !like.liked },
        select: {
          liked: true,
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

      if (updateLike.liked) {
        await this.prisma.users.update({
          where: { id: updateLike.publication.createdBy.id },
          data: { totalLikes: { increment: 1 } },
        });
      } else {
        await this.prisma.users.update({
          where: { id: updateLike.publication.createdBy.id },
          data: { totalLikes: { decrement: 1 } },
        });
      }
    } else {
      const createLike = await this.prisma.likes.create({
        data: {
          publicationId,
          userId: decodeToken.id,
          liked: true,
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

      await this.prisma.users.update({
        where: { id: createLike.publication.createdBy.id },
        data: { totalLikes: { increment: 1 } },
      });
    }

    return true;
  }

  async addView(publicationId: number, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.view.create({
      data: {
        publicationId,
        userId: decodeToken.id,
      },
    });
  }
}
