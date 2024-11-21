import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { Request } from 'express';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { ltdAndLong } from 'src/utils/LtdAndLong';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    //TODO: Implement pagination and algorithm to retrieve top events
    //Search all events
    return this.prisma.events.findMany({
      include: {
        creator: {
          select: {
            id: true,
            userName: true,
            email: true,
            profilePhoto: true,
          },
        },
        members: {
          select: {
            id: true,
            userName: true,
            email: true,
            profilePhoto: true,
          },
        },
        publications: true,
      },
    });
  }

  async getEventById(id: number) {
    id = Number(id);

    //Search event by id
    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    //If event not found, throw error
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Return event
    return event;
  }

  async createEvent(createEvent: CreateEventDto, req: Request) {
    //Verify if the event already exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { name: createEvent.name },
    });
    if (existingEvent) {
      throw new Error(`Event with name ${createEvent.name} already exists`);
    }

    //if the events is presencial
    if(createEvent.addres){

      const geocoding = await ltdAndLong(createEvent.addres, createEvent.postalCode);
      createEvent.longitude = geocoding.lng;
      createEvent.latitude = geocoding.lat;

    }

    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    createEvent.creatorId = decodeToken.id;

    //Create event
    return this.prisma.events.create({
      data: {
        creatorId: createEvent.creatorId,
        name: createEvent.name,
        description: createEvent.description,
        maxClothes: createEvent.maxClothes,
        Date: createEvent.Date,
        addres: createEvent.addres,
        latitude: createEvent.latitude,
        longitude: createEvent.longitude,
        type: createEvent.type,
        theme: createEvent.theme,
        maximumCapacity: createEvent.maximumCapacity,
      },
    });
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    id = Number(id);

    //Check if event exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Update event
    return this.prisma.events.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async deleteEvent(id: number) {
    id = Number(id);

    //Check if event exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Delete event
    return this.prisma.events.delete({
      where: { id },
    });
  }
}
