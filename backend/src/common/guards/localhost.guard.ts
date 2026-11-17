import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/** Only allows requests from the same machine (admin-only internal routes) */
@Injectable()
export class LocalhostGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip =
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.socket.remoteAddress;
    // In production behind a proxy, internal routes should be protected differently
    return ip === '127.0.0.1' || ip === '::1' || process.env.NODE_ENV !== 'production';
  }
}
