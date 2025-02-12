import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  CategoriesDto,
  PublicationsDto,
  UserPublicationDto,
} from '../feed/dto/feed.dto';
import { DecodeDto } from '../user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { postClasification } from 'src/shared/utils/postClasification';
import { ParamsCategoryDto } from './dto/explore.dto';
import { ParamsInterface } from './types/explore';
import { contentBased } from 'src/shared/algorithms/contentBasedFiltering';

@Injectable()
export class ExploreService {
  constructor(private prisma: PrismaService) {}

  async explore(req: Request, res: Response) {
    //Extract user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const userId = decodeToken.id;

    //Fetch all posts excluding those created by the user
    const allPosts = await this.prisma.posts.findMany({
      where: { NOT: { createdById: userId } },
      include: {
        tags: true,
        categories: true,
        image: true,
        likes: true,
        createdBy: {
          select: {
            id: true,
            userName: true,
            profilePicture: true,
            qualification: true,
          },
        },
        _count: { select: { views: true } },
      },
    });

    //Fetch the last 10 posts liked by the user
    const userLikes = await this.prisma.likes.findMany({
      where: { userId },
      take: 10,
      orderBy: { id: 'desc' },
      select: { postId: true },
    });

    //If the user has liked posts, generate recommendations
    if (userLikes.length > 0) {
      const likedPostIds = userLikes.map((like) => like.postId);

      // Fetch categories and tags of liked posts in a single query
      const likedPosts = await this.prisma.posts.findMany({
        where: { id: { in: likedPostIds } },
        select: { categories: true, tags: true },
      });

      //Extract categories and tags from liked posts
      const likedCategories = likedPosts.flatMap((post) => post.categories);
      const likedTags = likedPosts.flatMap((post) => post.tags);

      const postSelected = contentBased(likedCategories, likedTags, allPosts);

      return res.status(200).json(postSelected);

      //return res.status(200).json(postSelected);
    } else {
      // If the user has no likes, order posts by number of likes
      allPosts.sort((a, b) => b.likes.length - a.likes.length);
      return res.status(200).json(allPosts);
    }
  }

  async categorizedPosts(
    req: Request,
    categoriesParam: ParamsCategoryDto,
    res: Response,
  ) {
    // Decode user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const userId = decodeToken.id;
    const { category, subcategory } = categoriesParam;

    // Fetch posts that match the categories and exclude those created by the user
    const allPosts = await this.prisma.posts.findMany({
      where: {
        categories: {
          some: {
            OR: [{ name: category }, { name: subcategory }],
          },
        },
        NOT: {
          createdById: decodeToken.id,
        },
      },
      include: {
        tags: true,
        categories: true,
        image: true,
        likes: true,
        createdBy: {
          select: {
            id: true,
            userName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });

    //Fetch the last 10 posts liked by the user
    const userLikes = await this.prisma.likes.findMany({
      where: { userId },
      take: 10,
      orderBy: { id: 'desc' },
      select: { postId: true },
    });

    //If the user has liked posts, generate recommendations
    if (userLikes.length > 0) {
      const likedPostIds = userLikes.map((like) => like.postId);

      // Fetch categories and tags of liked posts in a single query
      const likedPosts = await this.prisma.posts.findMany({
        where: { id: { in: likedPostIds } },
        select: { categories: true, tags: true },
      });

      //Extract categories and tags from liked posts
      const likedCategories = likedPosts.flatMap((post) => post.categories);
      const likedTags = likedPosts.flatMap((post) => post.tags);

      const postSelected = contentBased(likedCategories, likedTags, allPosts);

      return res.status(200).json(postSelected);

      //return res.status(200).json(postSelected);
    } else {
      // If the user has no likes, order posts by number of likes
      allPosts.sort((a, b) => b.likes.length - a.likes.length);
      return res.status(200).json(allPosts);
    }
  }

  async filteredPosts(
    parameters: ParamsInterface,
    req: Request,
    res: Response,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Base where clause (exclude posts created by the user)
    const baseWhere = {
      NOT: {
        createdById: decodeToken.id,
      },
    };

    // Dynamic filter conditions
    const filterConditions: Record<string, any> = {
      date: { orderBy: { publicatedAt: 'desc' } },
      state: { where: { current_condition: parameters.filter, ...baseWhere } },
      gender: { where: { gender: parameters.filter, ...baseWhere } },
      color: { where: { primary_color: parameters.filter, ...baseWhere } },
      size: { where: { size: parameters.filter, ...baseWhere } },
      brand: { where: { brand: parameters.filter, ...baseWhere } },
    };

    // Select the appropriate filter condition
    const filterCondition = filterConditions[parameters.filterName];

    if (!filterCondition) {
      throw new Error(`Invalid filter name: ${parameters.filterName}`);
    }

    // Perform the query with the selected filter condition
    const filteredPost = await this.prisma.posts.findMany(filterCondition);

    return res.status(200).json(filteredPost);
  }
}
