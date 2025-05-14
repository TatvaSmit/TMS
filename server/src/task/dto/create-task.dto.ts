import { IsString, IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100, { message: 'Title must be between 5 and 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 character long' })
  description: string;
} 