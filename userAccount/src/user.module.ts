import { Module } from '@nestjs/common';
import { MongoConfigService } from './services/config/mongo-config.service';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { UsersSchema, Users } from './schemas/user.schema';
import { TokensSchema, Tokens } from './schemas/tokens.schema';
import { FilmsSchema, Films } from './schemas/films.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { FilmService } from './services/film.service';
import { FilmController } from './controllers/film.controller';
import { Ratings, RatingsSchema } from './schemas/rating.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
        collection: 'users',
      },
      {
        name: Tokens.name,
        schema: TokensSchema,
        collection: 'tokens',
      },
      {
        name: Films.name,
        schema: FilmsSchema,
        collection: 'films',
      },
      {
        name: Ratings.name,
        schema: RatingsSchema,
        collection: 'ratings',
      },
    ]),
    HttpModule,
  ],
  controllers: [AuthController, FilmController],
  providers: [UserService, FilmService],
})
export class UserModule {}
