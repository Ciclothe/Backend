import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  CategoriesDto,
  PublicationsDto,
  UserPublicationDto,
} from '../feed/dto/feed.dto';
import { DecodeDto } from '../user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { postClasification } from 'src/shared/utils/postClasification';
import { ParamsCategoryDto } from './dto/explore.dto';
import { ParamsInterface } from './types/explore';

@Injectable()
export class ExploreService {
  constructor(private prisma: PrismaService) {}

  //TODO: refactor this function
  async explore(req: Request) {
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

      posts.sort((a, b) => b.likes.length - a.likes.length);

      return posts;
    }
  }

  //TODO: refactor this function
  async categorizedPublications(
    req: Request,
    categoriesParam: ParamsCategoryDto,
  ) {
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

  //TODO: refactor this function
  async filteredPublications(parameters: ParamsInterface, req: Request) {
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
