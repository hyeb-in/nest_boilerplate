import { Body, Controller, Post } from '@nestjs/common';
import { SignupResDto } from '../dto/signup-res.dto';
import { createUserDto } from '../dto/create-user.dto';
import { UserService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  async signup(@Body() createUserDto: createUserDto): Promise<SignupResDto> {
    const user = await this.userService.createUser(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
