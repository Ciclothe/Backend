import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { Request, Response } from 'express';
import { DecodeDto } from 'src/modules/user/dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ltdAndLong } from 'src/shared/utils/geocoding/geocoding';
import { NotificationsService } from '../notifications/notifications.service';
import {
  NotificationPayload,
  NotificationType,
} from '../notifications/types/notifications';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  async getAllEvents() {
    //TODO: Implement pagination and algorithm to retrieve top events
    //Search all events
    return await this.prisma.events.findMany({
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

  async getEventById(id: string, res: Response) {
    //Search event by id
    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    //If event not found, throw error
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Return event
    return res.status(200).json(event);
  }

  async createEvent(createEvent: CreateEventDto, req: Request, res: Response) {
    //if the events is presencial
    if (createEvent.address) {
      const geocoding = await ltdAndLong(
        createEvent.address,
        createEvent.postalCode,
      );
      createEvent.longitude = geocoding.lng;
      createEvent.latitude = geocoding.lat;
    }

    //Retrieve user id from token
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.decode(token) as DecodeDto;

    createEvent.creatorId = decodeToken.id;

    //Create event
    const event = await this.prisma.events.create({
      data: {
        creatorId: createEvent.creatorId,
        name: createEvent.name,
        description: createEvent.description,
        maxClothes: createEvent.maxClothes,
        Date: createEvent.Date,
        latitude: createEvent.latitude,
        longitude: createEvent.longitude,
        type: createEvent.type,
        theme: createEvent.theme,
        maximumCapacity: createEvent.maximumCapacity,
        photo: createEvent.photo,
      },
      select: {
        id: true,
      },
    });

    const follower = await this.prisma.follow.findMany({
      where: {
        followedById: decodeToken.id,
      },
      select: {
        followerById: true,
      },
    });

    // create the notification payload
    const notificationPayload: NotificationPayload = {
      userId: follower.map((f) => f.followerById),
      fromUserId: decodeToken.id,
      type: 'event',
      content: NotificationType.EVENT,
      relatedEventId: event.id,
    };

    await this.notificationService.createNotification(notificationPayload, res);

    return res.status(200).json('Event created successfully');
  }

  async updateEvent(id: string, updateEvent: UpdateEventDto, res: Response) {
    //Check if event exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Update event
    const eventEdited = await this.prisma.events.update({
      where: { id },
      data: updateEvent,
    });

    return res.status(200).json(eventEdited);
  }

  async deleteEvent(id: string) {
    //Check if event exists
    const existingEvent = await this.prisma.events.findUnique({
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    //Delete event
    return await this.prisma.events.delete({
      where: { id },
    });
  }
}
