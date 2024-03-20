import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.repo.findOneBy({ email });
  }

  async createUser(
    createUserDto: createUserDto,
    hashedPassword: string,
  ): Promise<User> {
    const { name, email, role } = createUserDto;

    const user = this.repo.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return this.repo.save(user);
  }
}
