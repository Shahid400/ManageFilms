/* eslint-disable prettier/prettier */
import {
  Body,
  Get,
  Controller,
  Inject,
  Post,
  Query,
  Req,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { SERVICES } from '../constants';
import {
  CreateFilmDto,
  FilmListDto,
  RateFilmDto,
} from '../services/utils/dto/film.dto';
import { Auth } from '../decorators/auth.decorator';
@ApiTags('Films')
@Controller('film')
export class FilmController {
  constructor(
    @Inject(SERVICES.USER_SERVICE) private userServiceClient: ClientProxy,
  ) {}

  @Post()
  @Auth(true)
  @ApiBearerAuth()
  public async createFilm(@Body() payload: CreateFilmDto, @Req() req: any) {
    payload.userId = req?.tokenData?.userId;
    return await firstValueFrom(
      this.userServiceClient.send('create_film', payload).pipe(timeout(10000)),
    );
  }

  @Get('listByCategory')
  @Auth(true)
  @ApiBearerAuth()
  public async listFilm(@Query() params: FilmListDto) {
    return await firstValueFrom(
      this.userServiceClient
        .send('list_film_by_category', params)
        .pipe(timeout(10000)),
    );
  }

  @Post('/rate')
  @Auth(true)
  @ApiBearerAuth()
  public async rateFilm(@Body() payload: RateFilmDto, @Req() req: any) {
    payload.userId = req?.tokenData?.userId;
    return await firstValueFrom(
      this.userServiceClient.send('rate_film', payload),
    );
  }

  @Get('/recommended')
  @Auth(true)
  @ApiBearerAuth()
  public async recommendFilms(@Req() req: any) {
    const categories = req?.tokenData?.categories;
    return await firstValueFrom(
      this.userServiceClient.send('recommend_film', { categories }),
    );
  }

  @Get(':filmId')
  @Auth(true)
  @ApiBearerAuth()
  @ApiParam({
    name: 'filmId',
    required: true,
    example: '65412b170e54f44c67d62492',
  })
  public async getFilm(@Param('filmId') filmId: string) {
    return await firstValueFrom(
      this.userServiceClient.send('get_film', { filmId }).pipe(timeout(10000)),
    );
  }
}
