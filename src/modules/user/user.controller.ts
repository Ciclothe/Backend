import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ChangeDto, ChangeSensitiveInformationDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: 'Get user name' })
  getUser(@Req() req: Request, @Res() res: Response) {
    return this.userService.getUserName(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserInfo')
  @ApiOperation({ summary: 'Get user info' })
  getUserInfo(@Req() req: Request, @Res() res: Response) {
    return this.userService.userInfo(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rating')
  @ApiOperation({ summary: 'Rate user' })
  @ApiBody({
    schema: {
      properties: {
        qualifiedUserId: { type: 'string' },
        rating: { type: 'number' },
      },
    },
  })
  rating(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    { qualifiedUserId, rating }: { qualifiedUserId: string; rating: number },
  ) {
    return this.userService.rating(req, res, qualifiedUserId, rating);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePhoto'))
  @Patch()
  @ApiOperation({ summary: 'Edit user info' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
    },
  })
  editUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() { name, firstName, lastName },
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    //Save the info from the Body to an object
    const infoToUpdate: ChangeDto = {
      name,
      firstName,
      lastName,
    };

    return this.userService.updateUserInfo(
      req,
      res,
      infoToUpdate,
      profilePhoto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('privateInfo')
  @ApiOperation({ summary: 'Edit user sensitive info' })
  @ApiBody({
    schema: {
      properties: {
        password: { type: 'string' },
        email: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  editSesnsitiveUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() infoToUpdate: ChangeSensitiveInformationDto,
  ) {
    return this.userService.updateSesitiveUserInfo(req, res, infoToUpdate);
  }
}
