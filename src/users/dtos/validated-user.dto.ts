import { User } from '../user.entity';

export type ValidatedUserDto = Omit<User, 'password_hash'>;
