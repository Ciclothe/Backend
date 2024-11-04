import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ChangeDto, ChangeSensitiveInformationDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@Req() req: Request) {
    return this.userService.getUserName(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserInfo')
  getUserInfo(@Req() req: Request) {
    return this.userService.userInfo(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rating')
  rating(@Req() req: Request, @Body(){qualifiedUserId, rating}: {qualifiedUserId: number, rating: number}) {
    return this.userService.rating(req, qualifiedUserId, rating);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePhoto'))
  @Patch()
  editUserInfo(
    @Req() req: Request,
    @Body() { name, firstName, lastName },
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    //Save the info from the Body to an object
    const infoToUpdate: ChangeDto = {
      name,
      firstName,
      lastName,
    };

    return this.userService.updateUserInfo(req, infoToUpdate, profilePhoto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('privateInfo')
  editSesnsitiveUserInfo(
    @Req() req: Request,
    @Body() infoToUpdate: ChangeSensitiveInformationDto,
  ) {
    return this.userService.updateSesitiveUserInfo(req, infoToUpdate);
  }

  
}

