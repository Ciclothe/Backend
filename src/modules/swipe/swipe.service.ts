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
    // Retrieve user ID from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const userId = decodeToken.id;

    // Retrieve all posts that the user has already swiped
    const swipedPosts = await this.prisma.swipe.findMany({
      where: { userId },
      select: { postId: true },
    });

    const swipedPostIds = swipedPosts.map((swipe) => swipe.postId);

    // Fetch the last 5 posts liked by the user
    const userLikes = await this.prisma.likes.findMany({
      where: { userId },
      take: 5,
      orderBy: { id: 'desc' },
      select: { postId: true },
    });

    const likedPostIds = userLikes.map((like) => like.postId);

    // Fetch categories & tags of both liked and swiped posts in a single query
    const interactionPosts = await this.prisma.posts.findMany({
      where: { id: { in: [...likedPostIds, ...swipedPostIds] } },
      select: { id: true, categories: true, tags: true },
    });

    // Separate categories & tags into liked and swiped
    let likedCategories: CategoriesDto[] = [];
    let likedTags: CategoriesDto[] = [];
    let swipedCategories: CategoriesDto[] = [];
    let swipedTags: CategoriesDto[] = [];

    interactionPosts.forEach((post) => {
      if (likedPostIds.includes(post.id)) {
        likedCategories.push(...post.categories);
        likedTags.push(...post.tags);
      }
      if (swipedPostIds.includes(post.id)) {
        swipedCategories.push(...post.categories);
        swipedTags.push(...post.tags);
      }
    });

    // Fetch posts that the user hasn't swiped yet
    const posts = await this.prisma.posts.findMany({
      where: { id: { notIn: swipedPostIds } },
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

    // Rank posts based on swipe recommendations
    const rankedPosts = swipeReco(
      likedCategories,
      likedTags,
      swipedCategories,
      swipedTags,
      posts,
    );

    return res.status(200).json(rankedPosts);
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
