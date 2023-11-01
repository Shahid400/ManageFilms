/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { IUser, IUserLogin } from '../interfaces/user.interface';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('auth_signup')
  async signup(@Payload() payload: IUser) {
    return await this.userService.create(payload);
  }

  @MessagePattern('auth_login')
  async loginUser(@Payload() payload: IUserLogin) {
    return await this.userService.login(payload);
  }

  @MessagePattern('auth_logout_user')
  async signout(
    accessToken: string,
    tokenType: 'access_token' | 'refresh_token',
  ) {
    return this.userService.logout(accessToken, tokenType);
  }

  @MessagePattern('auth_verify_token')
  public async verifyToken(@Payload() payload: { token: string }) {
    return await this.userService.varifyToken(payload?.token);
  }

  @MessagePattern('change_password')
  public async changePassword(@Payload() payload: any) {
    return await this.userService.changePassword(payload);
  }

  @MessagePattern('update_profile')
  public async updateProfile(@Payload() payload: IUser) {
    return await this.userService.updateProfile(payload);
  }
}
