import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilmService } from '../services/film.service';
import { IFilm, IListFilmByCategory, IRateFilm } from '../interfaces/film.interface';

@Controller()
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @MessagePattern('create_film')
  async createFilm(@Payload() payload: IFilm) {
    return await this.filmService.create(payload);
  }

  @MessagePattern('get_film')
  async getFilm(@Payload() payload: { filmId: string }) {
    return await this.filmService.getFilm(payload);
  }

  @MessagePattern('list_film_by_category')
  async listFilmByCategory(@Payload() payload: IListFilmByCategory) {
    return await this.filmService.listFilmByCategory(payload);
  }

  @MessagePattern('rate_film')
  async rateFilm(@Payload() payload: IRateFilm) {
    return await this.filmService.rateFilm(payload);
  }

  @MessagePattern('recommend_film')
  async recommendFilms(@Payload() payload: { categories: [string] }) {
    return await this.filmService.recommendFilms(payload);
  }
}
