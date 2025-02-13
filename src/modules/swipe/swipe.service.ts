import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from '../user/dto/user.dto';
import { swipeReco } from 'src/shared/algorithms/swipeReco';
import { CategoriesDto } from '../feed/dto/feed.dto';

@Injectable()
export class SwipeService {
  constructor(private prisma: PrismaService) {}

  async swipe(req: Request, res: Response) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const userId = decodeToken.id;

    //Retrieve all posts that the user has already slipped
    const slippedPosts = await this.prisma.swipe.findMany({
      where: {
        userId: decodeToken.id,
      },
      select: {
        postId: true,
      },
      orderBy: { id: 'desc' },
    });

    //Fetch the last 10 posts liked by the user
    const userLikes = await this.prisma.likes.findMany({
      where: { userId },
      take: 5,
      orderBy: { id: 'desc' },
      select: { postId: true },
    });

    //Retrieve all posts that the user has not slipped
    const post = await this.prisma.posts.findMany({
      where: {
        NOT: {
          id: {
            in: slippedPosts.map((post) => post.postId),
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            userName: true,
            profilePicture: true,
          },
        },
        image: true,
        tags: true,
      },
    });

    let likedCategories: CategoriesDto[] = [];
    let likedTags: CategoriesDto[] = [];
    let swipedCategories: CategoriesDto[] = [];
    let swipedTags: CategoriesDto[] = [];

    if (userLikes.length >= 1) {
      const likedPostIds = userLikes.map((like) => like.postId);

      // Fetch categories and tags of liked posts in a single query
      const likedPosts = await this.prisma.posts.findMany({
        where: { id: { in: likedPostIds } },
        select: { categories: true, tags: true },
      });

      likedCategories = likedPosts.flatMap((post) => post.categories);
      likedTags = likedPosts.flatMap((post) => post.tags);
    }

    if (slippedPosts.length >= 1) {
      const swipedPostIds = slippedPosts.map((post) => post.postId);

      // Fetch categories and tags of liked posts in a single query
      const swipedPosts = await this.prisma.posts.findMany({
        where: { id: { in: swipedPostIds } },
        select: { categories: true, tags: true },
      });

      swipedCategories = swipedPosts.flatMap((post) => post.categories);
      swipedTags = swipedPosts.flatMap((post) => post.tags);
    }

    const rankedPost = swipeReco(
      likedCategories,
      likedTags,
      swipedCategories,
      swipedTags,
      post,
    );

    return res.status(200).json(rankedPost);
  }

  async swipeReaction(
    req: Request,
    postId: string,
    reaction: boolean,
    res: Response,
  ) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.swipe.create({
      data: {
        userId: decodeToken.id,
        postId,
        reaction: reaction,
      },
    });

    return res.status(200).json({ message: 'Reaction saved' });
  }
}
