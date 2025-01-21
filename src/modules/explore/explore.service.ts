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

@Injectable()
export class ExploreService {
  constructor(private prisma: PrismaService) {}

  async explore(req: Request, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Fetch all posts excluding the ones created by the user
    const allPosts = await this.prisma.posts.findMany({
      where: {
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
            qualification: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });

    // Fetch user data including likes
    const user = await this.prisma.users.findUnique({
      where: { id: decodeToken.id },
      select: { likes: true },
    });

    if (user.likes.length >= 1) {
      // Extract liked posts' categories concurrently
      const categories: CategoriesDto[] = [];
      await Promise.all(
        user.likes.map(async (like) => {
          const post = await this.prisma.posts.findUnique({
            where: { id: like.postId },
            select: { categories: true },
          });
          if (post) {
            categories.push(...post.categories);
          }
        }),
      );

      // Classify posts based on user preferences
      const postSelected = postClasification(categories, allPosts);

      // Organize posts based on the algorithm's result
      const postsOrdered = postSelected
        .map((id) => allPosts.find((post) => post.id === id))
        .filter((post) => post);

      return res.status(200).json(postsOrdered);
    } else {
      // If no likes, order posts by the number of likes
      allPosts.sort((a, b) => b.likes.length - a.likes.length);
      return res.status(200).json(allPosts);
    }
  }

  async categorizedPosts(req: Request, categoriesParam: ParamsCategoryDto, res: Response) {
    // Decode user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const { category, subcategory } = categoriesParam;

    // Fetch posts that match the categories and exclude those created by the user
    const posts = await this.prisma.posts.findMany({
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
      select: {
        id: true,
        categories: true,
      },
    });

    // Fetch user likes and extract liked post IDs
    const userLikes = await this.prisma.users.findUnique({
      where: { id: decodeToken.id },
      select: {
        likes: {
          select: {
            id: true,
          },
        },
      },
    });

    const userLikedIds = userLikes?.likes.map((like) => like.id) || [];

    // Fetch categories of liked posts in a single query
    const likedCategories = await this.prisma.posts.findMany({
      where: {
        id: { in: userLikedIds },
      },
      select: {
        categories: true,
      },
    });

    // Flatten and deduplicate liked categories
    const categories = likedCategories
      .flatMap((post) => post.categories)
      .filter(
        (category, index, self) =>
          index === self.findIndex((c) => c.id === category.id),
      );

    // Classify posts using the custom classification function
    const postSelected = postClasification(categories, posts);

    // Fetch all posts excluding those created by the user, with necessary details
    const detailedPosts = await this.prisma.posts.findMany({
      where: {
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

    // Organize posts based on classification results
    const postsOrdered = postSelected
      .map((id) => detailedPosts.find((post) => post.id === id))
      .filter(Boolean); // Remove undefined results

    return res.status(200).json(postsOrdered);
  }

  async filteredPosts(parameters: ParamsInterface, req: Request, res: Response) {
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
