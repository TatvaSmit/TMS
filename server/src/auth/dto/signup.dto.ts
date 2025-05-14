import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: 'Firstname should be string only',
  })
  @MinLength(3)
  @MaxLength(20)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s'-]+$/, {
    message: 'Lastname should be string only',
  })
  @MinLength(3)
  @MaxLength(20)
  lastname: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}
