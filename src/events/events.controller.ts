import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getEventById(@Param('id') id: number) {
    return this.eventsService.getEventById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(@Body() createEventDto: CreateEventDto, @Req() req: Request) { 
    return this.eventsService.createEvent(createEventDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateEvent(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
