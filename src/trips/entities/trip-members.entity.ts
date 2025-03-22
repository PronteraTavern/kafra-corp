import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Trip } from './trip.entity';
import { User } from '../../users/user.entity';

export enum TripRole {
  MEMBER = 'Member',
  ADMIN = 'Admin',
}

@Entity('trip_members')
@Unique(['trip_id', 'user_id']) // Ensures unique (trip_id, user_id) combination
export class TripMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne((_type) => Trip)
  // @JoinColumn()
  // trip: Trip;

  @Column()
  trip_id: string;

  // @ManyToOne((_type) => User)
  // @JoinColumn()
  // user: User;

  @Column()
  user_id: string;

  @Column()
  role: TripRole;

  @CreateDateColumn()
  joined_at: Date;
}
