import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.registerUser(user, res);
  }

  @Post('login')
  loginUser(
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(user, res);
  }

  @Get()
  logoutUser(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }

  @Post('forgetPassword')
  forgotPassword(@Body('email') email: string) {
    return this.authService.resetPasswordToken(email);
  }

  @Post('resetPassword')
  resetPassword(@Body() { token, email }: { token: number; email: string }) {
    return this.authService.resetPasswordVerification(email, token);
  }

  @Post('newPassword')
  changePassword(@Body() { password, confirmPassword, token }) {
    return this.authService.changePassword(password, confirmPassword, token);
  }

  @Delete()
  deleteUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.deleteUser(req, res);
  }
}
