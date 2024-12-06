import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtChatGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // WebSocket context
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();
      const token = client.handshake.headers.cookie
        .split('; ')
        .find((c) => c.startsWith('token='))
        ?.split('=')[1];

      if (token) {
        client.handshake.headers.authorization = `Bearer ${token}`;
      }
    }
    // HTTP context
    else {
      const request = context.switchToHttp().getRequest();
      if (request && request.cookies) {
        const token = request.cookies.token;
        if (token) {
          request.headers.authorization = `Bearer ${token}`;
        }
      }
    }
    return super.canActivate(context);
  }
}
