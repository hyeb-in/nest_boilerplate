import { BaseEntity } from 'src/common/entity';
import { Column, Entity } from 'typeorm';

export type UserRole = 'admin' | 'user';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
