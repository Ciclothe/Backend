import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { ParamsCategoryDto, type DecodeDto } from './dto/home.dto';
import {
  CategoriesDto,
  PublicationsDto,
  type UserPublicationDto,
} from './dto/home.dto';
import { postClasification } from 'src/utils/postClasification';
import { Brand, Color, Gender, Params, Size, User } from './types/home';
import { mostLiked } from 'src/utils/mostLiked';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async homePost(req: Request) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const followedUsersPost = await this.prisma.users.findMany({
      where: {
        following: {
          some: {
            followedById: decodeToken.id,
          },
        },
      },
      select: {
        publications: {
          orderBy: {
            publicatedAt: 'desc',
          },
          include: {
            tags: true,
            categories: true,
            image: true,
            likes: true,
            _count: {
              select: {
                views: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                userName: true,
                profilePhoto: true,
                qualification: true,
              },
            },
          },
        },
      },
    });

    const allPublications = followedUsersPost.flatMap(
      (user) => user.publications,
    );

    return allPublications;
  }

  async getPost(req: Request) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    //Search the publications and save the id and the category
    const publications: PublicationsDto[] =
      await this.prisma.publications.findMany({
        where: {
          NOT: {
            createdById: decodeToken.id,
          },
        },
        select: {
          id: true,
          categories: true,
        },
      });
    //Search the user and save his likes
    const user = await this.prisma.users.findUnique({
      where: {
        id: decodeToken.id,
      },
      select: {
        likes: true,
      },
    });

    if (user.likes.length >= 1) {
      const userLikes = user.likes as UserPublicationDto[];

      const categories: CategoriesDto[] = [];

      //Search all the publications liked by the user, and save the categories
      for (let i = 0; i < userLikes.length; i++) {
        const publicationsCategories = await this.prisma.publications.findMany({
          where: {
            id: userLikes[i].publicationId,
          },
          select: {
            categories: true,
          },
        });

        categories.push(...publicationsCategories[0].categories);
      }

      const postSelected = postClasification(categories, publications);

      const posts = await this.prisma.publications.findMany({
        where:{
          NOT:{
            createdById: decodeToken.id
          }
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
              profilePhoto: true,
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

      const postsOrdered: any[] = [];

      //Organize posts depending on the algorithm result
      postSelected.forEach((id) => {
        const post = posts.find((post) => post.id === id);

        if (post) {
          postsOrdered.push(post);
        }
      });

      return postsOrdered;
    } else {
      const posts = await this.prisma.publications.findMany({
        where:{
          NOT:{
            createdById: decodeToken.id
          }
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
              profilePhoto: true,
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

      const postsOrdered = [];

      posts.sort((a, b) => b.likes.length - a.likes.length);

      return posts;
    }
  }

  async categoryPost(req: Request, categoriesParam: ParamsCategoryDto) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    const { category, subcategory } = categoriesParam;

    const publications = await this.prisma.publications.findMany({
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

    //Search the user and save his reactions
    const user = await this.prisma.users.findMany({
      where: {
        id: decodeToken.id,
      },
      select: {
        likes: true,
      },
    });

    const userReactions = user[0].likes as UserPublicationDto[];

    const categories: CategoriesDto[] = [];

    //Search all the publications liked by the user, and save the categories
    for (let i = 0; i < userReactions.length; i++) {
      const publicationsCategories = await this.prisma.publications.findMany({
        where: {
          id: userReactions[i].id,
        },
        select: {
          categories: true,
        },
      });

      categories.push(...publicationsCategories[0].categories);
    }

    const postSelected = postClasification(categories, publications);

    const posts = await this.prisma.publications.findMany({
      where:{
        NOT:{
          createdById: decodeToken.id
        }
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
            profilePhoto: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    });

    const postsOrdered: any[] = [];

    //Organize posts depending on the algorithm result
    postSelected.forEach((id) => {
      const post = posts.find((post) => post.id === id);

      if (post) {
        postsOrdered.push(post);
      }
    });

    return postsOrdered;
  }

  async recommendedProfiles(req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    const user = await this.prisma.users.findFirst({
      where: {
        id: decodeToken.id,
      },
      select: {
        following: true,
      },
    });

    const followingIds = user.following.map((follow) => follow.followedById);

    if (followingIds.length >= 1) {
      const followingUsers = await this.prisma.follow.findMany({
        where: {
          followerById: {
            in: followingIds,
          },
        },
        select: {
          followed: {
            select: {
              id: true,
              userName: true,
              profilePhoto: true,
              totalLikes: true,
              country: true,
              city: true,
            },
          },
        },
      });

      let filterFollowingUsers: User[] = followingUsers.map(
        (item) => item.followed,
      );
      filterFollowingUsers = filterFollowingUsers.filter(
        (user) => user.id !== decodeToken.id,
      );

      for (let i = 0; i < followingIds.length; i++) {
        filterFollowingUsers = filterFollowingUsers.filter(
          (user) => user.id !== followingIds[i],
        );
      }

      const mostLikedUsers = mostLiked(filterFollowingUsers);

      return mostLikedUsers;
    } else {
      const users: User[] = await this.prisma.users.findMany({
        where: {
          NOT: {
            id: decodeToken.id,
          },
        },
        select: {
          id: true,
          userName: true,
          profilePhoto: true,
          totalLikes: true,
          country: true,
          city: true,
        },
      });

      const mostLikedUsers = mostLiked(users);

      return mostLikedUsers;
    }
  }

  async filteredPost(parameters: Params, req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    if (parameters.filterName === 'date') {
      return await this.prisma.publications.findMany({
        where: {
          NOT: {
            createdById: decodeToken.id,
          },
        },
        orderBy: {
          publicatedAt: 'desc',
        },
      });
    } else if (parameters.filterName === 'state') {
      return await this.prisma.publications.findMany({
        where: {
          current_condition: parameters.filter,
          NOT: {
            createdById: decodeToken.id,
          },
        },
      });
    } else if (parameters.filterName == 'gender') {
      return await this.prisma.publications.findMany({
        where: {
          gender: parameters.filter,
          NOT: {
            createdById: decodeToken.id,
          },
        },
      });
    } else if (parameters.filterName == 'color') {
      return await this.prisma.publications.findMany({
        where: {
          primary_color: parameters.filter,
          NOT: {
            createdById: decodeToken.id,
          },
        },
      });
    } else if (parameters.filterName == 'size') {
      return await this.prisma.publications.findMany({
        where: {
          size: parameters.filter,
          NOT: {
            createdById: decodeToken.id,
          },
        },
      });
    } else if (parameters.filterName == 'brand') {
      return await this.prisma.publications.findMany({
        where: {
          brand: parameters.filter,
          NOT: {
            createdById: decodeToken.id,
          },
        },
      });
    }
  }
}
