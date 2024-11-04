import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { typesData, genres, categoriesData } from './data/db-data';

@Injectable()
export class PostsFrontService {
  constructor(private prisma: PrismaService) {}

  //Development only
  async createData() {
    for (const genre of genres) {
      await this.prisma.frontGenre.create({
        data: {
          genre: genre.name,
          icon: genre.icon,
        },
      });
    }

    for (const typeData of typesData) {
      for (const type of typeData.categories) {
        await this.prisma.frontProductType.create({
          data: {
            genre: typeData.genre,
            type: type.type,
            icon: type.icon,
          },
        });
      }
    }

    const typesId = await this.prisma.frontProductType.findMany({
      select: {
        id: true,
      },
    });

    let index = 0;

    for (const categoryData of categoriesData) {
      const typeId = typesId[index].id;
      index++;

      for (const category of categoryData.categories) {
        await this.prisma.frontCategories.create({
          data: {
            typeId: typeId,
            categories: category,
            icon: '',
          },
        });
      }
    }
  }

  async genreSelection() {
    const genres = await this.prisma.frontGenre.findMany({
      select: {
        id: true,
        genre: true,
        icon: true,
      },
    });

    return genres;
  }

  async typeSelection(genre: string) {
    const type = await this.prisma.frontProductType.findMany({
      where: {
        genre,
      },
      select: {
        id: true,
        type: true,
        icon: true,
      },
    });

    return type;
  }

  async categorySelection(typeId: number) {
    const categories = await this.prisma.frontCategories.findMany({
      where: {
        FrontProductType: { id: typeId },
      },
      select: {
        id: true,
        categories: true,
        icon: true,
      },
    });

    return categories;
  }
}
