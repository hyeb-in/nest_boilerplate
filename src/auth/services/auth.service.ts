import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories';
import { LoginTokenDto } from '../dto';
import { User } from '../entities';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<LoginTokenDto> {
    // 1. 유저 확인
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id };

    // 2. 토큰 발급
    const [accessToken, refreshToken] = await Promise.all([
      this.publishAccessToken(user, payload),
      this.publishRefreshToken(user, payload),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findUserByEmail(email);

    const isMatched = await bcrypt.compare(password, user.password);
    if (!user || !isMatched)
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );

    return user;
  }

  async publishAccessToken(user: User, payload: any): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });

    return token;
  }

  async publishRefreshToken(user: User, payload: any): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });

    return token;
  }
}
