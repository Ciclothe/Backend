import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CommunitiesDto } from './dto/communities.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodeDto } from '../user/dto/user.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async getAllCommunities() {
    //TODO: Implement pagination and algorithm to retrieve top communities
    return await this.prisma.communities.findMany({
      include: {
        creator: {
          select: {
            id: true,
            userName: true,
            email: true,
            profilePicture: true,
          },
        },
        members: {
          select: {
            id: true,
            userName: true,
            email: true,
            profilePicture: true,
          },
        },
        publications: true,
      },
    });
  }

  async createNewCommunity(community: CommunitiesDto, req: Request) {
    // Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    // Check if the community name is already used
    const existingCommunity = await this.prisma.communities.findUnique({
      where: { name: community.name },
    });
    if (existingCommunity) {
      throw new Error(`Community with name ${community.name} already exists`);
    }

    // Create new community
    return this.prisma.communities.create({
      data: {
        name: community.name,
        description: community.description,
        creatorId: decodeToken.id,
        category: community.category,
        photo: community.photo,
      },
    });
  }

  async editCommunity(id: string, community: CommunitiesDto) {
   
    //Check if community exists
    const existingCommunity = await this.prisma.communities.findUnique({
      where: { id },
    });
    if (!existingCommunity) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    //Update community
    return await this.prisma.communities.update({
      where: { id },
      data: {
        name: community.name,
        description: community.description,
        category: community.category,
        photo: community.photo,
      },
    });
  }

  async deleteCommunity(id: string) {

    //Check if community exists
    const existingCommunity = await this.prisma.communities.findUnique({
      where: { id },
    });
    if (!existingCommunity) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    //Delete community
    return await this.prisma.communities.delete({
      where: { id },
    });
  }
}
