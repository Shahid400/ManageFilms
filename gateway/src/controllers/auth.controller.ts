/* eslint-disable prettier/prettier */
import { Body, Controller, Inject, Post, Get, Req, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { SERVICES } from '../constants';
import {
  CreateUserDto,
  LoginUserDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from '../services/utils/dto/user.dto';
import { IAuthorizedRequest } from '../services/utils/interfaces/auth.interface';
import { Auth } from '../decorators/auth.decorator';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.USER_SERVICE) private userServiceClient: ClientProxy,
  ) {}

  @Post('/signup')
  public async createUser(@Body() payload: CreateUserDto) {
    return await firstValueFrom(
      this.userServiceClient.send('auth_signup', payload).pipe(timeout(10000)),
    );
  }

  @Post('/login')
  public async loginUser(@Body() payload: LoginUserDto) {
    return await firstValueFrom(
      this.userServiceClient.send('auth_login', payload).pipe(timeout(10000)),
    );
  }

  @Get('/logout')
  @Auth(true)
  @ApiBearerAuth()
  async logout(@Req() req: IAuthorizedRequest) {
    return await firstValueFrom(
      this.userServiceClient
        .send('auth_logout', {
          token: req?.tokenData?.token,
        })
        .pipe(timeout(10000)),
    );
  }

  @Put('/changePassword')
  @Auth(true)
  @ApiBearerAuth()
  public async changePassword(
    @Body() payload: ChangePasswordDto,
    @Req() req: IAuthorizedRequest,
  ) {
    payload.email = req?.tokenData?.email;
    return await firstValueFrom(
      this.userServiceClient
        .send('change_password', payload)
        .pipe(timeout(10000)),
    );
  }

  @Put('/updateProfile')
  @Auth(true)
  @ApiBearerAuth()
  public async updateProfile(
    @Body() payload: UpdateProfileDto,
    @Req() req: IAuthorizedRequest,
  ) {
    payload.userId = req?.tokenData?.userId;
    return await firstValueFrom(
      this.userServiceClient
        .send('update_profile', payload)
        .pipe(timeout(10000)),
    );
  }
}
