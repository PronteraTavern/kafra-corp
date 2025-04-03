import { registerAs } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Member } from '../trips/members/entities/members.entity';
import { Trip } from '../trips/entities/trip.entity';
import { ChecklistItem } from '../trips/checklist/entities/checklist-item.entity';
import { ShoppingItem } from '../trips/shopping-items/entities/shopping-item.entity';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  entities: [User, Trip, Member, ChecklistItem, ShoppingItem],
  synchronize: false,
}));
