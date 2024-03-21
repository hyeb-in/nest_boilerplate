import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUserDto } from '../dto/create-user.dto';
import { SignupResDto } from '../dto/signup-res.dto';
import { UserRepository } from '../repositories';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async createUser(createUserDto: createUserDto): Promise<SignupResDto> {
    const { email, password } = createUserDto;

    const isExist = await this.userRepo.findUserByEmail(email);
    if (isExist) throw new ConflictException('이미 존재하는 이메일 입니다.');

    const hashedPassword = await this.generateHashedPassword(password);
    return this.userRepo.createUser(createUserDto, hashedPassword);
  }

  async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateUser(id: string): Promise<User> {
    const user = this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

    return user;
  }
}
