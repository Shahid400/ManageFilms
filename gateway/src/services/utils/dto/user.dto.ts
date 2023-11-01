import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsISO8601,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { FilmCategory } from '../enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin1@yopmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'address...',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '2000-01-01',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  dob: string;

  @ApiProperty({
    example: [FilmCategory.ACTION, FilmCategory.ANIMATED],
  })
  @IsArray()
  @IsEnum(FilmCategory, { each: true })
  @IsNotEmpty()
  categories: FilmCategory[];

  @ApiProperty({
    minLength: 8,
    example: 'Test111@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\-_@$!%*?&])[A-Za-z\d\-_@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'admin1@yopmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    minLength: 8,
    example: 'Test111@',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password']),
) {
  userId?: string;
}

export class ChangePasswordDto extends PartialType(
  OmitType(LoginUserDto, ['email']),
) {
  email?: string;
}
