import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { SearchIdDto } from './dto/search.dto';
import { postClasification } from 'src/utils/postClasification';
import {
  CategoriesDto,
  DecodeDto,
  PublicationsDto,
  UserPublicationDto,
} from '../home/dto/home.dto';
import { ltdAndLong } from 'src/utils/LtdAndLong';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchPublications(req: Request, search: string) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Save the search in the history if it doesn't exist
    const existingSearch = await this.prisma.searchHistorial.findFirst({
      where: {
        searchedById: decodeToken.id,
        search,
      },
    });

    if (!existingSearch) {
      await this.prisma.searchHistorial.create({
        data: {
          searchedById: decodeToken.id,
          search,
        },
      });
    }

    // Find publications that match with the search
    const searchPublications = this.prisma.publications.findMany({
      where: {
        title: {
          contains: search,
          // mode: 'insensitive',
        },
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
        publications: {
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
        publications: {
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

    if (!categories[0] && !tags[0] && !searchPublications[0]) {
      return 'No results found';
    }

    //Save all the publications in an array
    const allPublications = [].concat(
      searchPublications,
      categories[0].publications,
      tags[0].publications,
    );

    const publications: PublicationsDto[] = [];

    //Delete duplicated publications
    allPublications.forEach((publication) => {
      // Search if the publication is already in the array
      const findIndex = publications.findIndex(
        (item) => item.id === publication.id,
      );

      if (findIndex === -1) {
        // If is not, save the publication in the array
        publications.push({
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

    const userReactions = user[0].likes as UserPublicationDto[];

    const userCategories: CategoriesDto[] = [];

    //Search all the publications liked by the user, and save the categories
    for (let i = 0; i < userReactions.length; i++) {
      const publicationsCategories = await this.prisma.publications.findMany({
        where: {
          id: userReactions[i].publicationId,
        },
        select: {
          id: true,
          categories: true,
        },
      });

      userCategories.push(...publicationsCategories[0].categories);
    }

    const postSelected = postClasification(userCategories, publications);

    const posts = await this.prisma.publications.findMany();

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

  async searchEvents(req: Request, search: string, addres?: string, postalCode?: string, radius?: string) {

    if(addres && postalCode && radius){
      const geocoding = await ltdAndLong(addres, postalCode);
      const lng = geocoding.lng;
      const lat = geocoding.lat;
    }

    return this.prisma.events.findMany({
      where: {
        name: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });
  }

  async searchCommunities(req: Request, search: string) {
    return this.prisma.communities.findMany({
      where: {
        name: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });
  }

  async searchUsers(req: Request, search: string) {
    return this.prisma.users.findMany({
      where: {
        userName: {
          contains: search,
          // mode: 'insensitive',
        },
      },
    });
  }

  async deleteSearch(search: string, req: Request) {
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

    return true;
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
