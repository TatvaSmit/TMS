import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private signJWT(payload: any): string {
    return this.jwtService.sign(payload);
  }

  async signup(data: SignupDto) {
    // we are checking if user exists by email then we will 
    const existing = await this.userService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException({ status: HttpStatus.CONFLICT, message: 'Email already registered' });
    }

    if (!data.googleId) {
      if (!data.password) {
        throw new BadRequestException({ status: HttpStatus.BAD_REQUEST, message: 'Password is required for signup' });
      }
      const hashed = await bcrypt.hash(data.password, 10);
      const user = await this.userService.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashed,
      });
      const token = this.signJWT({ id: user._id });
      return { status: HttpStatus.CREATED, message: 'User is created', data: { id: user._id, token: token } };
    }
  }

  async login(data: LoginDto) {
    // Normal email login case
    if (!data.googleId) {
      const user = await this.userService.findByEmail(data.email);
      if (!user || !user.password) {
        throw new UnauthorizedException({ status: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' });
      }
      if (!data.password) {
        throw new UnauthorizedException({ status: HttpStatus.UNAUTHORIZED, message: 'Password is required' });
      }
      const valid = await bcrypt.compare(data.password, user.password);
      if (!valid) {
        throw new UnauthorizedException({ status: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' });
      }
      const token = this.signJWT({ id: user._id });
      return { status: HttpStatus.OK, message: 'Login successful', data: { id: user._id, token: token } };
    }
  }

  async handleGoogleAuth(body: any) {
    try {
      const { accessToken } = body;

      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new UnauthorizedException('Invalid Google access token');
      }

      const profile = await response.json();

      if (!profile.email_verified) {
        throw new UnauthorizedException('Google email not verified');
      }

      let user = await this.userService.findByEmail(profile.email);

      if (!user) {
        user = await this.userService.create({
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          googleId: profile.sub,
        });
      }

      const token = this.signJWT({ id: user._id });

      return {
        status: HttpStatus.OK,
        message: user ? 'Google login successful' : 'Google signup successful',
        data: { id: user._id, token },
      };
    } catch (error) {
      throw new InternalServerErrorException('Google login failed');
    }
  }

  async logout() {
    return { status: HttpStatus.OK, message: 'Logged out successfully' };
  }
}
