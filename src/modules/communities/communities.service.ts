import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommunitiesDto } from './dto/communities.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from "jsonwebtoken"
import { DecodeDto } from '../user/dto/user.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async getAllCommunities() {
    try {
      return await this.prisma.communities.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve communities');
    }
  }

  async createNewCommunity(community: CommunitiesDto, req: Request) {
    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    try {
      return await this.prisma.communities.create({
        data: {
          name: community.name,
          description: community.description,
          creatorId: decodeToken.id
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create community');
    }
  }

  async editCommunity(id: number, community: CommunitiesDto) {
    try {
      const existingCommunity = await this.prisma.communities.findUnique({
        where: { id },
      });
      if (!existingCommunity) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }
      return await this.prisma.communities.update({
        where: { id },
        data: {
          name: community.name,
          description: community.description,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to edit community');
    }
  }

  async deleteCommunity(id: number) {
    try {
      const existingCommunity = await this.prisma.communities.findUnique({
        where: { id },
      });
      if (!existingCommunity) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }
      return await this.prisma.communities.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete community');
    }
  }

  async searchCommunities(name: string) {
    try {
      return await this.prisma.communities.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to search communities');
    }
  }
}
