import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignupResDto } from '../dto/signup-res.dto';
import { createUserDto } from '../dto/create-user.dto';
import { AuthService, UserService } from '../services';
import { loginReqDto } from '../dto/login-req.dto';
import { LoginResDto } from '../dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('/signup')
  async signup(@Body() createUserDto: createUserDto): Promise<SignupResDto> {
    const user = await this.userService.createUser(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Post('/login')
  async login(
    @Body() loginReqDto: loginReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResDto> {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginReqDto.email,
      loginReqDto.password,
    );

    res
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .setHeader('Authorization', `Bearer ${accessToken}`);

    return user;
  }
}
