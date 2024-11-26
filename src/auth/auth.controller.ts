import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  registerUser(
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.registerUser(user, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  loginUser(
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(user, res);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  @ApiOperation({ summary: 'Google OAuth2 login' })
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    return await this.authService.googleLogin(req, res);
  }

  @Get()
  @ApiOperation({ summary: 'Logout user' })
  logoutUser(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }

  @Post('forgetPassword')
  @ApiOperation({ summary: 'Request a password reset token' })
  @ApiBody({
    schema: { type: 'object', properties: { email: { type: 'string' } } },
  })
  forgotPassword(@Body('email') email: string) {
    return this.authService.resetPasswordToken(email);
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Verify password reset token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { token: { type: 'number' }, email: { type: 'string' } },
    },
  })
  resetPassword(@Body() { token, email }: { token: number; email: string }) {
    return this.authService.resetPasswordVerification(email, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('newPassword')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
        token: { type: 'number' },
      },
    },
  })
  changePassword(@Body() { password, confirmPassword, token }) {
    return this.authService.changePassword(password, confirmPassword, token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  deleteUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.deleteUser(req, res);
  }
}
