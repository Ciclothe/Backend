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

    // Retrieve posts the user has already swiped (split into liked & disliked)
    const swipes = await this.prisma.swipe.findMany({
      where: { userId },
      select: { postId: true, reaction: true },
    });

    const likedPostIds = swipes
      .filter((swipe) => swipe.reaction)
      .map((swipe) => swipe.postId);
    const dislikedPostIds = swipes
      .filter((swipe) => !swipe.reaction)
      .map((swipe) => swipe.postId);

    // Fetch categories & tags of liked/disliked posts in one query
    const interactionPosts = await this.prisma.posts.findMany({
      where: { id: { in: [...likedPostIds, ...dislikedPostIds] } },
      select: { id: true, categories: true, tags: true },
    });

    let likedCategories: CategoriesDto[] = [];
    let likedTags: CategoriesDto[] = [];
    let dislikedCategories: CategoriesDto[] = [];
    let dislikedTags: CategoriesDto[] = [];

    interactionPosts.forEach((post) => {
      if (likedPostIds.includes(post.id)) {
        likedCategories.push(...post.categories);
        likedTags.push(...post.tags);
      }
      if (dislikedPostIds.includes(post.id)) {
        dislikedCategories.push(...post.categories);
        dislikedTags.push(...post.tags);
      }
    });

    // Fetch new posts that the user hasn't swiped yet
    const posts = await this.prisma.posts.findMany({
      where: { id: { notIn: [...likedPostIds, ...dislikedPostIds] } },
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
      take: 10, // Fetch extra posts for better ranking
    });

    // Rank posts based on swipe recommendations
    const rankedPosts = swipeReco(
      likedCategories,
      likedTags,
      dislikedCategories,
      dislikedTags,
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
