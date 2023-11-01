import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsISO8601,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { FilmCategory, RatingEnum } from '../enums';
import { Type } from 'class-transformer';

export class CreateFilmDto {
  @ApiProperty({
    example: 'John Wick',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Dummy description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2023-01-03',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty({
    example: FilmCategory.ACTION,
  })
  @IsEnum(FilmCategory)
  @IsOptional()
  category?: string;

  userId: string;
}

export class FilmListDto {
  @ApiProperty({
    required: true,
    enum: FilmCategory,
  })
  @IsEnum(FilmCategory)
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: string;
}

export class RateFilmDto {
  @ApiProperty({
    type: String,
    example: '63f6dd9e22164821f67cac0a',
  })
  @IsMongoId()
  @IsNotEmpty()
  filmId: string;

  @ApiProperty({
    type: Number,
    enum: RatingEnum,
    // example: 2,
  })
  @IsEnum(RatingEnum, {
    message: 'Rating should be between 1 and 5',
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  userId: string;
}
