import { UserRole } from '../entities';

export type createUserDto = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
