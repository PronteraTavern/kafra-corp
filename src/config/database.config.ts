import { registerAs } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Member } from '../trips/members/entities/members.entity';
import { Trip } from '../trips/entities/trip.entity';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  entities: [User, Trip, Member],
  synchronize: false,
}));
