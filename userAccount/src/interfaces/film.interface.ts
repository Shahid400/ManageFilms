export interface IFilm {
  userId?: string;
  name: string;
  description?: string;
  releaseDate: string;
  category: [string];
}
export interface IRateFilm {
  userId: string;
  filmId: string;
  rating: number;
}
export interface IListFilmByCategory {
  category: string;
  page: number;
  limit: number;
}
