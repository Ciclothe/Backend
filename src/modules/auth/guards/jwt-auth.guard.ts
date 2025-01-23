import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request && request.cookies) {
      const token = request.cookies.token;

      if (token) {
        request.headers.authorization = `Bearer ${token}`;
      }
    }
    return super.canActivate(context);
  }
}
