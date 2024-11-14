import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { Request } from 'express';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    //TODO: Implement pagination and algorithm to retrieve top events
    //Search all events
    return this.prisma.events.findMany();
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

  async createEvent(createEventDto: CreateEventDto, req: Request) {

    //Verify if the event already exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { name: createEventDto.name },
    });
    if (existingEvent) {
      throw new Error(`Event with name ${createEventDto.name} already exists`);
    }

    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;
    
    createEventDto.creatorId = decodeToken.id;

    //Create event
    return this.prisma.events.create({
      data: createEventDto,
    });
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {

    id = Number(id);

    //Check if event exists
    const existingEvent = await this.prisma.events.findUnique({ where: { id } });
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
    const existingEvent = await this.prisma.events.findUnique({ where: { id } });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Delete event
    return this.prisma.events.delete({
      where: { id },
    });
  }
}