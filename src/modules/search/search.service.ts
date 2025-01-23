import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { postClasification } from 'src/shared/utils/postClasification';
import {
  CategoriesDto,
  DecodeDto,
} from '../feed/dto/feed.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchPosts(
    req: Request,
    res: Response,
    search: string,
    lat?: number,
    lng?: number,
    radius?: string
  ) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.searchHistorial.create({
      data: {
        searchedById: decodeToken.id,
        search,
      },
    });

    if (lat && lng && radius) {
     
      const distanceInMeters = parseFloat(radius) * 1000; // Convert km to meters

      const posts = await this.prisma.$queryRaw`
        SELECT *, 
               ST_Distance_Sphere(
                 POINT(longitude, latitude), 
                 POINT(${lng}, ${lat})
               ) AS distance
        FROM posts
        WHERE 
          ST_Distance_Sphere(POINT(longitude, latitude), POINT(${lng}, ${lat})) <= ${distanceInMeters}
          AND (title LIKE ${`%${search}%`} OR description LIKE ${`%${search}%`})
          AND NOT (createdById = ${decodeToken.id})
        ORDER BY distance ASC;
      `;

      return res.status(200).json(posts);
    }

    // Find posts that match with the search
    const searchPosts = this.prisma.posts.findMany({
      where: {
        title: {
          contains: search,
          // mode: 'insensitive',
        },
        createdById: {
          not: decodeToken.id,
        }
      },
      select: {
        id: true,
        categories: {
          select: {
            name: true,
          },
        },
      },
    });

    // Search categories that match with the search
    const categories = await this.prisma.categories.findMany({
      where: {
        name: search,
      },
      select: {
        posts: {
          select: {
            id: true,
            categories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Search tags that match with the search
    const tags = await this.prisma.tags.findMany({
      where: {
        name: search,
      },
      select: {
        posts: {
          select: {
            id: true,
            categories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!categories[0] && !tags[0] && !searchPosts[0]) {
      return res.status(404).json({ message: 'No posts found' });
    }

    //Save all the posts in an array
    const allPosts = [].concat(
      searchPosts,
      categories[0].posts,
      tags[0].posts,
    );

    const post = [];

    //Delete duplicated posts
    allPosts.forEach((publication) => {
      // Search if the post is already in the array
      const findIndex = post.findIndex(
        (item) => item.id === publication.id,
      );

      if (findIndex === -1) {
        // If is not, save the post in the array
        post.push({
          id: publication.id,
          categories: publication.categories,
        });
      }
    });

    //Search the user and save his reactions
    const user = await this.prisma.users.findMany({
      where: {
        id: decodeToken.id,
      },
      select: {
        likes: true,
      },
    });

    const userReactions = user[0].likes;

    const userCategories: CategoriesDto[] = [];

    //Search all the post liked by the user, and save the categories
    for (let i = 0; i < userReactions.length; i++) {
      const postsCategories = await this.prisma.posts.findMany({
        where: {
          id: userReactions[i].postId,
          createdById: {  
            not: decodeToken.id
          }
        },
        select: {
          id: true,
          categories: true,
        },
      });

      userCategories.push(...postsCategories[0].categories);
    }

    const postSelected = postClasification(userCategories, post);

    const posts = await this.prisma.posts.findMany();

    const postsOrdered: any[] = [];

    //Organize posts depending on the algorithm result
    postSelected.forEach((id) => {
      const post = posts.find((post) => post.id === id);

      if (post) {
        postsOrdered.push(post);
      }
    });

    return res.status(200).json(postsOrdered);
  }

  async searchEvents(
    req: Request,
    res: Response,
    search: string,
    lat?: number,
    lng?: number,
    radius?: string,
  ) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.searchHistorial.create({
      data: {
        searchedById: decodeToken.id,
        search,
      },
    });

    if (lat && lng && radius) {

      const distanceInMeters = parseFloat(radius) * 1000; // Convert km to meters
      const events = await this.prisma.$queryRaw`
        SELECT *, 
               ST_Distance_Sphere(
                 POINT(longitude, latitude), 
                 POINT(${lng}, ${lat})
               ) AS distance
        FROM events
        WHERE 
          ST_Distance_Sphere(POINT(longitude, latitude), POINT(${lng}, ${lat})) <= ${distanceInMeters}
        ORDER BY distance ASC;
      `;
      return res.status(200).json(events);
    }

    const events = await this.prisma.events.findMany({
      where: {
        name: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });

    return res.status(200).json(events);
  }

  async searchCommunities(req: Request, search: string, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.searchHistorial.create({
      data: {
        searchedById: decodeToken.id,
        search,
      },
    });

     const communities = await this.prisma.communities.findMany({
      where: {
        name: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });

    return res.status(200).json(communities);
  }

  async searchUsers(req: Request, search: string, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    await this.prisma.searchHistorial.create({
      data: {
        searchedById: decodeToken.id,
        search,
      },
    });

    const users = await this.prisma.users.findMany({
      where: {
        userName: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });

    return res.status(200).json(users);
  }

  async getSearchHistory(req: Request, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Search the history of the user withouth duplicates
    const history = await this.prisma.$queryRaw`
      SELECT search, MAX(searchedAt) AS latestSearchedAt
      FROM searchhistorial
      WHERE searchedById = ${decodeToken.id}
      GROUP BY search
      ORDER BY latestSearchedAt DESC;
    `;

    return res.status(200).json(history);
  }

  async deleteSearch(search: string, req: Request, res: Response) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Search the id of the search
    const id = await this.prisma.searchHistorial.findFirst({
      where: {
        searchedById: decodeToken.id,
        search,
      },
      select: {
        id: true,
      },
    });

    // Delete the search
    await this.prisma.searchHistorial.delete({
      where: {
        id: id.id,
      },
    });

    return res.status(200).json({ message: 'Search deleted' });
  }

  async deleteSearchHistory(req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Delete all the user history
    await this.prisma.searchHistorial.deleteMany({
      where: {
        searchedById: decodeToken.id,
      },
    });
  }
}
