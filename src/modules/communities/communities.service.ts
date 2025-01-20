import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CommunitiesDto } from './dto/communities.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
        posts: true,
      },
    });
  }

  async createNewCommunity(community: CommunitiesDto, req: Request, res: Response) {
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
    const newCommunity = await this.prisma.communities.create({
      data: {
        name: community.name,
        description: community.description,
        creatorId: decodeToken.id,
        category: community.category,
        photo: community.photo,
      },
    });

    return res.status(201).json(newCommunity);
  }

  async editCommunity(id: string, community: CommunitiesDto, res: Response) {
   
    //Check if community exists
    const existingCommunity = await this.prisma.communities.findUnique({
      where: { id },
    });
    if (!existingCommunity) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    //Update community
    const communityEdited = await this.prisma.communities.update({
      where: { id },
      data: {
        name: community.name,
        description: community.description,
        category: community.category,
        photo: community.photo,
      },
    });

    return res.status(200).json(communityEdited);
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
