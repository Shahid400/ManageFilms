import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign, verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { hash, compare, genSalt } from 'bcrypt';
import { errorResponse, successResponse } from '../constants/response';
import {
  SALTS,
  SECRET_KEY,
  TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from '../constants/index';
import {
  DataStoredInToken,
  IUser,
  IUserLogin,
} from '../interfaces/user.interface';
import { Users, UsersModel } from '../schemas/user.schema';
import { Tokens } from '../schemas/tokens.schema';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: UsersModel,
    @InjectModel(Tokens.name) private readonly tokenModel: Model<Tokens>,
  ) {}

  // Profile Edit service

  /**
   * Create an object composed of the picked object properties
   * @param {Object} object
   * @param {string[]} keys
   * @returns {Object}
   */
  pick(object: { [x: string]: any }, keys: any[]): object {
    return keys.reduce((obj: { [x: string]: any }, key: string | number) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    }, {});
  }

  async create(payload: IUser) {
    try {
      const emailCheck: number = await this.userModel.count({
        email: payload?.email,
      });
      if (emailCheck > 0)
        throw new ConflictException(
          `This email ${payload?.email} already exists`,
        );
      const salt = await genSalt(Number(SALTS) | 10);
      const hashedPassword = await hash(payload?.password, salt);
      const userObj: any = {
        ...payload,
        passwordHash: hashedPassword,
        passwordRound: Number(SALTS) | 10,
        passwordSalt: salt,
      };
      const newUser = new this.userModel(userObj);
      await newUser.save();
      return successResponse(newUser, 'User Created Successfully', 201);
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  public async login(userData: IUserLogin) {
    try {
      const user = await this.userModel.findOne({ email: userData?.email });
      if (!user) throw new BadRequestException(`Incorrect email or password`);

      const isPasswordMatching: boolean = await compare(
        userData?.password,
        user?.passwordHash,
      );
      if (!isPasswordMatching)
        throw new BadRequestException(`Incorrect email or password`);

      const tokenData = this.createToken(user, 'local');
      const refrenceToken = await hash(tokenData?.token, 10);
      const createdToken = await this.tokenModel.create({
        token: refrenceToken,
        tokenType: 'access_token',
        data: tokenData?.token,
      });

      tokenData.token = createdToken?.token;
      if (tokenData?.refreshToken) {
        const refrenceRefreshToken = await hash(tokenData.refreshToken, 10);
        const createdRefreshToken = await this.tokenModel.create({
          token: refrenceRefreshToken,
          tokenType: 'refresh_token',
          data: tokenData?.refreshToken,
          linkedToken: createdToken?.id,
        });
        tokenData.refreshToken = createdRefreshToken.token;
      }
      return successResponse(tokenData, 'Signin Success!');
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  private createToken(user, loginType = 'local') {
    const dataStoredInToken: DataStoredInToken = {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      loginType: loginType,
    };
    const secretKey: string = SECRET_KEY;

    return {
      expiresIn: TOKEN_EXPIRY,
      token: sign(dataStoredInToken, secretKey, {
        expiresIn: TOKEN_EXPIRY,
      }),
      tokenType: 'Bearer',
      refreshToken: sign(dataStoredInToken, secretKey, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }),
      refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRY,
    };
  }

  public async logout(
    token: string,
    tokenType: 'access_token' | 'refresh_token',
  ) {
    try {
      await this.tokenModel.remove({ token: token, tokenType: tokenType });
      return successResponse(null, 'Logout successfully');
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  public async varifyToken(token: string) {
    try {
      const secretKey: string = SECRET_KEY;
      const tokenData = await this.tokenModel.findOne({
        token,
        tokenType: 'access_token',
      });
      if (!tokenData) throw new UnauthorizedException(`Invalid Token`);
      const data = tokenData?.data;
      const verificationResponse: DataStoredInToken = (await verify(
        data,
        secretKey,
      )) as DataStoredInToken;

      const user = await this.userModel.findById(verificationResponse?.id);
      if (!user) throw new UnauthorizedException(`User not found`);
      return user;
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  public async changePassword(payload: IUserLogin) {
    try {
      // generate and send otp to user's email for confirmation then if valid then proceed to reset password
      const { email, password } = payload;
      const salt = await genSalt(Number(SALTS) | 10);
      const hashedPassword = await hash(password, salt);
      const response = await this.userModel.findOneAndUpdate(
        { email },
        {
          passwordHash: hashedPassword,
        },
      );
      if (!response) throw new NotFoundException('User not found');
      return successResponse(null, 'Password reset Successfully');
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  public async updateProfile(payload: any) {
    try {
      const { userId, ...attributes } = payload;
      const response = await this.userModel.findByIdAndUpdate(
        userId,
        attributes,
      );
      if (!response) throw new NotFoundException('User not found');
      return successResponse(response, 'Profile updated!');
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }
}
