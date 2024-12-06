import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation ({summary: 'Get all events'})
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation ({summary: 'Get event by id'})
  @ApiParam({name: 'id', type: 'string'})
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation ({summary: 'Create event'})
  createEvent(@Body() createEventDto: CreateEventDto, @Req() req: Request) { 
    return this.eventsService.createEvent(createEventDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation ({summary: 'Update event'})
  @ApiParam({name: 'id', type: 'string'})
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation ({summary: 'Delete event'})
  @ApiParam({name: 'id', type: 'string'})
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
