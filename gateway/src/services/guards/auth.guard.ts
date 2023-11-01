import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );
    if (!secured) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;

    if (!authorization) {
      throw new HttpException(
        {
          message: 'Authorization Token missing',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorization?.split(' ')?.[1];
    // check token from other microservice
    const userTokenInfo = await firstValueFrom(
      this.userServiceClient.send('auth_verify_token', {
        token,
      }),
    );

    if (!userTokenInfo)
      throw new HttpException(
        {
          message: 'Invalid Token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    request.tokenData = {
      userId: userTokenInfo?._id,
      name: userTokenInfo?.name,
      email: userTokenInfo?.email,
      categories: userTokenInfo?.categories,
      token: token,
    };
    return true;
  }
}
