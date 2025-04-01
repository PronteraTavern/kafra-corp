import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../users/user.entity';
import { Exclude } from 'class-transformer';
import { Trip } from '../../trip/entities/trip.entity';

export enum TripRole {
  MEMBER = 'Member',
  ADMIN = 'Admin',
}

@Entity('trip_members')
@Unique(['trip', 'user']) // Ensures unique (trip_id, user_id) combination
export class TripMember {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @ManyToOne(() => Trip, (trip) => trip.id, { nullable: false })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  role: TripRole;

  @CreateDateColumn()
  joined_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
