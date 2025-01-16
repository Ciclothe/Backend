import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

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
    @Body() user: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(user, res);
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
  changePassword(@Body() { password, confirmPassword, token }, @Res() res: Response) {
    return this.authService.changePassword(password, confirmPassword, token, res);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  deleteUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.deleteUser(req, res);
  }
}
