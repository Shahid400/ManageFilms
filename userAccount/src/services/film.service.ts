import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { errorResponse, successResponse } from "../constants/response";
import { Films } from "../schemas/films.schema";
import { Ratings } from "../schemas/rating.schema";
import { RpcException } from "@nestjs/microservices";
import {
  IFilm,
  IListFilmByCategory,
  IRateFilm,
} from "../interfaces/film.interface";
@Injectable()
export class FilmService {
  constructor(
    @InjectModel(Films.name) private readonly filmModel: Model<Films>,
    @InjectModel(Ratings.name) private readonly ratingModel: Model<Ratings>
  ) {}

  async create(film: IFilm) {
    try {
      const newFilm = new this.filmModel(film);
      await newFilm.save();
      return successResponse(newFilm, "Film added Successfully", 201);
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  async getFilm(payload: { filmId: string }) {
    try {
      const { filmId } = payload;
      const response = await this.filmModel.findById({ _id: filmId });
      if (!response) throw new NotFoundException("Film not found");
      return successResponse(response, "Film Found");
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  async listFilmByCategory(payload: IListFilmByCategory) {
    try {
      const { category, page, limit } = payload;
      const skip = (page - 1) * limit;
      const [films, total] = await Promise.all([
        this.filmModel.aggregate([
          { $match: { category } },
          { $skip: skip },
          { $limit: limit },
        ]),
        this.filmModel.countDocuments({ category }),
      ]);

      const totalPages = Math.ceil(total / limit);
      if (!films?.length)
        throw new NotFoundException(`No films against category ${category}`);
      const pagination = {
        page,
        pages: totalPages,
        limit,
        total,
      };
      return successResponse({ films, pagination }, "Film list by category");
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  async rateFilm(payload: IRateFilm) {
    try {
      const { userId, filmId } = payload;
      const film = await this.filmModel.findOne({ _id: filmId });
      if (!film) throw new NotFoundException("Film not found");
      const response = await this.ratingModel
        .findOneAndUpdate({ userId, filmId }, payload, {
          new: true,
          upsert: true,
        })
        .exec();
      return successResponse(response, "Film rating added", 201);
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }

  async recommendFilms(payload: { categories: [string] }) {
    try {
      const { categories } = payload;

      // Aggregate films based on category and ratings
      const filmsAggregate = await this.filmModel.aggregate([
        {
          $match: {
            category: { $in: categories },
          },
        },
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "filmId",
            as: "ratings",
          },
        },
        {
          $addFields: {
            averageRating: {
              $avg: "$ratings.rating",
            },
            ratingCount: {
              $size: "$ratings",
            },
          },
        },
        {
          $sort: {
            averageRating: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);

      return successResponse(filmsAggregate, "Recommended Films");
    } catch (error) {
      throw new RpcException(errorResponse(error));
    }
  }
}
